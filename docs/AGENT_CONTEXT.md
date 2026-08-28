# Agent Context

## Current project
Appointment Management System — production-oriented JavaScript modular monolith.

## Repository rule
All implementation and documentation changes must be committed only to `feature/version2` unless the user explicitly instructs otherwise. Do not switch to or commit to `main` autonomously.

## Package architecture
The repository intentionally contains two independent npm packages:
- `frontend/`: React + Vite SPA.
- `backend/`: Node.js + Fastify API.

This separation is a package/build/deployment boundary only. The backend remains a modular monolith; microservices are not being introduced.

## Current phase
Phase 1 — Repository & Foundation.

## Phase 1 status
Foundation refactor and implementation are in progress/final verification. No Phase 2 business implementation should begin until Phase 1 is explicitly approved by the user.

## Confirmed decisions
- Appointment has no scheduled date/time for the current version.
- Notifications support `readAt`, mark-one, and mark-all.
- New email addresses must be verified before normal use.
- Google OAuth links/logs in only to provisioned accounts.
- Passkey registration requires an authenticated existing account.
- Access JWT is stateless; refresh sessions are stateful and cookie-based in the web architecture.
- Profile completion requires the agreed minimum profile state including valid email policy and `fullName`.
- ADMIN can reactivate users.
- PATIENT cannot cancel appointments.
- Notification delivery uses a transactional outbox.
- Web Push preference defaults to enabled; browser permission/subscription is separate.
- Password minimum is 12 characters.
- Persistent PostgreSQL `audit_logs` is required.
- API pagination uses page/pageSize with total metadata.
- Render deployment is performed when required credentials/environment are supplied.
- Appointment sequence is unique per provider/patient and does not need to be gapless.
- Direct creation as PUBLIC emits the same notification behavior as DRAFT → PUBLIC.
- Notification idempotency uses deterministic business-event keys plus database uniqueness.
- API versioning uses `/api/v1`.
- Agreed rate-limit defaults are documented in project decisions.
- Agreed data retention policy is documented in project decisions.
- Profiles do not add unapproved medical/demographic fields.
- Reports are plain-text descriptions for the current scope.

## Phase protocol
After each phase: test, document, publish/commit to `feature/version2`, report, and stop for explicit approval.
