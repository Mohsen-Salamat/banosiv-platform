# CONSTANTS.md

The canonical machine-readable project constants live in `lib/constants.ts`.

| Domain | Key values |
|---|---|
| Branding | Vazirmatn / Inter / 12px radius |
| Rate limits | auth 5/min; OTP 3/15min; admin mutation 10/min; public API 20/min; chat 10/min/user |
| Uploads | image 5MB; video 50MB; chunk threshold 10MB |
| WebSocket | 5 connections/user; 10KB/message |
| Security | Argon2id; 8-char minimum; 5/15m lockout; AES-256-GCM reserved; 24h idempotency TTL |
| Performance | Lighthouse 90; LCP 2500ms; INP 200ms; TTFB 800ms; TBT 200ms; CLS 0.1; main-route JS 300KB gzip |
| Cache | public Redis 300s; user Redis 60s; ISR 3600s; CDN 30d |
| Backup | DB daily; Redis daily; media weekly; retention 30d; monthly verification |
