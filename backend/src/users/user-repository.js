import { db } from '../db.js';

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email, database = db) {
  if (!database) throw new Error('Database is not configured');
  return database('users').where('email', normalizeEmail(email)).first();
}

export async function findUserById(userId, database = db) {
  if (!database) throw new Error('Database is not configured');
  return database('users').where({ id: userId }).first();
}

export async function createUser({ email, role, status = 'PENDING' }, database = db) {
  if (!database) throw new Error('Database is not configured');
  const [user] = await database('users')
    .insert({ email: normalizeEmail(email), role, status })
    .returning('*');
  await database('user_profiles').insert({ user_id: user.id });
  return user;
}
