import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex('category_services').del();

	// Inserts seed entries
	await knex('category_services').insert([
		{ id: 1, name_of_category: 'Technology' },
		{ id: 2, name_of_category: 'Household' },
		{ id: 3, name_of_category: 'Uncategorized' },
	]);
}
