import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { validate } from '../src/validation/validate.js';

test('validate returns parsed data', () => {
  const schema = z.object({ page: z.coerce.number().int().positive() });
  assert.deepEqual(validate(schema, { page: '2' }), { page: 2 });
});

test('validate throws stable validation error', () => {
  const schema = z.object({ page: z.coerce.number().int().positive() });
  assert.throws(() => validate(schema, { page: '0' }), (error) => {
    assert.equal(error.statusCode, 400);
    assert.equal(error.code, 'VALIDATION_ERROR');
    assert.ok(error.details);
    return true;
  });
});
