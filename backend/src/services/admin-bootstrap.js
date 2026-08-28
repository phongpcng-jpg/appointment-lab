import { config } from '../config.js';
import { db } from '../db.js';
import { createOpaqueToken } from './tokens.js';
import { sendMail } from './mailer.js';

const SETUP_TOKEN_TTL_MS = 60 * 60 * 1000;

function setupUrl(rawToken) {
  const baseUrl = config.FRONTEND_URL.replace(/\/$/, '');
  return `${baseUrl}/setup-password?token=${encodeURIComponent(rawToken)}`;
}

export async function bootstrapAdmin() {
  if (!db) throw new Error('DATABASE_URL is required for ADMIN bootstrap');
  if (!config.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is required for ADMIN bootstrap');

  const existingAdmin = await db('users').where('role', 'ADMIN').first('id', 'email', 'status');
  if (existingAdmin) return { created: false, userId: existingAdmin.id };

  const { rawToken, tokenHash } = createOpaqueToken();
  const expiresAt = new Date(Date.now() + SETUP_TOKEN_TTL_MS);

  const userId = await db.transaction(async (trx) => {
    const lockedAdmin = await trx('users').where('role', 'ADMIN').forUpdate().first('id');
    if (lockedAdmin) return lockedAdmin.id;

    const [user] = await trx('users').insert({
      email: config.ADMIN_EMAIL,
      role: 'ADMIN',
      status: 'PENDING'
    }).returning(['id']);

    await trx('user_profiles').insert({ user_id: user.id });
    await trx('password_setup_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt
    });

    return user.id;
  });

  try {
    await sendMail({
      to: config.ADMIN_EMAIL,
      subject: 'Appointment Management System — Set up your password',
      text: `Complete your administrator account setup: ${setupUrl(rawToken)}\n\nThis link expires in 1 hour and can only be used once.`
    });
  } catch (error) {
    await db('password_setup_tokens').where({ token_hash: tokenHash }).del();
    await db('users').where({ id: userId, role: 'ADMIN', status: 'PENDING' }).del();
    throw error;
  }

  return { created: true, userId };
}
