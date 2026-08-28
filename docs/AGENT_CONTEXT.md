# Agent Context

## Current phase
PHASE 1 — PROJECT FOUNDATION

## Status
COMPLETED. Phase 0 requirements are approved. Phase 1 foundation is implemented, documented and committed to `feature/version2`. Waiting for explicit approval before Phase 2.

## Repository
`phongpcng-jpg/appointment-lab`, development branch `feature/version2`. Never switch to `main` unless the user explicitly requests it.

## Completed phases
- Phase 0: requirements, architecture and decisions finalized.
- Phase 1: repository/workspace foundation, API/web shells, configuration, logging/error/security foundation, migration pipeline, tests and CI.

## Architecture
JavaScript-only npm workspace modular monolith. `apps/api` is Fastify/PostgreSQL/Knex. `apps/web` is React/Vite. Backend layering and later domain modules are documented in `docs/ARCHITECTURE.md`.

## Database
No business tables yet. Knex migration pipeline is established with a foundation guard table. Business schema starts in later phases.

## Authentication
Not implemented in Phase 1. Approved target: email/password, Google OAuth, WebAuthn, short-lived JWT access and opaque stateful refresh sessions.

## API
Foundation endpoints: `GET /health`, `GET /api/v1/health`. Stable error envelope includes status, code, message and requestId.

## Frontend
Minimal React/Vite shell with TanStack Query provider. Business UI starts in later phases.

## Security
Helmet, CORS, rate limiting, environment validation, request IDs and safe error handling are established. No secrets are committed; `.env` is ignored.

## Tests/build
Phase 1 provides Node test runner API health test, workspace lint/test/build scripts and GitHub Actions CI configuration.

## Known limitations
Dependencies are defined but no lockfile is committed yet. Full migration verification requires a reachable PostgreSQL instance. CI will install dependencies from package manifests.

## Next action
Wait for explicit user approval, then inspect Phase 1 and implement Phase 2 only.
