# Appointment State Machine

```text
DRAFT ──publish──> PUBLIC ──start──> IN_PROGRESS ──complete (report exists)──> COMPLETE
  │                    │                    │
  └─ delete            └─ cancel           └─ cancel
                       ↓                    ↓
                    CANCELED             CANCELED
```

## Allowed transitions
- DRAFT -> PUBLIC
- PUBLIC -> IN_PROGRESS
- PUBLIC -> CANCELED
- IN_PROGRESS -> COMPLETE only if a report exists
- IN_PROGRESS -> CANCELED

## Disallowed
- DRAFT -> CANCELED as a deactivation side effect
- Any transition out of COMPLETE/CANCELED
- Any note change in COMPLETE/CANCELED
- Publishing a DRAFT if provider/patient is PENDING or DEACTIVATED
- Creating an appointment with PENDING/DEACTIVATED provider or patient

## Role scope
ADMIN may perform all valid transitions. PROVIDER may transition own appointments according to source permissions. PATIENT may perform PUBLIC -> IN_PROGRESS for their own appointments. Backend validates actor, ownership, account state and current appointment state.

## Deactivation rule
Within a transaction, each affected PUBLIC/IN_PROGRESS appointment becomes CANCELED; DRAFT remains DRAFT; COMPLETE/CANCELED remain unchanged. Whether automatic cancellations emit notifications is an open Phase 0 question.
