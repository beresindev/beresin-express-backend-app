import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('likes', (table) => {
		table.increments('id').primary();
		table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
		table.integer('service_id').unsigned().notNullable().references('id').inTable('service').onDelete('CASCADE');
		table.unique(['user_id', 'service_id']);
        table.integer('like_count').unsigned().notNullable().defaultTo(0);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('likes');
}
