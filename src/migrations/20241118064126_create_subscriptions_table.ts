import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('subscriptions', (table) => {
		table.increments('id').primary(); // Primary key
		table.integer('service_id').unsigned().notNullable().references('id').inTable('service').onDelete('CASCADE'); // Relation to service table
		table.integer('duration').notNullable(); // Duration in days
		table.integer('price').notNullable(); // Price of the subscription
		table.string('boost_name').notNullable(); // Type of boost (e.g., Basic Boost)
		table.boolean('is_active').defaultTo(false); // Whether the subscription is active
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('subscriptions');
}
