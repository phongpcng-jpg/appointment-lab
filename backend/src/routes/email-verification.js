import { z } from 'zod';
import { verifyEmailToken } from '../auth/email-verification.js';

const schema = z.object({ token: z.string().min(1) });

export async function emailVerificationRoutes(app, options) {
  const { database } = options;

  app.post('/api/v1/auth/email/verify', async (request, reply) => {
    const { token } = schema.parse(request.body);
    const result = await verifyEmailToken({ token, database });
    return reply.send({ data: result });
  });
}
