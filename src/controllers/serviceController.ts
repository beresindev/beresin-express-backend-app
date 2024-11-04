// controllers/serviceController.ts
import { Request, Response } from 'express';
import asyncHandler from '../handlers/asyncHandler';
import imageModel from '../models/imageModel';
import serviceModel from '../models/serviceModel';

export const getAllApprovedServices = asyncHandler(async (_req: Request, res: Response) => {
	try {
		console.log('Fetching all approved services');

		// Ambil semua layanan yang disetujui
		const services = await serviceModel.findAllApproved();

		// Ambil semua ID layanan yang disetujui
		const serviceIds = services.map((service) => service.id);

		// Ambil semua gambar yang terkait dengan layanan yang disetujui
		const images = await imageModel.findByServiceIds(serviceIds);

		// Gabungkan gambar dengan layanan berdasarkan service_id
		const servicesWithImages = services.map((service) => ({
			...service,
			images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
		}));

		console.log(`Approved services found: ${servicesWithImages.length}`);
		res.status(200).json({ status: 'success', services: servicesWithImages });
	} catch (error) {
		console.error('Get All Approved Services error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});
