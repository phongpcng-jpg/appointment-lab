import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api/v1'),
  VITE_APP_NAME: z.string().default('Appointment Management System')
});

export const frontendConfig = envSchema.parse(import.meta.env);
