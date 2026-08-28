# Deployment

Phase 1 is Render-friendly by design but is not deployed yet.

Backend: Node.js/Fastify web service. Frontend: Vite static service. Database: managed PostgreSQL.

Environment configuration is externalized. Health endpoint: `/api/v1/health`. Migration command: `npm run db:migrate`. Frontend build: `npm run build --workspace apps/web`. Backend start: `npm --workspace apps/api run start`.

Production deployment and smoke validation are reserved for Phase 12 when credentials/environment are available.
