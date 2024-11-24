import db from '../configs/knexConfig';

interface Service {
	id: number;
	user_id: number;
	isSubscription?: boolean;
	name_of_service: string;
	category_id: number;
	description: string;
	status: 'pending' | 'decline' | 'accept';
	min_price: number;
	max_price: number;
	like_count: number
    bookmark_count: number
	created_at?: Date;
	updated_at?: Date;
}

const serviceModel = {
	create: async (serviceData: Partial<Service>): Promise<Service> => {
		const [newService] = await db<Service>('service').insert(serviceData).returning('*');
		return newService;
	},

	findAll: async (): Promise<Service[]> => {
		return db<Service>('service').select('*');
	},

	findById: async (id: number): Promise<Service | undefined> => {
		return db<Service>('service').where({ id }).first();
	},

    findByIds: async (serviceIds: number[]): Promise<Service[]> => {
        return db<Service>('service').whereIn('id', serviceIds).select('*');
    },

	findByUserId: async (userId: number): Promise<Service[]> => {
		return db<Service>('service').where({ user_id: userId }).select('*');
	},

	updateById: async (id: number, updates: Partial<Service>): Promise<Service | undefined> => {
		const [updatedService] = await db<Service>('service').where({ id }).update(updates).returning('*');
		return updatedService;
	},

	deleteById: async (id: number): Promise<number> => {
		return db<Service>('service').where({ id }).del();
	},

	deleteByUserId: async (userId: number): Promise<number> => {
		return db<Service>('service').where({ user_id: userId }).del();
	},

	updateStatus: async (id: number, status: 'accept' | 'decline' | 'pending'): Promise<Service | undefined> => {
		const [updatedService] = await db<Service>('service').where({ id }).update({ status }).returning('*');
		return updatedService;
	},

	findAllApproved: async (): Promise<Service[]> => {
		return db<Service>('service').where({ status: 'accept' }).select('*');
	},

    // Perbarui jumlah like
    updateLikeCount: async (id: number, increment: boolean): Promise<Service | undefined> => {
		const [updatedService] = await db<Service>('service')
			.where({ id })
			.modify((query) => {
				if (increment) {
					query.increment('like_count', 1);
				} else {
					query.decrement('like_count', 1);
				}
			})
			.returning('*');
		return updatedService;
	},

	// Perbarui jumlah bookmark
    updateBookmarkCount: async (id: number, increment: boolean): Promise<Service | undefined> => {
		const [updatedService] = await db<Service>('service')
			.where({ id })
			.modify((query) => {
				if (increment) {
					query.increment('bookmark_count', 1);
				} else {
					query.decrement('bookmark_count', 1);
				}
			})
			.returning('*');
		return updatedService;
	},
};

export default serviceModel;
