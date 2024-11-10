import db from '../configs/knexConfig';

interface User {
	id: number;
	username: string;
	name: string;
	email: string;
	phone: number;
	password: string;
	role: string;
	created_at?: Date;
	updated_at?: Date;
}

const userModel = {
	findAll: async (): Promise<User[]> => {
		return db<User>('users').select('*');
	},
	findByEmail: async (email: string): Promise<User | undefined> => {
		return db<User>('users').where({ email }).first();
	},

	findByPhone: async (phone: string): Promise<User | undefined> => {
		return db<User>('users').where('phone', phone).first();
	},

	findByUsername: async (username: string): Promise<User | undefined> => {
		return db<User>('users').where({ username }).first();
	},
	create: async (userData: Partial<User>): Promise<User> => {
		const [newUser] = await db<User>('users').insert(userData).returning('*');
		return newUser;
	},
	findById: async (id: number): Promise<User | undefined> => {
		return db<User>('users').where({ id }).first();
	},

	findByIds: async (userIds: number[]): Promise<User[]> => {
		return db<User>('users').whereIn('id', userIds).select('id', 'phone'); // Hanya ambil id dan phone
	},

	updateById: async (id: number, updates: Partial<User>): Promise<User | undefined> => {
		const updatedData = { ...updates, updated_at: new Date() };
		const [updatedUser] = await db<User>('users').where({ id }).update(updatedData).returning('*');
		return updatedUser;
	},
	deleteById: async (id: number): Promise<number> => {
		return db<User>('users').where({ id }).del();
	},
};

export default userModel;
