import { hashOpaqueToken } from './crypto.js';
import { hashPassword } from './password.js';

export async function completePasswordSetup({ token, password, database }) {
  const tokenHash = hashOpaqueToken(token);

  return database.transaction(async (trx) => {
    const setupToken = await trx('password_setup_tokens as pst')
      .join('users as u', 'u.id', 'pst.user_id')
      .where('pst.token_hash', tokenHash)
      .whereNull('pst.used_at')
      .andWhere('pst.expires_at', '>', trx.fn.now())
      .first('pst.id as token_id', 'pst.user_id', 'u.status', 'u.email_verified_at');

    if (!setupToken) {
      const error = new Error('Invalid or expired password setup token');
      error.statusCode = 400;
      error.code = 'INVALID_SETUP_TOKEN';
      throw error;
    }

    const passwordHash = await hashPassword(password);
    const now = trx.fn.now();

    await trx('users').where({ id: setupToken.user_id }).update({ password_hash: passwordHash, updated_at: now });
    await trx('password_setup_tokens').where({ id: setupToken.token_id }).update({ used_at: now, updated_at: now });

    return { userId: setupToken.user_id, emailVerified: Boolean(setupToken.email_verified_at), status: setupToken.status };
  });
}
