# Failure Boundaries

| Service | Failure | Behavior | UX | Alert |
|---|---|---|---|---|
| PostgreSQL | unavailable | bounded retry, then 503 | Retry | Immediate |
| Redis | unavailable | auth/payment critical paths fail closed | Degraded | Immediate |
| Zarinpal/Stripe | unavailable | payment remains pending/retryable | Processing | Threshold |
| SMTP | down | BullMQ retry/DLQ | Delayed | Queue alert |
| S3 | unavailable | resumable retry | Paused upload | Alert |
| Socket server | down | offline/ticket fallback | Offline state | Alert |
| BullMQ | crash | retry + DLQ | Background | Immediate |
| Sentry | down | local Pino logging continues | Unchanged | None |
| Exchange rate API | down | DB fallback + stale indicator | Stale rate | Alert |
| CAPTCHA | unavailable | do not bypass security blindly | Retry/challenge | Alert |
| CDN | unavailable | safe fallback/origin | Slower | Alert |
| Backup | unavailable | keep last verified backup | Unchanged | Immediate |
