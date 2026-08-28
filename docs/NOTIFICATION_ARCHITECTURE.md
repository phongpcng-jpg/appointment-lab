# Notification Architecture

Approved target architecture: transactional outbox. Business transactions persist durable notification/outbox records first; asynchronous delivery fans out to SSE, email and enabled Web Push. Notification records are the source of truth. Deterministic business-event keys and database uniqueness prevent duplicate notification creation.

Phase 1 creates no notification tables or delivery workers.
