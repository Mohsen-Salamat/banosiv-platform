# BANOSIV Business Platform

Production-oriented Next.js 15 commerce foundation governed by the supplied MASTER PROMPT v3.0.

## Current execution state

- Railway production project exists and PostgreSQL + Redis have been provisioned.
- GitHub has no connected installation and no accessible repository, so remote repository creation/push is blocked by the available GitHub integration state.
- Thin Slice code is scaffolded locally around Prisma, Redis, authenticated order creation, optimistic order transitions, payment provider boundaries, health checks, Docker and CI.
- Runtime verification is **NOT VERIFIED** until dependencies can be installed and the application is deployed from a connected GitHub repository.

## Required commands

```bash
npm ci
npm run prisma:generate
npm run check
npm run lint
npm test
npm run build
npm run test:e2e
npm run test:a11y
```

## Local infrastructure

`docker compose up --build` provides Next.js, PostgreSQL, Redis, BullMQ worker, Socket.IO server and Caddy.

Never use the development credentials from `docker-compose.yml` in production.
