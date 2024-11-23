import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('bookmarks', (table) => {
		table.increments('id').primary();
		table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
		table.integer('service_id').unsigned().notNullable().references('id').inTable('service').onDelete('CASCADE');
		table.unique(['user_id', 'service_id']); // Menghindari duplikasi bookmark
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('bookmarks');
}
