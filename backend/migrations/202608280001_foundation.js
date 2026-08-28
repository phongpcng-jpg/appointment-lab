export async function up(knex) {
  await knex.schema.createTable('schema_migrations_guard', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
  await knex('schema_migrations_guard').insert({ name: 'foundation' });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('schema_migrations_guard');
}
