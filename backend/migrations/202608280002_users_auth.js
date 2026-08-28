import { randomUUID } from 'node:crypto';

export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS citext');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.specificType('email', 'citext').notNullable().unique();
    table.string('password_hash', 255);
    table.enu('role', ['ADMIN', 'PROVIDER', 'PATIENT'], { useNative: false, enumName: 'user_role' }).notNullable();
    table.enu('status', ['PENDING', 'ACTIVE', 'DEACTIVATED'], { useNative: false, enumName: 'user_status' }).notNullable().defaultTo('PENDING');
    table.timestamp('email_verified_at', { useTz: true });
    table.timestamp('last_login_at', { useTz: true });
    table.timestamps(true, true);
    table.index(['role']);
    table.index(['status']);
  });

  await knex.schema.createTable('user_profiles', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('full_name', 200);
    table.string('phone', 50);
    table.boolean('profile_completed').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('email_verification_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 128).notNullable().unique();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.timestamp('used_at', { useTz: true });
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['expires_at']);
  });

  await knex.schema.createTable('password_setup_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 128).notNullable().unique();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.timestamp('used_at', { useTz: true });
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['expires_at']);
  });

  await knex.schema.createTable('refresh_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 128).notNullable().unique();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.timestamp('revoked_at', { useTz: true });
    table.timestamp('last_used_at', { useTz: true });
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['expires_at']);
  });

  await knex.raw("CREATE UNIQUE INDEX users_one_admin_idx ON users (role) WHERE role = 'ADMIN'");
  await knex.raw("ALTER TABLE users ADD CONSTRAINT users_pending_password_check CHECK (status = 'PENDING' OR password_hash IS NOT NULL)");
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('refresh_sessions');
  await knex.schema.dropTableIfExists('password_setup_tokens');
  await knex.schema.dropTableIfExists('email_verification_tokens');
  await knex.schema.dropTableIfExists('user_profiles');
  await knex.schema.dropTableIfExists('users');
}
