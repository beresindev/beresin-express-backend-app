// controllers/serviceController.ts
import { Request, Response } from 'express';
import asyncHandler from '../handlers/asyncHandler';
import imageModel from '../models/imageModel';
import serviceModel from '../models/serviceModel';
import userModel from '../models/userModel';

// Import userModel untuk mengambil data pengguna

export const getAllApprovedServices = asyncHandler(async (_req: Request, res: Response) => {
	try {
		console.log('Fetching all approved services');

		// Ambil semua layanan yang disetujui
		const services = await serviceModel.findAllApproved();

		// Ambil semua ID layanan yang disetujui
		const serviceIds = services.map((service) => service.id);

		// Ambil semua gambar yang terkait dengan layanan yang disetujui
		const images = await imageModel.findByServiceIds(serviceIds);

		// Ambil data pengguna berdasarkan user_id pada setiap layanan
		const userIds = services.map((service) => service.user_id);
		const users = await userModel.findByIds(userIds); // Menambahkan fungsi findByIds di userModel

		// Gabungkan gambar dan nomor telepon dengan layanan berdasarkan service_id
		const servicesWithImagesAndPhone = services.map((service) => {
			const serviceImages = images.filter((image) => image.service_id === service.id).map((img) => img.image);
			const user = users.find((user) => user.id === service.user_id); // Temukan data pengguna berdasarkan user_id
			return {
				...service,
				images: serviceImages,
				phone: user ? user.phone : null, // Tambahkan nomor telepon pengguna
			};
		});

		console.log(`Approved services found: ${servicesWithImagesAndPhone.length}`);
		res.status(200).json({ status: 'success', services: servicesWithImagesAndPhone });
	} catch (error) {
		console.error('Get All Approved Services error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});
