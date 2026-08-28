# Appointment Management System

Production-oriented modular monolith using JavaScript, React/Vite, Node.js/Fastify and PostgreSQL/Knex.

## Development branch

All development work is committed to `feature/version2`. `main` is not a development target.

## Packages

The application is intentionally split into two independent packages:

- `backend` — Fastify REST/SSE backend and PostgreSQL/Knex migrations
- `frontend` — React/Vite frontend
- `docs` — persistent requirements, architecture, security and phase context

Backend and frontend have separate `package.json` files and can be installed, developed, tested, linted and built independently.

## Requirements

Node.js 22+ and PostgreSQL are required for the full application. Backend environment variables are documented in `.env.example`.

## Backend

```bash
cd backend
npm install
npm run dev
npm test
npm run lint
npm run db:migrate
```

The API exposes `GET /health` and `GET /api/v1/health`.

## Frontend

```bash
cd frontend
npm install
npm run dev
npm test
npm run lint
npm run build
```

The Vite development server runs on its configured local port and communicates with the backend through the configured API origin.

## Phase protocol

The project is implemented incrementally. Every phase is tested, documented, committed and reported before work stops for explicit approval to continue. See `docs/PROJECT_PLAN.md` and `docs/AGENT_CONTEXT.md`.
