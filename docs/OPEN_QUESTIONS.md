# Open Questions — Phase 0

These questions block implementation because the supplied prompts explicitly require asking instead of guessing when requirements are ambiguous.

## Q1 — Appointment scheduling fields (BLOCKER)
The appointment domain specifies provider, patient, note, status, sequence, createdAt and updatedAt, but user management/filtering language does not define an appointment date/time. Do appointments represent scheduled times? If yes, specify fields and timezone semantics (e.g. `scheduledStartAt`, optional end/duration, stored UTC, display timezone). If no, confirm appointments are unscheduled records.

## Q2 — Appointment list sorting/filtering (HIGH)
Appointment requirements say filter by provider/patient/status and pagination, but no appointment date filter is specified. Confirm desired sort options and whether date filtering should exist after Q1.

## Q3 — Notification read/unread (HIGH)
The source says “Implement read/unread functionality if required by the final UI plan” and separately says to clarify if needed. Choose: A) implement read/unread (`readAt`, mark one/all read), or B) persisted notifications are display-only for now.

## Q4 — Email verification (HIGH)
Email verification is mentioned as a workflow and as “where required”, while profile email changes require an appropriate verification/security mechanism. Confirm whether: A) every new/changed non-admin email must be verified before normal operations, B) only email changes require verification, or C) a different policy. Also confirm whether unverified accounts can log in and whether verification expires/revokes sessions.

## Q5 — Email change flow (HIGH)
For non-admin email changes, choose the intended UX: A) authenticated user requests change, verification goes to the new address and email changes only after confirmation; B) verify both old and new addresses; or C) another flow. Admin email remains immutable.

## Q6 — Google OAuth account creation (HIGH)
The prompts clearly support linking an existing account but do not explicitly define whether Google may create a brand-new PROVIDER/PATIENT account. Recommended: Google OAuth is login/link-only for already provisioned accounts; no public role selection or self-registration. Confirm.

## Q7 — Passkey first-use policy (HIGH)
Passkeys are stated to be available for existing users. Confirm whether passkey registration requires an authenticated existing session/password login (recommended), and whether passkey-only login is allowed after registration.

## Q8 — Browser credential storage (HIGH)
Choose access/refresh token transport. Recommended web architecture: short-lived access token held in memory and refresh token in Secure + HttpOnly + SameSite cookie, with CSRF protection for cookie-authenticated refresh/logout endpoints. Confirm whether this is acceptable.

## Q9 — CSRF scope (MEDIUM)
The source says CSRF “where applicable.” This depends on the token transport chosen in Q8. Confirm recommended cookie policy above or specify another model.

## Q10 — Timezone policy (HIGH)
If Q1 introduces scheduled times, confirm canonical timezone storage/display. Recommended: store instants in PostgreSQL (`timestamptz`/UTC semantics), display in user-selected or application timezone. Need to know whether each user has a timezone profile field.

## Q11 — Appointment cancellation authority (HIGH)
ADMIN and PROVIDER explicitly have cancellation permissions; PATIENT is not granted cancellation in the source. Confirm PATIENT cannot cancel appointments.

## Q12 — Patient appointment creation visibility (MEDIUM)
PATIENT can view their own DRAFT appointments, which implies DRAFT is visible to the patient. Confirm whether patient should be notified when an appointment is created as DRAFT, or only when PUBLIC/events listed in notification requirements occur. Recommended: no notification for DRAFT creation.

## Q13 — Initial profile completeness (HIGH)
Required profile information includes full name, but creation allows optional personal information. Confirm exactly which fields make `profileCompleted=true`: recommended only `fullName` beyond immutable/verified email, since password is account state rather than profile. If phone/address are mandatory, specify them.

## Q14 — Deactivation eligibility (MEDIUM)
The source says ADMIN can deactivate users but does not explicitly restrict target status. Confirm: recommended only ACTIVE PROVIDER/PATIENT can be deactivated; PENDING accounts should use pending deletion instead; ADMIN is never eligible.

## Q15 — Reactivation (MEDIUM)
No reactivation operation is specified. Confirm DEACTIVATED is permanent through current UI/API, or whether ADMIN should be able to reactivate users.

## Q16 — Hard deletion of PENDING users (MEDIUM)
Confirm whether deleting a PENDING user also removes all associated security-token records and whether email address can subsequently be reused immediately. Recommended yes, transactionally and securely.

## Q17 — Sequence concurrency (HIGH)
Provider+patient appointment sequence must be increasing without duplicates under concurrent creation. Confirm whether strict gapless numbering is NOT required (recommended); deleted records already imply gaps are acceptable. Implementation would use a transaction/locking strategy to guarantee uniqueness and monotonic allocation under concurrency.

## Q18 — Appointment creation as PUBLIC (HIGH)
ADMIN/PROVIDER may create DRAFT and PUBLIC. Confirm PUBLIC creation immediately emits the same notifications as DRAFT→PUBLIC. The source strongly implies yes.

## Q19 — Deactivation notification (MEDIUM)
Deactivation causes appointment cancellations, but the notification list only explicitly includes “appointment canceled.” Confirm whether affected provider/patient should receive cancellation notifications for each automatically canceled appointment. Recommended yes.

## Q20 — Notification duplicate/idempotency strategy (HIGH)
The source requires avoiding duplicate notifications but does not specify an event identity. Recommended notification events carry a deterministic business-event key (e.g. appointment ID + transition/event type) protected by a database uniqueness constraint. Confirm.

## Q21 — Notification delivery model (MEDIUM)
The source says email/Web Push should not corrupt the transaction and suggests asynchronous patterns. Choose A) in-process post-commit delivery with retry/outbox planned later, or B) transactional outbox table now. Recommended B for production reliability, but it adds a table/module not explicitly listed. Please confirm.

## Q22 — Web Push default (MEDIUM)
“New account Web Push notifications enabled by default” is specified, but browser permission cannot be silently granted. Confirm interpretation: preference defaults enabled in DB, while browser subscription exists only after user grants permission.

## Q23 — API versioning (LOW)
REST is required but versioning is not specified. Recommended `/api/v1`. Confirm.

## Q24 — Pagination convention (LOW)
No pagination contract is specified. Recommended `page`, `pageSize`, deterministic sort, and response metadata (`items`, `page`, `pageSize`, `totalItems`, `totalPages`). Confirm or specify cursor pagination.

## Q25 — Search semantics (MEDIUM)
User search fields are specified but matching semantics are not. Recommended case-insensitive partial matching for text fields with normalized email search; confirm whether accent-insensitive search is required.

## Q26 — Password policy (HIGH)
No minimum length/complexity or breached-password policy is specified. Security implementation needs a concrete policy. Recommended minimum 12 characters and allow passphrases without forced composition rules, plus rate limiting. Confirm.

## Q27 — Rate-limit thresholds (HIGH)
Rate limiting/brute-force protection is required but thresholds are unspecified. Need approved limits for login, setup/reset, OAuth initiation/callback, passkey operations and refresh. We can propose safe defaults in Phase 0, but should not silently choose them.

## Q28 — Audit log persistence (MEDIUM)
The source requires useful logs but does not require an audit_log database table. Confirm whether application structured logs are sufficient or whether immutable audit records must be persisted in PostgreSQL. Recommended persisted audit log for security-sensitive/business actions if compliance/auditability matters.

## Q29 — Data retention/privacy (MEDIUM)
No retention/deletion policy is specified for notifications, sessions, tokens, push subscriptions or audit logs. Confirm retention requirements or approve sensible defaults documented as operational policy.

## Q30 — User profile fields (MEDIUM)
Only full name/address/phone are specified. Confirm no date of birth, gender, emergency contact, provider specialty, patient medical fields, avatar, etc. are required. We should not add them without approval.

## Q31 — Report content/attachments (MEDIUM)
Report currently has only required description. Confirm plain text only; no files/attachments, rich text, signatures, diagnoses, or structured medical fields unless explicitly added.

## Q32 — CORS/deployment topology (LOW)
Confirm expected production frontend/backend origins once deployment URLs are known. Architecture will keep them environment-driven.

## Q33 — Email provider and sender identity (LOW)
SMTP is required but provider/from-address are unspecified. Confirm whether generic SMTP env configuration is acceptable and which sender identity will be used in deployment.

## Q34 — Render deployment responsibility (LOW)
Confirm whether Phase 12 should actually deploy to Render when credentials are available, or only provide deployment configuration/runbook.

## Recommended decisions needing explicit approval
The highest-impact recommendations are Q1 (scheduling), Q3 (notification read state), Q4–Q10 (identity/security flows), Q13 (profile completion), Q15 (reactivation), Q20–Q22 (notification reliability), Q26–Q28 (security/audit policy), and Q34 (deployment execution).
