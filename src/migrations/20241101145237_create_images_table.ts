import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('images', (table) => {
		table.increments('id').primary();
		table.string('image').notNullable();
		table.integer('service_id').unsigned().references('id').inTable('service').onDelete('CASCADE');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('images');
}
