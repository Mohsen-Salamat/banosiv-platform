# Migration Guide

## What changed

The supplied v3.0 specification was mapped into durable repository artifacts and an executable Thin Slice foundation.

## What was replaced

- Arbitrary transition strings were replaced by a typed order-state allow-list.
- Untyped third-party payment payload handling was replaced by Zod schemas.
- Order creation now requires an idempotency key.

## What was removed

No source requirement was intentionally removed. Deferred items remain listed in `PRESERVATION.md`.

## What was promoted

Commerce, payment, audit, order-state, Redis, PostgreSQL and Railway infrastructure are active Thin Slice scope.

## What became artifacts

Discovery decisions, preservation, architecture, constants, conflicts, redundancy ownership, progress, risks, failure boundaries and visual validation are durable files.

## Risk eliminated early

Payment and persistence boundaries are exercised before broad feature expansion; production deployment is blocked rather than faked while GitHub is unavailable.
