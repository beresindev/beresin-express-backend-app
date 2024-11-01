import db from '../configs/knexConfig';

interface User {
	id: number;
	username: string;
	name: string;
	email: string;
	phone: number; // Menggunakan number sesuai dengan ERD
	password: string;
	role: string;
	created_at?: Date;
	updated_at?: Date;
}

const userModel = {
	findByEmail: async (email: string): Promise<User | undefined> => {
		return db<User>('users').where({ email }).first();
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
	updateById: async (id: number, updates: Partial<User>): Promise<User | undefined> => {
		const updatedData = { ...updates, updated_at: new Date() }; // Menambahkan updated_at
		const [updatedUser] = await db<User>('users').where({ id }).update(updatedData).returning('*');
		return updatedUser;
	},
};

export default userModel;
