import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('service', (table) => {
		table.integer('like_count').unsigned().notNullable().defaultTo(0); // Tambahkan kolom like_count
		table.integer('bookmark_count').unsigned().notNullable().defaultTo(0); // Tambahkan kolom bookmark_count
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('service', (table) => {
		table.dropColumn('like_count'); // Hapus kolom like_count jika di-rollback
		table.dropColumn('bookmark_count'); // Hapus kolom bookmark_count jika di-rollback
	});
}
