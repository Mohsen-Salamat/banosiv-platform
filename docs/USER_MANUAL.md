# Owner Manual — Current Thin Slice

1. Open the configured Railway-hosted application URL.
2. Register/login once the auth UI is completed; the API already protects order creation server-side.
3. Browse products.
4. Create an authenticated order through the commerce client/API using a unique `Idempotency-Key`.
5. Start payment only in sandbox until provider credentials and unit semantics are approved.
6. Monitor `/api/v1/health` and the component health routes during staging.

Operational administration beyond this slice remains under the roadmap modules and is not represented as complete.
