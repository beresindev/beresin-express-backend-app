import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('service', (table) => {
		table.integer('like_count').unsigned().notNullable().defaultTo(0); 
		table.integer('bookmark_count').unsigned().notNullable().defaultTo(0);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('service', (table) => {
		table.dropColumn('like_count'); 
		table.dropColumn('bookmark_count');
	});
}
