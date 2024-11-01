import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'pg',
		connection: {
			host: process.env.DB_HOST || 'TOBEMODIFED',
			port: Number(process.env.DB_PORT) || 5432,
			user: process.env.DB_USER || 'TOBEMODIFED',
			password: process.env.DB_PASSWORD || 'TOBEMODIFED',
			database: process.env.DB_NAME || 'TOBEMODIFED',
		},
		migrations: {
			directory: './src/migrations',
		},
		seeds: {
			directory: './src/seeds',
		},
	},
};

export default config;
