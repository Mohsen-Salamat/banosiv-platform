# Technical Risks

| Risk | Probability | Impact | Prevention | Recovery |
|---|---|---|---|---|
| GitHub connection unavailable | High | High | Keep remote dependency explicit | Connect GitHub app/repo; resume deployment |
| Payment unit mismatch (especially Zarinpal) | Medium | Critical | Confirm currency/unit contract before live mode | Disable live payments; reconcile transactions |
| Redis outage | Medium | High | Fail-closed critical paths + alert | Restore Redis; retry safe operations |
| Schema migration drift | Medium | High | Prisma migrations only | Expand-contract migration + rollback plan |
| Provider webhook duplication | High | High | Unique event IDs + idempotency | Reconcile event log and transaction state |
| Session revocation semantics drift | Medium | High | DB-backed sessions | Revoke sessions and rotate auth implementation |
| CI dependency installation failure | Medium | High | Commit lockfile when registry access exists | Regenerate lockfile and rerun CI |
| Production backup not restorable | Low | Critical | Monthly restore verification | Restore last verified backup and run smoke tests |
