# Domain Model

## User
Identity/account aggregate with immutable role, account status, profile completion, email, password hash and optional address/phone. Exactly one ADMIN is allowed. Admin email is immutable.

## Authentication credentials
A user may have multiple refresh sessions, OAuth identities and passkeys. Setup/reset/verification tokens are one-time security artifacts and are never returned.

## Appointment
References exactly one provider and patient. Provider/patient assignment is immutable. Contains note, state, display sequence per provider+patient, createdAt and updatedAt. Sequence is not an identifier or priority.

## Report
Zero or one report per appointment. Description is mandatory. Patient may mutate only while appointment is IN_PROGRESS. Completion requires report existence.

## Notification
Recipient-owned durable event/read record. May reference an appointment and metadata. Persist before delivery.

## Push subscription
A user may have multiple device/browser subscriptions. User preference controls whether delivery is attempted; browser permission/subscription acquisition remains client-mediated.

## State invariants
1. Only allowed appointment transitions can occur.
2. COMPLETE and CANCELED are terminal.
3. IN_PROGRESS -> COMPLETE requires a report.
4. Deactivation cancels PUBLIC/IN_PROGRESS appointments, preserves DRAFT/COMPLETE/CANCELED.
5. DRAFT involving deactivated users cannot be published.
6. One report maximum per appointment.
7. Email globally unique; non-null phone globally unique.
8. PENDING user can be hard-deleted by admin; normal active/deactivated users cannot.
