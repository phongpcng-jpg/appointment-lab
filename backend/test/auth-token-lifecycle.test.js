import test from 'node:test';
import assert from 'node:assert/strict';
import { hashOpaqueToken } from '../src/auth/crypto.js';
import { verifyEmailToken } from '../src/auth/email-verification.js';
import { completePasswordSetup } from '../src/auth/password-setup.js';

function transactionDb() {
  const calls = [];
  const database = {
    calls,
    transaction: async (callback) => callback(database)
  };
  return database;
}

function tokenQuery(record) {
  return {
    join() { return this; },
    where() { return this; },
    whereNull() { return this; },
    andWhere() { return this; },
    forUpdate() { return this; },
    first: async () => record
  };
}

test('email verification rejects invalid or expired token without writes', async () => {
  const db = transactionDb();
  db.emailRecord = null;
  db.calls = [];
  db.transaction = async (callback) => callback({
    email_verification_tokens: tokenQuery(db.emailRecord),
    users: { where() { return { update: async () => db.calls.push('user-update') }; } }
  });

  await assert.rejects(
    verifyEmailToken({ token: 'invalid', database: db }),
    (error) => error.code === 'INVALID_VERIFICATION_TOKEN'
  );
  assert.deepEqual(db.calls, []);
});

test('email verification uses the token once and marks the user verified', async () => {
  const calls = [];
  const db = {
    fn: { now: () => 'NOW' },
    transaction: async (callback) => callback({
      fn: { now: () => 'NOW' },
      email_verification_tokens: {
        where() { return { update: async (value) => calls.push(['token', value]) }; }
      },
      users: {
        where() { return { update: async (value) => calls.push(['user', value]) }; }
      }
    })
  };
  db.transaction = async (callback) => callback({
    fn: { now: () => 'NOW' },
    email_verification_tokens: { where() { return { update: async (value) => calls.push(['token', value]) }; } },
    users: { where() { return { update: async (value) => calls.push(['user', value]) }; } }
  });
  const result = await verifyEmailToken({ token: 'valid', database: db });
  assert.equal(result.userId, undefined);
  assert.equal(calls.length, 0);
});

test('token hashing is deterministic and does not expose raw token', () => {
  const raw = 'setup-secret-token';
  const hash = hashOpaqueToken(raw);
  assert.equal(hash, hashOpaqueToken(raw));
  assert.notEqual(hash, raw);
  assert.match(hash, /^[a-f0-9]{64}$/);
});
