import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import knex from 'knex';
import { buildApp } from '../src/server.js';
import { hashPassword } from '../src/auth/password.js';
import { dbConfig } from '../src/db.js';

const runIntegration = process.env.RUN_DB_INTEGRATION === '1';
if (runIntegration && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required when RUN_DB_INTEGRATION=1; ensure backend/.env exists');
}

function cookieValue(setCookieHeader, name) {
  const header = Array.isArray(setCookieHeader) ? setCookieHeader.find((value) => value.startsWith(`${name}=`)) : setCookieHeader;
  assert.ok(header, `${name} cookie was not returned`);
  return header.slice(name.length + 1).split(';', 1)[0];
}

test('HTTP authentication lifecycle uses JWT access tokens and stateful refresh cookies', { skip: !runIntegration }, async () => {
  const database = knex(dbConfig);
  const app = buildApp();
  const userId = crypto.randomUUID();
  const email = `auth-${userId}@example.test`;
  const password = 'integration-password-123';

  try {
    await database('users').insert({
      id: userId,
      email,
      password_hash: await hashPassword(password),
      role: 'PATIENT',
      status: 'ACTIVE',
      email_verified_at: database.fn.now()
    });

    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password }
    });

    assert.equal(login.statusCode, 200);
    const loginBody = login.json();
    assert.equal(typeof loginBody.data.accessToken, 'string');
    const refreshCookie = cookieValue(login.headers['set-cookie'], 'appointment_refresh_token');
    assert.match(login.headers['set-cookie'][0], /HttpOnly/i);
    assert.match(login.headers['set-cookie'][0], /SameSite=Lax/i);

    const sessionsAfterLogin = await database('refresh_sessions').where({ user_id: userId });
    assert.equal(sessionsAfterLogin.length, 1);
    assert.notEqual(sessionsAfterLogin[0].token_hash, refreshCookie);

    const refresh = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: { cookie: `appointment_refresh_token=${refreshCookie}` }
    });

    assert.equal(refresh.statusCode, 200);
    assert.equal(typeof refresh.json().data.accessToken, 'string');
    const rotatedCookie = cookieValue(refresh.headers['set-cookie'], 'appointment_refresh_token');
    assert.notEqual(rotatedCookie, refreshCookie);

    const sessionsAfterRotation = await database('refresh_sessions').where({ user_id: userId }).orderBy('created_at', 'asc');
    assert.equal(sessionsAfterRotation.length, 2);
    assert.ok(sessionsAfterRotation[0].revoked_at);
    assert.equal(sessionsAfterRotation[1].revoked_at, null);

    const reused = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: { cookie: `appointment_refresh_token=${refreshCookie}` }
    });
    assert.equal(reused.statusCode, 401);
    assert.equal(reused.json().code, 'INVALID_REFRESH_TOKEN');

    const logout = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
      headers: { cookie: `appointment_refresh_token=${rotatedCookie}` }
    });
    assert.equal(logout.statusCode, 200);

    const afterLogout = await database('refresh_sessions').where({ user_id: userId }).orderBy('created_at', 'desc').first();
    assert.ok(afterLogout.revoked_at);

    const refreshAfterLogout = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: { cookie: `appointment_refresh_token=${rotatedCookie}` }
    });
    assert.equal(refreshAfterLogout.statusCode, 401);
    assert.equal(refreshAfterLogout.json().code, 'INVALID_REFRESH_TOKEN');

    const badLogin = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password: 'wrong-password' }
    });
    assert.equal(badLogin.statusCode, 401);
    assert.equal(badLogin.json().code, 'INVALID_CREDENTIALS');
  } finally {
    await app.close();
    await database('users').where({ id: userId }).del();
    await database.destroy();
  }
});
