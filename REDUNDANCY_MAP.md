# REDUNDANCY_MAP.md

| Concept | Canonical owner |
|---|---|
| Idempotency | `lib/idempotency.ts` |
| Optimistic locking | `lib/services/order.service.ts` + `Order.version` |
| Audit | `lib/audit.ts` + AuditLog model |
| Rate limiting | `lib/rate-limit.ts` + Redis |
| UTC | `ARCHITECTURE.md` / database policy |
| Currency | `lib/money.ts` + `CONSTANTS.md` |
| JWT/session | `lib/auth.ts` |
| Payment providers | `lib/payments/provider.ts` |
| Zarinpal | `lib/payments/zarinpal.ts` |
| Stripe | `lib/payments/stripe.ts` |
| Webhook verification | provider route + provider adapter |
| Refund state | `Refund` model + Module 3 |
| PII masking | `lib/logging.ts` |
| Encryption | secrets/config policy; reserved implementation |
| Cache | Redis policy in `ARCHITECTURE.md` |
| Testing | `package.json` scripts + `tests/` |
| Accessibility | `tests/a11y.spec.ts` + UI conventions |
| Upload | media module policy in master prompt |
| Socket.IO | `server/socket.ts` |
| Redis | `lib/redis.ts` |
| Backups | Railway/deployment operations policy |
