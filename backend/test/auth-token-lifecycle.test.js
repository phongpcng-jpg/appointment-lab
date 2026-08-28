import test from 'node:test';
import assert from 'node:assert/strict';
import { hashOpaqueToken } from '../src/auth/crypto.js';
import { verifyEmailToken } from '../src/auth/email-verification.js';
import { completePasswordSetup } from '../src/auth/password-setup.js';

function createQuery(record, calls, type) {
  return {
    join() { return this; },
    where() { return this; },
    whereNull() { return this; },
    andWhere() { return this; },
    forUpdate() { return this; },
    first: async () => record,
    update: async (value) => calls.push([type, value])
  };
}

function createDb({ emailRecord = null, setupRecord = null } = {}) {
  const calls = [];
  const db = function table(name) {
    if (name === 'email_verification_tokens') return createQuery(emailRecord, calls, 'email-token');
    if (name === 'password_setup_tokens') return createQuery(setupRecord, calls, 'setup-token');
    if (name === 'users') return createQuery(null, calls, 'user');
    throw new Error(`Unexpected table: ${name}`);
  };

  db.calls = calls;
  db.fn = { now: () => 'NOW' };
  db.transaction = async (callback) => callback(db);
  return db;
}

test('email verification rejects invalid token without writes', async () => {
  const db = createDb();
  await assert.rejects(
    verifyEmailToken({ token: 'invalid', database: db }),
    (error) => error.code === 'INVALID_VERIFICATION_TOKEN'
  );
  assert.deepEqual(db.calls, []);
});

test('email verification atomically updates user and consumes token', async () => {
  const db = createDb({ emailRecord: { token_id: 'token-1', user_id: 'user-1', email_verified_at: null } });
  const result = await verifyEmailToken({ token: 'valid-token', database: db });
  assert.deepEqual(result, { userId: 'user-1', alreadyVerified: false });
  assert.equal(db.calls.length, 2);
  assert.equal(db.calls[0][0], 'user');
  assert.equal(db.calls[1][0], 'email-token');
});

test('password setup rejects invalid token without writes', async () => {
  const db = createDb();
  await assert.rejects(
    completePasswordSetup({ token: 'invalid', password: 'correct horse battery staple', database: db }),
    (error) => error.code === 'INVALID_SETUP_TOKEN'
  );
  assert.deepEqual(db.calls, []);
});

test('password setup atomically updates password and consumes token', async () => {
  const db = createDb({ setupRecord: { token_id: 'token-2', user_id: 'user-2', status: 'PENDING', email_verified_at: null } });
  const result = await completePasswordSetup({ token: 'valid-token', password: 'correct horse battery staple', database: db });
  assert.equal(result.userId, 'user-2');
  assert.equal(db.calls.length, 2);
  assert.equal(db.calls[0][0], 'user');
  assert.equal(db.calls[1][0], 'setup-token');
});

test('token hashing is deterministic and does not expose raw token', () => {
  const raw = 'setup-secret-token';
  const hash = hashOpaqueToken(raw);
  assert.equal(hash, hashOpaqueToken(raw));
  assert.notEqual(hash, raw);
  assert.match(hash, /^[a-f0-9]{64}$/);
});
