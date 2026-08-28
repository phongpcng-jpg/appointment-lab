# Decisions

## Approved
- D-001 JavaScript-only; no TypeScript.
- D-002 Modular monolith.
- D-003 All development work targets `feature/version2`; never `main` unless the user explicitly changes this.
- D-004 Requirements-first and explicit phase approval.
- D-005 Backend is the security/business-rule authority.
- D-006 Durable notifications first; transactional outbox approved.
- D-007 Appointment records have no scheduled date/time in the current version.
- D-008 Notifications have `readAt` and mark-one/mark-all-read operations.
- D-009 New/changed non-admin email must be verified; email change verifies only the new address.
- D-010 Google OAuth is login/link-only for existing provisioned accounts.
- D-011 Passkey registration requires an authenticated existing account; registered passkeys may authenticate the account.
- D-012 Access JWT is short-lived and held in memory; refresh token is opaque, stateful, hashed and transported in Secure/HttpOnly/SameSite cookie with applicable CSRF protection.
- D-013 Profile completion requires full name beyond the approved account/email requirements.
- D-014 ADMIN may reactivate DEACTIVATED users; ADMIN cannot be deleted/deactivated and admin email is immutable.
- D-015 PATIENT cannot cancel appointments.
- D-016 Pending-user deletion removes associated security-token records transactionally and allows email reuse.
- D-017 Appointment display sequence is increasing per provider/patient pair and need not be gapless.
- D-018 Direct PUBLIC creation emits the same appointment notifications as DRAFT→PUBLIC.
- D-019 Notification idempotency uses deterministic event keys with database uniqueness.
- D-020 Web Push preference defaults enabled; browser subscription requires user permission.
- D-021 REST API is versioned under `/api/v1`.
- D-022 Pagination uses page/pageSize, deterministic sorting and metadata.
- D-023 Password minimum is 12 characters; passphrases are allowed without forced composition.
- D-024 Approved rate limits: login 10/15m per IP+identifier; setup/reset 5/15m; OAuth 10/15m; passkey 10/15m; refresh 30/15m per session.
- D-025 Persistent PostgreSQL audit logs are required.
- D-026 Retention defaults: expired auth tokens 30d; revoked sessions 90d; notifications 1y; push subscriptions until invalid/unsubscribed; audit logs 2y.
- D-027 No additional profile/medical fields are introduced; reports are plain-text description only.
- D-028 Render deployment is real deployment when credentials/environment are available.

## Implementation defaults that do not alter business scope
- Generic SMTP configuration is environment-driven; sender identity is configured through environment.
- No appointment date filtering is implemented because appointments are currently unscheduled.
- User text search will use case-insensitive matching unless a later requirement specifies accent-aware semantics.
- Production frontend/backend origins remain environment-driven until deployment URLs exist.

## Phase 1
Foundation is implemented only; later business functionality remains phase-scoped.
