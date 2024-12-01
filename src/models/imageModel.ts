import db from '../configs/knexConfig';

interface Image {
	id: number;
	image: string;
	service_id: number;
}

const imageModel = {
	create: async (imageData: Partial<Image>): Promise<Image> => {
		const [newImage] = await db<Image>('images').insert(imageData).returning('*');
		return newImage;
	},

	findByServiceId: async (serviceId: number): Promise<Image[]> => {
		return db<Image>('images').where({ service_id: serviceId });
	},

	findByServiceIds: async (serviceIds: number[]): Promise<Image[]> => {
		return db<Image>('images').whereIn('service_id', serviceIds);
	},

	deleteByServiceId: async (serviceId: number): Promise<number> => {
		return db<Image>('images').where({ service_id: serviceId }).del();
	},

	deleteByServiceIds: async (serviceIds: number[]): Promise<number> => {
		return db<Image>('images').whereIn('service_id', serviceIds).del();
	},
};

export default imageModel;
