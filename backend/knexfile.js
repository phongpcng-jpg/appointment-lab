import 'dotenv/config';
import { config } from './src/config.js';

export default {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: { directory: './migrations' }
};
