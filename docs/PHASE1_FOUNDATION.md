# Phase 1 — Project Foundation

## Objective
Establish a runnable JavaScript-only modular-monolith foundation with independent frontend and backend npm packages, without implementing business domains from later phases.

## Scope implemented
- independent `backend/` and `frontend/` npm packages (no root npm workspace)
- Fastify API with `/health` and `/api/v1/health`
- request ID and structured Fastify/Pino logging
- security headers, CORS, global rate limiting
- stable JSON error envelope with request ID and optional validation details
- Zod environment and validation foundation
- PostgreSQL/Knex configuration and migration infrastructure
- React/Vite shell with React Router and TanStack Query providers
- frontend API client and Zod response-schema foundation
- Tailwind CSS + Vite foundation
- ESLint foundation for both packages
- Node test runner with backend validation/health tests and frontend schema tests
- GitHub Actions CI for independent frontend/backend lint, test and build jobs
- `.env.example` and development documentation

## Explicitly deferred
Authentication, users, appointments, reports, notifications, SSE, Web Push, OAuth, WebAuthn and business schema are later phases.

## Verification status
Implementation is committed to `feature/version2`. Local dependency installation and full CI execution require network access to npm and, for migration integration tests, a PostgreSQL instance. Those external executions are not claimed as passed unless their results are available.

## Acceptance criteria
- frontend and backend install independently
- API starts and exposes health endpoints
- frontend has a real router/provider foundation and builds through Vite
- lint/test/build scripts exist independently for both packages
- migration command is defined and loads environment configuration
- secrets are not committed
- development branch remains `feature/version2`
