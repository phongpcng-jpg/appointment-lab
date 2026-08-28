import { z } from 'zod';
import { completePasswordSetup } from '../auth/password-setup.js';
import { db } from '../db.js';

const passwordSetupSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(12).max(128)
});

export async function authRoutes(app) {
  app.post('/api/v1/auth/password/setup', async (request, reply) => {
    const input = passwordSetupSchema.parse(request.body);
    const result = await completePasswordSetup({ ...input, database: db });
    return reply.send({ data: result });
  });
}
