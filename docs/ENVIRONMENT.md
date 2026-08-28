# Environment Configuration

The project uses separate environment files for the two independently runnable packages.

## Backend

Copy `backend/.env.example` to `backend/.env`.

Backend variables are server-only and include HTTP server, PostgreSQL, CORS, and later authentication configuration. Secrets must never be exposed to the browser or committed to Git.

## Frontend

Copy `frontend/.env.example` to `frontend/.env`.

Vite exposes only variables prefixed with `VITE_` to browser code. Therefore frontend environment variables contain only non-secret client configuration such as the API base URL and application name.

## Repository root

There is intentionally no shared `.env.example` because frontend and backend have different runtime boundaries and security requirements.
