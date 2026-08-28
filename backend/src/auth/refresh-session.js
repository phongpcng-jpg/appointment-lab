import { generateOpaqueToken, hashOpaqueToken } from './crypto.js';

const REFRESH_SESSION_DAYS = 30;

function invalidRefreshToken() {
  const error = new Error('Invalid or expired refresh token');
  error.statusCode = 401;
  error.code = 'INVALID_REFRESH_TOKEN';
  return error;
}

export async function createRefreshSession({ userId, database, expiresInDays = REFRESH_SESSION_DAYS }) {
  const token = generateOpaqueToken();
  const tokenHash = hashOpaqueToken(token);

  await database('refresh_sessions').insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: database.raw("now() + (? * interval '1 day')", [expiresInDays])
  });

  return token;
}

export async function rotateRefreshSession({ token, database, expiresInDays = REFRESH_SESSION_DAYS }) {
  const tokenHash = hashOpaqueToken(token);

  return database.transaction(async (trx) => {
    const session = await trx('refresh_sessions')
      .join('users', 'users.id', 'refresh_sessions.user_id')
      .where('refresh_sessions.token_hash', tokenHash)
      .whereNull('refresh_sessions.revoked_at')
      .andWhere('refresh_sessions.expires_at', '>', trx.fn.now())
      .where('users.status', 'ACTIVE')
      .whereNotNull('users.password_hash')
      .whereNotNull('users.email_verified_at')
      .forUpdate('refresh_sessions')
      .first('refresh_sessions.id', 'refresh_sessions.user_id', 'users.role', 'users.status');

    if (!session) throw invalidRefreshToken();

    const newToken = generateOpaqueToken();
    const newHash = hashOpaqueToken(newToken);
    const now = trx.fn.now();

    await trx('refresh_sessions').where({ id: session.id }).update({ revoked_at: now, last_used_at: now, updated_at: now });
    await trx('refresh_sessions').insert({
      user_id: session.user_id,
      token_hash: newHash,
      expires_at: trx.raw("now() + (? * interval '1 day')", [expiresInDays])
    });

    return { token: newToken, userId: session.user_id, role: session.role, status: session.status };
  });
}

export async function revokeRefreshSession({ token, database }) {
  const tokenHash = hashOpaqueToken(token);
  const updated = await database('refresh_sessions')
    .where({ token_hash: tokenHash })
    .whereNull('revoked_at')
    .update({ revoked_at: database.fn.now(), updated_at: database.fn.now() });
  return updated > 0;
}
