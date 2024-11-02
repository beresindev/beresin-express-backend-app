import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.increments('id').primary();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.string('username').unique().notNullable();
		table.string('name').notNullable();
		table.string('email').unique().notNullable();
		table.string('phone').unique().notNullable();
		table.string('password').notNullable();
		table.string('role').defaultTo('User');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('users');
}
