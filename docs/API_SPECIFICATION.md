# API Specification

Phase 1 exposes only foundation endpoints:

- `GET /health`
- `GET /api/v1/health`

The stable error envelope contains `status`, `error`, `message`, and `requestId`.

Business REST endpoints are defined and implemented in later phases under `/api/v1` and will not expose database entities directly.
