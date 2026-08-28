import bcrypt from 'bcryptjs';

export const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;

export function validatePasswordPolicy(password) {
  if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    const error = new Error(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`);
    error.statusCode = 400;
    error.code = 'INVALID_PASSWORD';
    throw error;
  }
  return password;
}

export async function hashPassword(password) {
  validatePasswordPolicy(password);
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') return false;
  return bcrypt.compare(password, passwordHash);
}
