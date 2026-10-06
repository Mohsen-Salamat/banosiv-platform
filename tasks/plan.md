# Implementation Plan

## Task 0 — Durable project state

Acceptance: canonical artifacts exist; no requirement silently dropped.

Verification: inspect artifacts; no runtime dependency required.

## Task 1 — Thin Slice domain core

Acceptance: product → order → versioned state → audit; idempotency key required.

Verification: unit tests for state and money; then integration tests once dependencies are installable.

## Task 2 — Payment boundaries

Acceptance: Zarinpal Redirect + Server Verify; Stripe signed webhook; payload schemas; idempotency.

Verification: provider contract tests; sandbox environment before live mode.

## Task 3 — Railway foundation

Acceptance: PostgreSQL and Redis deployed; app services only after GitHub source is available.

Verification: Railway environment status + service health.

## Task 4 — CI / hardening

Acceptance: check, lint, test, E2E, axe, audit, build; Docker topology; health endpoints.

## Task 5 — Module expansion

After Thin Slice gate: Auth, Admin, hardening, content, chat, business extensions, final deployment and handover.
