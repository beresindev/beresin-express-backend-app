import db from '@configs/knex';

interface User {
	id: number;
	username: string;
	email: string;
}

export default {
	findById: async (id: number): Promise<User | undefined> => {
		return db<User>('users').where({ id }).first();
	},
};
