# Database Design

Phase 1 intentionally contains no business tables. Knex is configured for PostgreSQL migrations and a foundation migration verifies the migration pipeline.

Final business schema is introduced in the relevant later phases after the approved domain model.

Planned constraints include unique email, partial unique phone, one-report-per-appointment, foreign keys, appointment state constraints and notification idempotency uniqueness. Planned indexes follow documented query patterns.
