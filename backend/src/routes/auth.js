import { z } from 'zod';
import { completePasswordSetup } from '../auth/password-setup.js';
import { authenticateUser } from '../auth/login.js';
import { signAccessToken } from '../auth/jwt.js';
import { rotateRefreshSession, revokeRefreshSession } from '../auth/refresh-session.js';

const passwordSetupSchema = z.object({ token: z.string().min(1), password: z.string().min(12).max(128) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
const REFRESH_COOKIE = 'appointment_refresh_token';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth',
  maxAge: 60 * 60 * 24 * 30
};

function setRefreshCookie(reply, token) {
  reply.setCookie(REFRESH_COOKIE, token, cookieOptions);
}

function clearRefreshCookie(reply) {
  reply.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: undefined });
}

export async function authRoutes(app, options) {
  const { database } = options;

  app.post('/api/v1/auth/password/setup', async (request, reply) => {
    const input = passwordSetupSchema.parse(request.body);
    const result = await completePasswordSetup({ ...input, database });
    return reply.send({ data: result });
  });

  app.post('/api/v1/auth/login', async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const result = await authenticateUser({ ...input, database });
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({ data: { accessToken: result.accessToken, user: result.user } });
  });

  app.post('/api/v1/auth/refresh', async (request, reply) => {
    const token = request.cookies[REFRESH_COOKIE];
    if (!token) {
      return reply.code(401).send({ status: 401, code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token', requestId: request.id });
    }

    try {
      const result = await rotateRefreshSession({ token, database });
      const accessToken = await signAccessToken({ userId: result.userId, role: result.role, status: result.status });
      setRefreshCookie(reply, result.token);
      return reply.send({ data: { accessToken } });
    } catch (error) {
      clearRefreshCookie(reply);
      throw error;
    }
  });

  app.post('/api/v1/auth/logout', async (request, reply) => {
    const token = request.cookies[REFRESH_COOKIE];
    if (token) await revokeRefreshSession({ token, database });
    clearRefreshCookie(reply);
    return reply.send({ data: { loggedOut: true } });
  });
}
