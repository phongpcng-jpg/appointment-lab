export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const error = new Error('Request validation failed');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = result.error.flatten();
    throw error;
  }
  return result.data;
}
