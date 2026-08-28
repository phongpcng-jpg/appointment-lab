import crypto from 'node:crypto';

export function createOpaqueToken(bytes = 32) {
  const rawToken = crypto.randomBytes(bytes).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}

export function hashOpaqueToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}
