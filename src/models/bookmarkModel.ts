import db from '../configs/knexConfig';

// Interface untuk Bookmark
interface Bookmark {
	id: number;
	user_id: number;
	service_id: number;
}

// Interface untuk BookmarkCount
interface BookmarkCount {
	service_id: number;
	count: number;
}

const bookmarkModel = {
	// Tambahkan bookmark baru
	create: async (user_id: number, service_id: number): Promise<Bookmark> => {
		const [newBookmark] = await db<Bookmark>('bookmarks').insert({ user_id, service_id }).returning('*');
		return newBookmark;
	},

	// Hapus bookmark
	delete: async (user_id: number, service_id: number): Promise<number> => {
		return db<Bookmark>('bookmarks').where({ user_id, service_id }).del();
	},

	// Cari bookmark berdasarkan user dan service
	find: async (user_id: number, service_id: number): Promise<Bookmark | undefined> => {
		return db<Bookmark>('bookmarks').where({ user_id, service_id }).first();
	},

	// Dapatkan semua bookmark milik user
	findByUser: async (user_id: number): Promise<Bookmark[]> => {
		return db<Bookmark>('bookmarks').where({ user_id }).select('*');
	},

	// Hitung jumlah bookmark untuk daftar service
	countByServiceIds: async (serviceIds: number[]): Promise<BookmarkCount[]> => {
		return db('bookmarks').whereIn('service_id', serviceIds).groupBy('service_id').select('service_id').count('* as count');
	},
};

export default bookmarkModel;
