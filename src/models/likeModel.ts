import db from '../configs/knexConfig';

// Interface untuk Like
interface Like {
	id: number;
	user_id: number;
	service_id: number;
}

// Interface untuk LikeCount
interface LikeCount {
	service_id: number;
	count: number;
}

const likeModel = {
	// Tambahkan like baru
	create: async (user_id: number, service_id: number): Promise<Like> => {
		const [newLike] = await db<Like>('likes').insert({ user_id, service_id }).returning('*');
		return newLike;
	},

	// Hapus like
	delete: async (user_id: number, service_id: number): Promise<number> => {
		return db<Like>('likes').where({ user_id, service_id }).del();
	},

	// Cari like berdasarkan user dan service
	find: async (user_id: number, service_id: number): Promise<Like | undefined> => {
		return db<Like>('likes').where({ user_id, service_id }).first();
	},

	// Hitung jumlah like untuk service tertentu
	countByService: async (service_id: number): Promise<number> => {
		const result = await db('likes').where({ service_id }).count('id as count');
		return Number((result[0] as any).count);
	},

	// Hitung jumlah like untuk daftar service
	countByServiceIds: async (serviceIds: number[]): Promise<LikeCount[]> => {
		return db('likes')
			.whereIn('service_id', serviceIds)
			.groupBy('service_id')
			.select('service_id')
			.count('* as count');
	},
};

export default likeModel;
