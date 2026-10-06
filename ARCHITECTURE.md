# ARCHITECTURE.md

## 1. System Overview

Next.js 15 App Router is the application core. Prisma owns the PostgreSQL schema. Redis backs idempotency, rate limiting, cache and future Socket.IO scaling. BullMQ handles background work. A dedicated Socket.IO server handles real-time traffic. Caddy is the reverse proxy.

## 2. Directory Structure

- `app/` UI and `/api/v1` REST endpoints
- `lib/` domain/security/integration services
- `prisma/` schema and seed
- `server/` Socket.IO server
- `worker.ts` BullMQ worker entrypoint
- `components/` shared UI
- `tests/` unit and E2E/a11y tests
- `docs/` architecture support artifacts

## 3. Prisma / Data Model

Core entities: User, Session, AuthIdentity, OTPChallenge, IpBan, Product, Cart, CartItem, Order, OrderItem, Transaction, PaymentEvent, Refund, AuditLog, Content, ContentRevision, Notification, Ticket, ChatMessage.

Money is integer minor units. Database timestamps are UTC. Orders carry a `version` field for optimistic locking and an optional unique idempotency key.

## 4. API Surface

Public REST namespace: `/api/v1/*`. All request bodies are boundary-validated with Zod. Application errors use RFC 7807. Protected endpoints derive identity from the server session.

## 5. WebSocket Contracts

Dedicated `server/socket.ts` entrypoint. Channels are planned as `chat:user:{id}`, `admin:notifications`, and `support:queue`. Per-user connection and message limits are canonical constants.

## 6. State Machines

Order states and transitions are implemented in `lib/order-state.ts`. Transitions are an explicit allow-list and require current version matching. Conflicts return 409.

## 7. Authentication Flow

Email/password → Argon2id → session row → signed HTTP-only JWT cookie → server-side session lookup. Login lockout is per-account and an IP-ban record is maintained after repeated failures. OAuth, OTP and 2FA remain planned extensions.

## 8. Payment Flow

Zarinpal uses request → persisted authority → redirect → callback → server verify → amount/reference validation → transaction update. Stripe uses Checkout → signed webhook → idempotency → transaction update. Webhooks do not require user JWT authentication.

## 9. Caching Strategy

Redis is never the source of financial truth. Public content can use ISR and CDN caching. Cache stampede controls and exchange-rate fallback are Module 7 / Module 6 work.

## 10. Security Invariants

Validate → authorize → idempotency → transaction → audit → response. No client-provided userId is trusted. Secrets and PII are not written to logs. State-changing requests validate origin where a browser origin is supplied.

## 11. Failure Boundaries

Redis outage fails closed for security/payment-critical paths. PostgreSQL outage returns 503 after bounded retry policy. Provider failures keep payments pending/retryable. S3, SMTP and Socket.IO degradation follow the source specification.

## 12. Deployment Topology

Browser → Caddy → Next.js; `/socket.io/*` → dedicated Socket server. Next.js, worker and socket services share PostgreSQL/Redis. Media uses S3/CDN.

## 13. Open Questions

1. Exact GitHub repository/owner is not currently available through the connected GitHub account.
2. Exact Zarinpal merchant/account configuration and unit semantics need confirmation before live payments.
3. Exact Stripe live/test account and webhook secret are not configured.
4. Exact legal retention schedule, VAT rates and EU tax policy require owner/legal input.
5. SMTP/S3/Sentry credentials are not configured.

## 14. Changelog

See `EVOLUTION_LOG.md`.
