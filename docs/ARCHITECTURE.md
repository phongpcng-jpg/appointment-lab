# Architecture

## System topology
Browser -> React/Vite SPA -> Fastify REST/SSE backend -> PostgreSQL. Backend integrates SMTP, Google OAuth, WebAuthn and Web Push providers. Modular monolith; no microservices.

## Backend layering
- Routes/controllers: HTTP contract and response mapping.
- Schemas/DTOs: request/query/body validation and output shaping.
- Services/use cases: transaction orchestration and application workflows.
- Domain: state transitions, role rules, invariants and policy functions.
- Repositories: PostgreSQL access via Knex; no persistence objects exposed to HTTP.
- Infrastructure: database, mail, OAuth, WebAuthn, push, JWT, crypto, clock, logging.
- Cross-cutting: authentication, authorization, correlation IDs, error handling, rate limiting.

## Suggested module layout
`src/modules/auth`, `users`, `sessions`, `oauth`, `passkeys`, `appointments`, `reports`, `notifications`, `push`, `admin`; `src/infrastructure`; `src/plugins`; `src/shared`.

## Frontend
Feature-oriented React modules backed by centralized API client/auth state and TanStack Query. React Router handles route protection. A global auth/error boundary recognizes `PROFILE_INCOMPLETE`. Forms use React Hook Form + Zod. SSE is owned by an authenticated notification layer.

## Request lifecycle
HTTP request -> correlation ID -> auth -> account-state/profile gate -> role/resource authorization -> schema validation -> service -> repository/transaction -> DTO response. Domain errors map to stable API codes.

## Authentication
Access JWT is short-lived and stateless. Refresh is an opaque random secret represented by a hash in PostgreSQL, rotated on use and revocable by session/security events. Web sessions should use Secure/HttpOnly/SameSite cookies for refresh if approved in Phase 0; CSRF protection follows transport choice.

## Notification reliability
Business transaction commits durable state and notification event/record first. Delivery occurs after commit. Recommended production design is a transactional outbox if approved; otherwise an explicit post-commit delivery mechanism must be used with retry/observability. Delivery failures never roll back appointment/user/report state.

## Concurrency
Appointment sequence allocation must be transactionally serialized per provider/patient pair. Deactivation and appointment cancellation must run in one transaction. State transitions use guarded updates/transactions so stale clients cannot perform invalid transitions.

## Deployment
Frontend and backend are independently deployable services sharing environment configuration. PostgreSQL is managed. Health endpoint reports application readiness without leaking secrets. Production requires HTTPS, configured CORS, secure cookies where used, OAuth callback URLs, SMTP, VAPID and DATABASE_URL.

## Observability
Structured logs include correlation/request ID, actor ID where safe, action and outcome; never secrets/tokens/passwords. Security and business events are audit-friendly. Metrics/tracing can be added without changing domain boundaries.
