import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config({ path: '.env.local' });

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		port: Number(process.env.DB_PORT),
	},
});

export default db;
