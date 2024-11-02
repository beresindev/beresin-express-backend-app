import db from '../configs/knexConfig';

interface Image {
	id: number;
	image: string;
	service_id: number;
}

const imageModel = {
	// Menyimpan gambar ke dalam tabel 'images'
	create: async (imageData: Partial<Image>): Promise<Image> => {
		const [newImage] = await db<Image>('images').insert(imageData).returning('*'); // Ganti 'image' ke 'images'
		return newImage;
	},

	// Mencari gambar berdasarkan service_id di tabel 'images'
	findByServiceId: async (serviceId: number): Promise<Image[]> => {
		return db<Image>('images').where({ service_id: serviceId }); // Ganti 'image' ke 'images'
	},

	// Menghapus gambar berdasarkan service_id di tabel 'images'
	deleteByServiceId: async (serviceId: number): Promise<number> => {
		return db<Image>('images').where({ service_id: serviceId }).del(); // Ganti 'image' ke 'images'
	},
};

export default imageModel;
