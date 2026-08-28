import { z } from 'zod';
import { validate } from '../validation/validate.js';

const healthResponseSchema = z.object({ status: z.literal('ok') });

export async function healthRoutes(app) {
  app.get('/health', async () => validate(healthResponseSchema, { status: 'ok' }));
  app.get('/api/v1/health', async () => validate(healthResponseSchema, { status: 'ok' }));
}
