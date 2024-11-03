import db from '../configs/knexConfig';

interface Category {
	id: number;
	name_of_category: string;
}

const categoryModel = {
	create: async (categoryData: Partial<Category>): Promise<Category> => {
		const [newCategory] = await db<Category>('category_services').insert(categoryData).returning('*');
		return newCategory;
	},

	findAll: async (): Promise<Category[]> => {
		console.log('findAll: Mengakses tabel category_services'); // Debug log
		const category = await db<Category>('category_services').select('*');
		console.log('findAll: Kategori yang diambil', category); // Debug log
		return category;
	},

	updateById: async (id: number, updates: Partial<Category>): Promise<Category | undefined> => {
		const [updatedCategory] = await db<Category>('category_services').where({ id }).update(updates).returning('*');
		return updatedCategory;
	},

	deleteById: async (id: number): Promise<number> => {
		return db<Category>('category_services').where({ id }).del();
	},
};

export default categoryModel;
