import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
	await knex('subscription_list').del(); // Clear existing data

	await knex('subscription_list').insert([
		{ boost_name: 'Basic Boost', duration: 3, price: 6999 },
		{ boost_name: 'Standard Boost', duration: 5, price: 8999 },
		{ boost_name: 'Premium Boost', duration: 7, price: 9999 },
	]);
}
