import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('service', (table) => {
		table.increments('id').primary();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
		table.boolean('isSubscription').defaultTo(false);
		table.string('name_of_service').notNullable();
		table.integer('category_id').unsigned().references('id').inTable('category_services').onDelete('SET NULL');
		table.text('description');
		table.enum('status', ['pending', 'decline', 'accept']).defaultTo('pending');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('service');
}
