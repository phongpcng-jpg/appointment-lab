import { db } from './db.js';

export async function assertDatabaseConnection() {
  if (!db) return { configured: false };
  await db.raw('select 1');
  return { configured: true };
}
