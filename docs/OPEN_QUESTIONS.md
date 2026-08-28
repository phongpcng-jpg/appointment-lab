# Open Questions — Phase 0 Final

All blocking and high-impact questions have been resolved. Remaining items are implementation-level defaults and can be revisited only through change management.

## Resolved
- Appointment has no scheduled date/time in the current version.
- Notifications use `readAt` and mark-one/mark-all-read.
- New/changed non-admin email must be verified; only the new address is verified during email change.
- Google OAuth is login/link-only for provisioned accounts.
- Passkey registration requires an authenticated existing account; passkey-only login follows registration.
- Refresh token uses Secure/HttpOnly/SameSite cookie with applicable CSRF protection.
- Profile completion requires full name.
- ADMIN may reactivate deactivated users.
- PATIENT cannot cancel appointments.
- Pending-user deletion removes associated security-token records transactionally and permits email reuse.
- Appointment sequence is increasing but not gapless.
- Direct PUBLIC creation triggers the same notifications as DRAFT→PUBLIC.
- Notification idempotency uses deterministic event keys and database uniqueness.
- Transactional outbox is approved.
- Web Push preference defaults enabled; browser permission/subscription remains user-controlled.
- API uses `/api/v1`.
- Pagination uses page/pageSize with deterministic sorting and metadata.
- Password minimum is 12 characters with passphrase support.
- Rate limits use the approved Phase 0 defaults.
- Audit logs are persistent in PostgreSQL.
- Retention defaults are approved.
- No extra profile/medical fields; reports are plain-text.
- Render deployment will be performed when credentials/environment are available.

## Implementation defaults
- Generic SMTP provider and sender identity are environment-driven.
- User text search is case-insensitive; accent-aware search is not required by the current scope.
- Appointment date filtering is absent because appointments are unscheduled.
- Production origins are environment-driven until deployment URLs are known.

No Phase 0 blocker remains.
