# CONFLICT_REGISTRY.md

| # | Observed | Rule applied | Resolution | Encoded where |
|---|---|---|---|---|
| 1 | Zarinpal redirect/callback language can be mistaken for webhook proof | R8 technical correctness | Redirect is navigation only; server verify is payment proof | `lib/payments/zarinpal.ts`, callback route |
| 2 | GDPR deletion can conflict with financial retention | P0 correctness | Anonymize personal identity; retain lawful financial records | `LOCKED_DECISIONS.md`, schema design |
| 3 | Edge-case counts differ (10 vs 7) | R2 stricter | Preserve 10 meaningful edge cases | `docs/EDGE_CASES.md` |
| 4 | Risk counts differ (8 vs 5) | R2 stricter | Preserve 8 risks | `docs/RISKS.md` |
| 5 | Content versioning is optional in one area but mandatory for selected content | explicit scope | Revision model is present; activation depends on selected content | `ARCHITECTURE.md`, schema |
| 6 | Offline Chat is P1 but Chat is a selected module | P1 preservation | Preserved; deferred to Module 5 | `PRESERVATION.md` |
| 7 | Self-audit can conflict with executable verification | explicit prohibition | CI/tests replace self-scoring | `.github/workflows/ci.yml`, `docs/ACCEPTANCE_REPORT.md` |
| 8 | P0/P1/P2 descriptions contain overlapping feature terms | priority hierarchy | Higher priority governs; duplicates consolidated by canonical owner | `REDUNDANCY_MAP.md` |
| 9 | Webhook endpoints are public callbacks while generic API says JWT for authenticated APIs | provider contract wins | Provider callbacks use provider verification, not user JWT | `app/api/v1/payment/*` |
| 10 | Redis outage breaks idempotency | security/correctness wins | Critical payment/idempotency paths fail closed | `lib/rate-limit.ts`, architecture |
| 11 | Strict webhook throttling could drop legitimate retries | provider availability | Provider-safe high ceiling replaces generic 20/min rule | architecture |
| 12 | MIME whitelist does not prove file safety | stricter security | Magic bytes and malware scanning remain required | `PRESERVATION.md` |
| 13 | Per-file approvals do not scale to batch work | checkpoint principle | Checkpoint artifacts preserve state every logical increment | `PROGRESS.md`, tasks |
| 14 | Visual effects can hurt performance/accessibility | performance/accessibility wins | Effects remain opt-in and reduced-motion aware | `CONSTANTS.md`, CSS, roadmap |
