import knex from 'knex';
import { config } from './config.js';

export const dbConfig = {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: { directory: './migrations' }
};

export const db = config.DATABASE_URL ? knex(dbConfig) : null;

export async function closeDatabase() {
  if (db) await db.destroy();
}
