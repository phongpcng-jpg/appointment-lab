import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config.js';

function getSecret() {
  if (!config.JWT_ACCESS_SECRET) {
    const error = new Error('JWT access secret is not configured');
    error.statusCode = 500;
    error.code = 'JWT_SECRET_NOT_CONFIGURED';
    throw error;
  }
  return new TextEncoder().encode(config.JWT_ACCESS_SECRET);
}

export async function signAccessToken({ userId, role, status }) {
  return new SignJWT({ role, status, type: 'access' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(config.JWT_ACCESS_TTL)
    .sign(getSecret());
}

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
    if (payload.type !== 'access' || typeof payload.sub !== 'string') throw new Error('Invalid access token');
    return payload;
  } catch {
    const error = new Error('Invalid or expired access token');
    error.statusCode = 401;
    error.code = 'INVALID_ACCESS_TOKEN';
    throw error;
  }
}
