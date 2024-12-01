import db from '../configs/knexConfig';

interface Like {
	id: number;
	user_id: number;
	service_id: number;
}

interface LikeCount {
	service_id: number;
	count: number;
}

const likeModel = {
	create: async (user_id: number, service_id: number): Promise<Like> => {
		const [newLike] = await db<Like>('likes').insert({ user_id, service_id }).returning('*');
		return newLike;
	},

	delete: async (user_id: number, service_id: number): Promise<number> => {
		return db<Like>('likes').where({ user_id, service_id }).del();
	},

	find: async (user_id: number, service_id: number): Promise<Like | undefined> => {
		return db<Like>('likes').where({ user_id, service_id }).first();
	},

	countByService: async (service_id: number): Promise<number> => {
		const result = await db('likes').where({ service_id }).count('id as count');
		return Number((result[0] as any).count);
	},

	countByServiceIds: async (serviceIds: number[]): Promise<LikeCount[]> => {
		return db('likes')
			.whereIn('service_id', serviceIds)
			.groupBy('service_id')
			.select('service_id')
			.count('* as count');
	},
};

export default likeModel;
