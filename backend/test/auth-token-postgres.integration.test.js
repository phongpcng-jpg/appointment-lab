import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import knex from 'knex';
import { hashOpaqueToken } from '../src/auth/crypto.js';
import { hashPassword } from '../src/auth/password.js';
import { verifyEmailToken } from '../src/auth/email-verification.js';
import { completePasswordSetup } from '../src/auth/password-setup.js';
import { dbConfig } from '../src/db.js';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = process.env.RUN_DB_INTEGRATION === '1';

test('PostgreSQL token lifecycle integration suite is configured', { skip: !runIntegration }, async () => {
  assert.ok(databaseUrl, 'DATABASE_URL is required when RUN_DB_INTEGRATION=1');
  const db = knex(dbConfig);
  const userId = crypto.randomUUID();
  const emailToken = crypto.randomBytes(32).toString('hex');
  const setupToken = crypto.randomBytes(32).toString('hex');

  try {
    await db.transaction(async (trx) => {
      await trx('users').insert({ id: userId, email: `integration-${userId}@example.test`, role: 'PATIENT', status: 'PENDING' });
      await trx('email_verification_tokens').insert({ user_id: userId, token_hash: hashOpaqueToken(emailToken), expires_at: trx.raw("now() + interval '10 minutes'") });
      await trx('password_setup_tokens').insert({ user_id: userId, token_hash: hashOpaqueToken(setupToken), expires_at: trx.raw("now() + interval '10 minutes'") });
    });

    const verification = await verifyEmailToken({ token: emailToken, database: db });
    assert.equal(verification.userId, userId);
    const verifiedUser = await db('users').where({ id: userId }).first('email_verified_at');
    const consumedEmailToken = await db('email_verification_tokens').where({ user_id: userId }).first('used_at');
    assert.ok(verifiedUser.email_verified_at);
    assert.ok(consumedEmailToken.used_at);

    const setup = await completePasswordSetup({ token: setupToken, password: 'integration-password-123', database: db });
    assert.equal(setup.userId, userId);
    const updatedUser = await db('users').where({ id: userId }).first('password_hash');
    const consumedSetupToken = await db('password_setup_tokens').where({ user_id: userId }).first('used_at');
    assert.ok(updatedUser.password_hash);
    assert.ok(consumedSetupToken.used_at);

    await assert.rejects(verifyEmailToken({ token: emailToken, database: db }), (error) => error.code === 'INVALID_VERIFICATION_TOKEN');
    await assert.rejects(completePasswordSetup({ token: setupToken, password: 'integration-password-123', database: db }), (error) => error.code === 'INVALID_SETUP_TOKEN');

    const expiredToken = crypto.randomBytes(32).toString('hex');
    await db('email_verification_tokens').insert({ user_id: userId, token_hash: hashOpaqueToken(expiredToken), expires_at: db.raw("now() - interval '1 minute'") });
    await assert.rejects(verifyEmailToken({ token: expiredToken, database: db }), (error) => error.code === 'INVALID_VERIFICATION_TOKEN');
  } finally {
    await db('users').where({ id: userId }).del();
    await db.destroy();
  }
});

test('PostgreSQL token lifecycle integration requires an explicit local opt-in', () => {
  assert.equal(runIntegration, false, 'RUN_DB_INTEGRATION=1 should only be used for the database integration test command');
  assert.ok(typeof hashPassword === 'function');
});
