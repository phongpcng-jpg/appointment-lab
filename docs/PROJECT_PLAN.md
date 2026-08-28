# Project Plan

## Architecture

Appointment Management System is a production-oriented JavaScript modular monolith. The frontend and backend are maintained as two independent npm packages for dependency, build, and deployment isolation; this does not make the backend a microservice.

- `frontend/`: React + Vite SPA.
- `backend/`: Node.js + Fastify API and domain application.
- PostgreSQL + Knex for persistence.
- REST API under `/api/v1`.

## Phase 1 — Repository & Foundation

Goal: establish a clean, independently runnable frontend/backend foundation without implementing business features from later phases.

Deliverables:
- two independent npm packages under `frontend/` and `backend/`;
- frontend React/Vite bootstrap with React Router and TanStack Query provider;
- backend Fastify bootstrap with request IDs, structured logging, security headers, CORS, rate limiting, and stable error handling;
- Zod environment/request-validation foundation;
- PostgreSQL/Knex configuration and migration infrastructure;
- health endpoints;
- automated backend/frontend tests and CI;
- environment examples and development documentation.

Explicitly out of scope for Phase 1:
- user/authentication implementation;
- appointment/report/notification business modules;
- OAuth/passkeys;
- SSE/Web Push/email delivery;
- production deployment execution.

## Phase 2 — User Model & Authentication Foundation
Implement users, roles/status, profiles, admin provisioning, email verification/setup, password authentication, JWT access tokens, refresh sessions, logout, and forced profile completion.

## Phase 3 — OAuth & Passkeys
Implement Google OAuth account linking/login and WebAuthn passkey registration/authentication.

## Phase 4 — Authorization & User Management
Implement RBAC, ownership enforcement, user management, deactivation/reactivation, and profile update rules.

## Phase 5 — Appointment Management
Implement appointment model, strict state transitions, sequence allocation, cancellation/completion rules, concurrency protection, and appointment APIs/UI.

## Phase 6 — Reports
Implement patient reports, completion requirement, ownership and provider/admin access rules.

## Phase 7 — Notifications
Implement persistent notifications, idempotent event generation, read state, transactional outbox, and email notification delivery foundation.

## Phase 8 — Real-time & Web Push
Implement SSE delivery, reconnect behavior, Web Push subscriptions/preferences, and notification fan-out.

## Phase 9 — Frontend Product Workflows
Implement protected routing, profile completion enforcement, role-specific dashboards, search/filter/sort/pagination, and responsive UX.

## Phase 10 — Security Hardening
Implement production security controls, rate limits, token/session hardening, audit logging, security headers, CSRF defenses where applicable, and abuse protection.

## Phase 11 — Testing & Quality
Expand unit, integration, API, authorization, state-machine, concurrency, notification, frontend, and end-to-end coverage.

## Phase 12 — Deployment
Prepare and, when credentials/environment are supplied, deploy frontend/backend/PostgreSQL on Render with environment-based production configuration.

## Phase protocol

Each phase is implemented incrementally. After implementation: run applicable tests, update documentation, commit/publish only to `feature/version2`, report results and limitations, then stop for explicit approval before the next phase.
