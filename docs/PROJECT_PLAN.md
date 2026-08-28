# Project Plan

## Objective
Production-oriented Appointment Management System implemented as a modular monolith with React/Vite, Node.js/Fastify, PostgreSQL and JavaScript only.

## Phase 0 status
Planning is drafted from the supplied execution and agent prompts. Application coding must not start until the open questions are answered and this plan is approved.

## Architecture
Frontend: React + Vite + React Router + TanStack Query + React Hook Form + Zod + Tailwind CSS + native EventSource + Web Push API.
Backend: Fastify routes/controllers -> schemas/DTOs -> services/use cases -> domain rules -> repositories -> infrastructure. Cross-cutting plugins handle config, auth, authorization, errors, logging, rate limits and SSE.
Database: PostgreSQL via Knex migrations/transactions/constraints/indexes.
Deployment: separate frontend static service, backend web service, PostgreSQL; environment configuration; health endpoint; graceful shutdown.

## Modules
Authentication, users/profiles, sessions, OAuth identities, passkeys, setup/reset/verification tokens, appointments, reports, notifications, push subscriptions, administration.

## Domain model
User 1:N refresh sessions, OAuth identities, passkeys, setup/reset/verification tokens, notifications, push subscriptions. Provider/User and Patient/User participate in appointments. Appointment 1:0..1 Report. Notifications may reference appointments. Appointment has immutable provider/patient assignment and a provider+patient display sequence.

## Authorization matrix
| Capability | ADMIN | PROVIDER | PATIENT |
|---|---|---|---|
| View users | All, except self via normal management | No general user management | No |
| Create provider | Yes | No | No |
| Create patient | Yes | Yes | No |
| Deactivate users | Yes, not self/admin | No | No |
| Delete PENDING user | Yes | No | No |
| View appointments | All | Own only | Own only |
| Create appointment | Active provider + active patient | Self + active patient | No |
| Create DRAFT/PUBLIC | Yes | Yes | No |
| PUBLIC -> IN_PROGRESS | Yes | Own | Own |
| IN_PROGRESS -> COMPLETE | Yes, report required | Own, report required | No |
| Cancel valid appointment | Yes | Own | No explicit cancellation permission in source |
| Update note | DRAFT/PUBLIC/IN_PROGRESS | Own | No explicit note permission in source |
| Delete DRAFT | Yes | Own | No |
| View reports | All | Own appointments | Own appointment |
| Create/update/delete report | Admin delete only | No | Own, while IN_PROGRESS |
| Manage passkeys | Own | Own | Own |
| Notifications | Own recipient records | Own recipient records | Own recipient records |

## Account lifecycle
PENDING -> ACTIVE after password setup. ACTIVE may have profileCompleted=false. Deactivation is ACTIVE/operational state separate from profile completion. Deactivated users cannot log in; sessions are invalidated. Admin is singleton and immutable in deletion/deactivation/email.

## Appointment state machine
DRAFT -> PUBLIC -> IN_PROGRESS -> COMPLETE. PUBLIC -> CANCELED. IN_PROGRESS -> CANCELED. COMPLETE/CANCELED are terminal. DRAFT deletion is allowed. DRAFT involving a deactivated account remains DRAFT and cannot be published. Deactivation transactionally cancels PUBLIC/IN_PROGRESS appointments.

## Report lifecycle
Appointment has zero or one report. Patient create/update/delete only during IN_PROGRESS. Once COMPLETE/CANCELED, report cannot be updated/deleted by patient; admin deletion remains an explicit administrative capability. Completion requires report existence.

## Notification architecture
Business transaction persists notification before delivery. A notification service then fans out to authenticated SSE connections, email and enabled Web Push subscriptions. Delivery failures are isolated from business transaction success. Recipient filtering is authorization-based. Duplicate creation prevention must be designed using event/idempotency semantics.

## Authentication architecture
Email/password; Google OAuth; WebAuthn. Access token is short-lived JWT. Refresh token is random opaque and hashed at rest, with expiry, rotation, revocation and session tracking. Setup/reset/verification tokens are random, hashed, expiring and one-use. Security-sensitive changes invalidate relevant sessions according to the approved policy.

## Database plan
Initial candidate tables: users, refresh_sessions, oauth_identities, passkeys, account_setup_tokens, password_reset_tokens, email_verification_tokens, appointments, reports, notifications, push_subscriptions. Final columns, enums/checks, indexes and deletion behavior require Phase 0 approval.

## API plan
REST under a versioned namespace (proposed `/api/v1`). Domains: auth, users/profile, sessions, OAuth, passkeys, appointments, reports, notifications, push subscriptions, admin. Responses use DTOs, never persistence objects. Errors contain status/code/message/optional validation details/request ID.

## Frontend plan
Central API client, auth/session state, query cache, global PROFILE_INCOMPLETE handling, protected/role routes, reusable tables/forms/dropdowns, notification center, SSE lifecycle and push preference management. Profile completion page remains reachable while normal business pages are blocked.

## Security/testing
Backend-first authorization; validation at boundaries; bcrypt password hashing; secure random tokens; secure cookies where selected; CORS/headers/rate limiting; no secret logs; transaction boundaries; ownership/state checks. Test auth, authorization, constraints, state machine, report cardinality, deactivation effects, notifications, SSE isolation, push/email failure isolation, builds and migrations.

## Phase sequence
0 Planning and approval. 1 Foundation. 2 User/auth foundation. 3 Password/session security. 4 OAuth/passkeys. 5 User management. 6 Appointments. 7 Reports. 8 Notifications/SSE. 9 Web Push. 10 Complete frontend. 11 Integration/security hardening. 12 Render deployment/final validation. Each phase ends with tests, documentation, commit/publish, report and STOP.

## Git workflow
Target repository: `phongpcng-jpg/appointment-lab`. Development branch: `feature/version2`. Never commit project work to `main`. Use logical commits per completed unit/phase. The existing branch currently contains only README.md.
