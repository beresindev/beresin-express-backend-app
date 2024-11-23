import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('subscription_list', (table) => {
		table.increments('id').primary();
		table.string('boost_name').notNullable();
		table.integer('duration').notNullable(); // Duration in days
		table.integer('price').notNullable(); // Price of the plan
		table.timestamps(true, true); // created_at and updated_at
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('subscription_list');
}
