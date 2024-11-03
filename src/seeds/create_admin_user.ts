import bcrypt from 'bcrypt';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
	const adminEmail = 'firstadmin@mail.com';

	// Cek apakah admin sudah ada
	const existingAdmin = await knex('users').where({ email: adminEmail }).first();
	if (existingAdmin) {
		console.log('Admin user already exists');
		return;
	}

	// Hash password admin
	const password = 'Admin123,';
	const hashedPassword = await bcrypt.hash(password, 10);

	// Insert admin user
	await knex('users').insert({
		username: 'admin',
		name: 'Administrator',
		email: adminEmail,
		phone: 6285156644103,
		password: hashedPassword,
		role: 'admin',
		created_at: knex.fn.now(),
		updated_at: knex.fn.now(),
	});

	console.log('Admin user created');
}
