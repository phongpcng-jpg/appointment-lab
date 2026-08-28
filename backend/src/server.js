import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { config } from './config.js';
import { closeDatabase } from './db.js';

export function buildApp() {
  const app = Fastify({ logger: true, requestIdHeader: 'x-request-id' });

  app.register(helmet);
  app.register(cors, { origin: config.CORS_ORIGIN, credentials: true });
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.register(sensible);

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/api/v1/health', async () => ({ status: 'ok' }));

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'request failed');
    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    reply.status(statusCode).send({
      status: statusCode,
      code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : error.code || 'REQUEST_ERROR',
      message: statusCode === 500 ? 'Internal server error' : error.message,
      requestId: request.id
    });
  });

  return app;
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const app = buildApp();
  const shutdown = async (signal) => {
    app.log.info({ signal }, 'shutting down');
    await app.close();
    await closeDatabase();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  app.listen({ port: config.PORT, host: config.HOST }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
