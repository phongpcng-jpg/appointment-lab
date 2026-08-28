# Phase 1 — Project Foundation

## Objective
Establish a runnable JavaScript-only monorepo foundation without implementing business domains from later phases.

## Scope completed
- npm workspaces for API and web applications
- Fastify API with `/health` and `/api/v1/health`
- environment validation with Zod
- PostgreSQL/Knex configuration and foundation migration
- security headers, CORS, global rate limiting
- stable JSON error envelope with request ID
- React/Vite shell with TanStack Query provider
- ESLint/Prettier foundation
- Node test runner and API health test
- GitHub Actions CI for lint, test and build
- `.env.example` and development README

## Explicitly deferred
Authentication, users, appointments, reports, notifications, SSE, Web Push, OAuth, WebAuthn and business schema are later phases.

## Acceptance criteria
- workspace installs successfully
- API starts and exposes health endpoints
- frontend builds
- lint/test/build scripts exist for workspace packages
- migration command is defined
- secrets are not committed
- development branch remains `feature/version2`
