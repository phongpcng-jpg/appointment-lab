import { hashOpaqueToken } from './crypto.js';

export async function verifyEmailToken({ token, database }) {
  const tokenHash = hashOpaqueToken(token);

  return database.transaction(async (trx) => {
    const record = await trx('email_verification_tokens as evt')
      .join('users as u', 'u.id', 'evt.user_id')
      .where('evt.token_hash', tokenHash)
      .whereNull('evt.used_at')
      .andWhere('evt.expires_at', '>', trx.fn.now())
      .forUpdate()
      .first('evt.id as token_id', 'evt.user_id', 'u.email_verified_at');

    if (!record) {
      const error = new Error('Invalid or expired email verification token');
      error.statusCode = 400;
      error.code = 'INVALID_VERIFICATION_TOKEN';
      throw error;
    }

    const now = trx.fn.now();
    await trx('users').where({ id: record.user_id }).update({ email_verified_at: now, updated_at: now });
    await trx('email_verification_tokens').where({ id: record.token_id }).update({ used_at: now, updated_at: now });

    return { userId: record.user_id, alreadyVerified: Boolean(record.email_verified_at) };
  });
}
