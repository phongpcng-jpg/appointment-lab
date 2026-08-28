# Appointment Management System — Requirements

## Status
Phase 0 — planning only. No application implementation is included.

## Source of truth
This document normalizes the supplied PROJECT EXECUTION PROMPT and AGENT INSTRUCTIONS. No business rule omitted from those sources is silently invented.

## Core requirements
- 100% JavaScript; no TypeScript.
- Modular monolith: React/Vite frontend, Node.js/Fastify backend, PostgreSQL/Knex.
- Exactly three roles: ADMIN, PROVIDER, PATIENT; exactly one ADMIN.
- ADMIN is provisioned from `ADMIN_EMAIL`; no default password; one-time setup email/token.
- Account status: PENDING, ACTIVE, DEACTIVATED. Profile completion is independent.
- Email/password, Google OAuth, WebAuthn/passkeys.
- Stateless short-lived JWT access tokens; stateful opaque rotating refresh sessions.
- Secure password setup/reset, email verification where required, rate limiting and authorization.
- ADMIN creates PROVIDER; ADMIN/PROVIDER create PATIENT; creators never set passwords.
- ADMIN can manage users except itself; pending users may be hard-deleted.
- Deactivation invalidates sessions and cancels PUBLIC/IN_PROGRESS appointments while preserving DRAFT/COMPLETE/CANCELED.
- Appointment lifecycle: DRAFT -> PUBLIC -> IN_PROGRESS -> COMPLETE; PUBLIC/IN_PROGRESS may -> CANCELED. COMPLETE/CANCELED terminal.
- Appointment provider/patient assignments are immutable after creation.
- Provider+patient display sequence is increasing, non-primary-key, and never renumbered.
- IN_PROGRESS -> COMPLETE requires an existing report; report is 0..1 per appointment.
- Patient manages own report only during IN_PROGRESS; provider reads; admin may delete; terminal reports are immutable except approved admin deletion.
- Notifications are persisted first, then delivered through SSE/email/Web Push.
- SSE is authenticated and user-isolated. Web Push supports multiple subscriptions and user enable/disable preference.
- REST APIs expose stable machine-readable error codes; frontend uses codes, not message parsing.
- Backend independently enforces auth, authorization, ownership, profile completion, account state, and domain state.
- Render-friendly deployment with environment configuration, migrations, health checks, CORS, SMTP, OAuth and VAPID settings.

## Explicitly unresolved
See `docs/OPEN_QUESTIONS.md`. Phase 0 must be approved with these questions answered before implementation begins.
