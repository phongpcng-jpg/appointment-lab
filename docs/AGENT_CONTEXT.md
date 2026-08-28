# Agent Context

## Current phase
PHASE 1 — PROJECT FOUNDATION

## Status
COMPLETED. Phase 0 requirements are approved. Phase 1 foundation is implemented, documented and committed to `feature/version2`. A package-structure refactor has also been completed. Waiting for explicit approval before Phase 2.

## Repository
`phongpcng-jpg/appointment-lab`, development branch `feature/version2`. Never switch to `main` unless the user explicitly requests it.

## Completed phases
- Phase 0: requirements, architecture and decisions finalized.
- Phase 1: repository foundation, API/web shells, configuration, logging/error/security foundation, migration pipeline, tests and CI.
- Package refactor: backend and frontend split into independent npm packages.

## Architecture
JavaScript-only modular monolith with two independent packages. `backend/` is Fastify/PostgreSQL/Knex. `frontend/` is React/Vite. There is no root npm workspace/package. Backend layering and later domain modules are documented in `docs/ARCHITECTURE.md`.

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
Backend and frontend each own their test/lint/build scripts. GitHub Actions runs verification independently from `backend/` and `frontend/` on `feature/version2`.

## Known limitations
Dependencies are defined but no lockfiles are committed yet. Full migration verification requires a reachable PostgreSQL instance. CI installs dependencies from the individual package manifests.

## Next action
Wait for explicit user approval, then inspect the refactored foundation and implement Phase 2 only.
