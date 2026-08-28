import { verifyPassword } from './password.js';
import { signAccessToken } from './jwt.js';
import { createRefreshSession } from './refresh-session.js';

export async function authenticateUser({ email, password, database }) {
  const user = await database('users')
    .whereRaw('email = ?', [email])
    .first('id', 'email', 'password_hash', 'role', 'status', 'email_verified_at', 'profile_completed');

  const validPassword = user?.password_hash ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !validPassword || user.status !== 'ACTIVE' || !user.email_verified_at) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const accessToken = await signAccessToken({ userId: user.id, role: user.role, status: user.status });
  const refreshToken = await createRefreshSession({ userId: user.id, database });
  await database('users').where({ id: user.id }).update({ last_login_at: database.fn.now(), updated_at: database.fn.now() });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      profileCompleted: user.profile_completed
    }
  };
}
