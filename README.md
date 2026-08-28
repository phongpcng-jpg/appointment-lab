# Appointment Management System

Production-oriented modular monolith using JavaScript, React/Vite, Node.js/Fastify and PostgreSQL/Knex.

## Development branch

All development work is committed to `feature/version2`. `main` is not a development target.

## Workspace

- `apps/api` — Fastify REST/SSE backend
- `apps/web` — React/Vite frontend
- `docs` — persistent requirements, architecture, security and phase context
- `.github/workflows/ci.yml` — CI checks for the development branch

## Requirements

Node.js 22+ and PostgreSQL are required for the full application. Copy `.env.example` to `.env` and provide environment-specific values.

## Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
npm run db:migrate
```

The API exposes `GET /health` and `GET /api/v1/health`.

## Phase protocol

The project is implemented incrementally. Every phase is tested, documented, committed and reported before work stops for explicit approval to continue. See `docs/PROJECT_PLAN.md` and `docs/AGENT_CONTEXT.md`.
