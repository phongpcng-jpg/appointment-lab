# Appointment State Machine

```text
DRAFT ──publish──> PUBLIC ──start──> IN_PROGRESS ──complete(report)──> COMPLETE
  │                    │                    │
  └─ delete            └─ cancel           └─ cancel
                       ↓                    ↓
                    CANCELED             CANCELED
```

Allowed transitions:
- DRAFT -> PUBLIC
- PUBLIC -> IN_PROGRESS
- PUBLIC -> CANCELED
- IN_PROGRESS -> COMPLETE only when a report exists
- IN_PROGRESS -> CANCELED

COMPLETE and CANCELED are terminal. DRAFT can be deleted. Notes are mutable only before terminal states. DRAFT cannot be published if either assigned user is PENDING or DEACTIVATED.

ADMIN can perform valid transitions. PROVIDER can operate own appointments. PATIENT can perform PUBLIC -> IN_PROGRESS for own appointments.

Deactivation transaction:
- PUBLIC -> CANCELED
- IN_PROGRESS -> CANCELED
- DRAFT remains DRAFT and is not publishable
- COMPLETE/CANCELED remain unchanged

Affected PUBLIC/IN_PROGRESS appointments generate cancellation notification business events for relevant recipients. Event creation is idempotent through the approved deterministic event key strategy.
