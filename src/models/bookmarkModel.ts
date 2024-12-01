import db from '../configs/knexConfig';

interface Bookmark {
	id: number;
	user_id: number;
	service_id: number;
}

interface BookmarkCount {
	service_id: number;
	count: number;
}

const bookmarkModel = {
	create: async (user_id: number, service_id: number): Promise<Bookmark> => {
		const [newBookmark] = await db<Bookmark>('bookmarks').insert({ user_id, service_id }).returning('*');
		return newBookmark;
	},

	delete: async (user_id: number, service_id: number): Promise<number> => {
		return db<Bookmark>('bookmarks').where({ user_id, service_id }).del();
	},

	find: async (user_id: number, service_id: number): Promise<Bookmark | undefined> => {
		return db<Bookmark>('bookmarks').where({ user_id, service_id }).first();
	},

	findByUser: async (user_id: number): Promise<Bookmark[]> => {
		return db<Bookmark>('bookmarks').where({ user_id }).select('*');
	},

	countByServiceIds: async (serviceIds: number[]): Promise<BookmarkCount[]> => {
		return db('bookmarks').whereIn('service_id', serviceIds).groupBy('service_id').select('service_id').count('* as count');
	},
};

export default bookmarkModel;
