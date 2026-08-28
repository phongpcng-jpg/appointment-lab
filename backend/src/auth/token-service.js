import { generateOpaqueToken, hashOpaqueToken } from './crypto.js';

export const SETUP_TOKEN_TTL_HOURS = 1;
export const VERIFICATION_TOKEN_TTL_HOURS = 1;

function expiresFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export async function issuePasswordSetupToken(userId, database) {
  const token = generateOpaqueToken();
  await database('password_setup_tokens')
    .where({ user_id: userId })
    .whereNull('used_at')
    .update({ used_at: database.fn.now() });

  await database('password_setup_tokens').insert({
    user_id: userId,
    token_hash: hashOpaqueToken(token),
    expires_at: expiresFromNow(SETUP_TOKEN_TTL_HOURS)
  });
  return token;
}

export async function issueEmailVerificationToken(userId, database) {
  const token = generateOpaqueToken();
  await database('email_verification_tokens')
    .where({ user_id: userId })
    .whereNull('used_at')
    .update({ used_at: database.fn.now() });

  await database('email_verification_tokens').insert({
    user_id: userId,
    token_hash: hashOpaqueToken(token),
    expires_at: expiresFromNow(VERIFICATION_TOKEN_TTL_HOURS)
  });
  return token;
}
