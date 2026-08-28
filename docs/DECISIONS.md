# Decisions

## D-001 — JavaScript-only
No TypeScript. All frontend/backend source, configuration examples and tests use JavaScript unless a generated/third-party artifact requires otherwise.

## D-002 — Modular monolith
One backend application with explicit modules and layers; no microservices.

## D-003 — Git branch
All project work targets `feature/version2`; `main` is not a development target.

## D-004 — Requirements-first
Phase 0 is planning-only. No Phase 1/application implementation starts before explicit approval.

## D-005 — Backend is security authority
Frontend route visibility is UX only. Backend independently enforces authentication, account status, profile completion, role, ownership and state.

## D-006 — Durable notifications first
Persist notification state before SSE/email/Web Push delivery. Delivery failures must not erase business state.

## Pending decisions
Business/security decisions listed in `docs/OPEN_QUESTIONS.md` require user confirmation before implementation where marked blocking/high-impact.
