import test from 'node:test';
import assert from 'node:assert/strict';
import { healthResponseSchema } from '../src/lib/validation/health.js';

test('health response schema accepts the API health contract', () => {
  assert.deepEqual(healthResponseSchema.parse({ status: 'ok' }), { status: 'ok' });
});

test('health response schema rejects invalid responses', () => {
  assert.throws(() => healthResponseSchema.parse({ status: 'error' }));
});
