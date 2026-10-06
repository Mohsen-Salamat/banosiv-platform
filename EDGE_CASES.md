# Edge Cases

1. Two admins transition the same order version simultaneously → exactly one update succeeds; loser receives 409.
2. Same `Idempotency-Key` is replayed after success → existing order result is reused, not duplicated.
3. Inventory changes between read and transaction → conditional decrement fails and transaction rolls back.
4. Zarinpal callback says OK but server verification fails → payment remains failed; callback alone is not proof.
5. Stripe webhook is delivered twice → provider event uniqueness prevents duplicate application.
6. Order expires while payment is being initiated → transition must be reconciled server-side rather than trusting client state.
7. Redis is unavailable during a security-critical mutation → request fails closed rather than bypassing the guard.
8. Account is deleted while financial records remain → PII is anonymized without destroying retained financial records.
9. Provider response is malformed despite HTTP 200 → Zod rejects it and the provider is treated as unavailable/invalid.
10. A webhook signature is stale/outside tolerance → request is rejected before state mutation.
