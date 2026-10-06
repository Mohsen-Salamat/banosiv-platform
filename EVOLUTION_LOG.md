# EVOLUTION_LOG.md

| # | Change | Type | Reason | Applied In |
|---|---|---|---|---|
| 1 | Converted giant prompt into durable repository artifacts | consolidation | Prevent state drift across sessions | root docs |
| 2 | Locked Thin Slice first | roadmap | Exercise payment/DB/auth/order risk before breadth | `tasks/plan.md` |
| 3 | Added unique order idempotency key | security/correctness | Business mutation must be replay-safe | Prisma + order service |
| 4 | Added IP failure-ban record | security | Preserve 10-failures/1-hour requirement | Prisma + auth |
| 5 | Constrained order transitions to Prisma enum values | correctness | Reject arbitrary client strings | validation |
| 6 | Removed untyped payment JSON parsing | security/quality | No `any`; validate external payloads | payment adapters |
| 7 | Added browser origin checking on sensitive mutation | security | Preserve CSRF boundary | `lib/http.ts` + routes |
| 8 | Added explicit health sub-routes | operations | Match baseline health contract | health routes |
| 9 | Added Docker/Compose topology | deployment | Make architecture reproducible | Docker files |
| 10 | Added CI gate structure | verification | Executable controls replace self-audit | GitHub Actions |
