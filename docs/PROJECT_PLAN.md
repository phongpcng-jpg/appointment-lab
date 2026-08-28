# Project Plan

## Objective
Production-oriented Appointment Management System as a JavaScript-only modular monolith.

## Approved stack
React/Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, native SSE/Web Push; Node.js/Fastify, PostgreSQL/Knex, JWT, bcrypt, Nodemailer/SMTP, Google OAuth 2.0 and WebAuthn/Passkeys.

## Architecture
Browser -> React SPA -> Fastify REST/SSE -> PostgreSQL. Backend uses routes/controllers, validation/DTOs, services, domain rules, repositories and infrastructure. Notifications use a transactional outbox.

## Roles and lifecycle
Exactly one ADMIN plus PROVIDER and PATIENT. Account status is PENDING/ACTIVE/DEACTIVATED; profile completion is independent. ADMIN is immutable for deletion/deactivation/email. Reactivation is an ADMIN capability.

## Appointment
Fields are provider, patient, note, status, display sequence, createdAt and updatedAt. No scheduled date/time in the current version. Sequence is increasing per provider/patient pair but not gapless. State machine: DRAFT -> PUBLIC -> IN_PROGRESS -> COMPLETE; PUBLIC/IN_PROGRESS -> CANCELED. COMPLETE/CANCELED terminal. DRAFT deletion is allowed.

## Reports
Appointment has 0..1 report. Patient manages report only while IN_PROGRESS. Completion requires a report. Terminal-state reports are immutable to patient; ADMIN may delete.

## Notifications
Persisted notification is source of truth. Read state uses `readAt`. Business events use deterministic idempotency keys. Transactional outbox asynchronously fans out to SSE, email and enabled Web Push.

## Authentication/security
Email/password, Google OAuth link/login for provisioned accounts, WebAuthn passkeys. Short-lived stateless JWT access token; opaque hashed stateful refresh session with rotation/revocation in Secure/HttpOnly/SameSite cookie. CSRF applies to cookie-authenticated operations. One-time security tokens are random, hashed, expiring and single-use. Password minimum 12 characters. Backend enforces auth, status, profile completion, role, ownership and state.

## Database plan
Business tables will be introduced in their relevant phases: users, refresh_sessions, oauth_identities, passkeys, account_setup_tokens, password_reset_tokens, email_verification_tokens, appointments, reports, notifications, notification_outbox, push_subscriptions, audit_logs. PostgreSQL constraints/indexes/transactions enforce invariants.

## API/frontend
REST `/api/v1`, stable error codes and request IDs. Frontend has centralized auth/query state, protected role routes, global PROFILE_INCOMPLETE handling, reusable tables/forms/search/dropdowns and notification SSE/push integration.

## Deployment
Render-friendly frontend static service, Fastify service and managed PostgreSQL. Environment-driven configuration, migrations, health checks, CORS, graceful shutdown and production security.

## Phase status
- Phase 0: COMPLETED — requirements and architecture approved by user.
- Phase 1: COMPLETED — foundation implemented and published in this commit.
- Phase 2: WAITING FOR EXPLICIT APPROVAL.

## Phase sequence
0 planning; 1 foundation; 2 user/auth foundation; 3 password/session security; 4 OAuth/passkeys; 5 user management; 6 appointments; 7 reports; 8 notifications/SSE; 9 Web Push; 10 complete frontend; 11 integration/security hardening; 12 Render deployment/final validation.
