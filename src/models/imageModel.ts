import db from '../configs/knexConfig';

interface Image {
	id: number;
	image: string;
	service_id: number;
}

const imageModel = {
	// Buat entri gambar baru
	create: async (imageData: Partial<Image>): Promise<Image> => {
		const [newImage] = await db<Image>('images').insert(imageData).returning('*');
		return newImage;
	},

	// Temukan semua gambar berdasarkan ID layanan
	findByServiceId: async (serviceId: number): Promise<Image[]> => {
		return db<Image>('images').where({ service_id: serviceId });
	},

	// Temukan semua gambar berdasarkan daftar ID layanan
	findByServiceIds: async (serviceIds: number[]): Promise<Image[]> => {
		return db<Image>('images').whereIn('service_id', serviceIds);
	},

	// Hapus gambar berdasarkan ID layanan
	deleteByServiceId: async (serviceId: number): Promise<number> => {
		return db<Image>('images').where({ service_id: serviceId }).del();
	},

	// Hapus semua gambar berdasarkan daftar ID layanan
	deleteByServiceIds: async (serviceIds: number[]): Promise<number> => {
		return db<Image>('images').whereIn('service_id', serviceIds).del();
	},
};

export default imageModel;
