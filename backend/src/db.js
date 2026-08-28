import knex from 'knex';
import { config } from './src/config.js';

export default {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: { directory: './migrations' }
};

export const db = config.DATABASE_URL ? knex({ client: 'pg', connection: config.DATABASE_URL }) : null;
