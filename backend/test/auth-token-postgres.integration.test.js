import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import knex from 'knex';
import { hashOpaqueToken } from '../src/auth/crypto.js';
import { verifyEmailToken } from '../src/auth/email-verification.js';
import { completePasswordSetup } from '../src/auth/password-setup.js';
import { dbConfig } from '../src/db.js';

const runIntegration = process.env.RUN_DB_INTEGRATION === '1';

if (runIntegration && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required when RUN_DB_INTEGRATION=1; ensure backend/.env exists');
}

test('PostgreSQL token lifecycle integration', { skip: !runIntegration }, async () => {
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

    const concurrentToken = crypto.randomBytes(32).toString('hex');
    await db('email_verification_tokens').insert({ user_id: userId, token_hash: hashOpaqueToken(concurrentToken), expires_at: db.raw("now() + interval '10 minutes'") });

    const results = await Promise.allSettled([
      verifyEmailToken({ token: concurrentToken, database: db }),
      verifyEmailToken({ token: concurrentToken, database: db })
    ]);

    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
    assert.equal(results.find((result) => result.status === 'rejected').reason.code, 'INVALID_VERIFICATION_TOKEN');

    const concurrencyTokenRow = await db('email_verification_tokens')
      .where({ user_id: userId, token_hash: hashOpaqueToken(concurrentToken) })
      .first('used_at');
    assert.ok(concurrencyTokenRow.used_at);

    const rollbackUserId = crypto.randomUUID();
    const rollbackToken = crypto.randomBytes(32).toString('hex');
    await db.transaction(async (trx) => {
      await trx('users').insert({ id: rollbackUserId, email: `rollback-${rollbackUserId}@example.test`, role: 'PATIENT', status: 'PENDING' });
      await trx('email_verification_tokens').insert({ user_id: rollbackUserId, token_hash: hashOpaqueToken(rollbackToken), expires_at: trx.raw("now() + interval '10 minutes'") });
      throw new Error('forced rollback');
    }).catch((error) => assert.equal(error.message, 'forced rollback'));

    assert.equal(await db('users').where({ id: rollbackUserId }).first(), undefined);
    assert.equal(await db('email_verification_tokens').where({ user_id: rollbackUserId }).first(), undefined);
  } finally {
    await db('users').where({ id: userId }).del();
    await db('users').where('email', 'like', 'rollback-%@example.test').del();
    await db.destroy();
  }
});
