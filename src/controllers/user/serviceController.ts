import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';

// Create Service with Images
export const createServiceWithImages = asyncHandler(async (req: Request, res: Response) => {
	const { name_of_service, category_id, description } = req.body;
	const userId = (req as any).user.id;

	console.log('Request Body:', req.body); // Tambahan log untuk debugging

	// Validasi `category_id`
	if (!category_id) {
		console.log('Error: category_id tidak ditemukan dalam request body');
		res.status(400).json({ status: 'error', message: 'category_id is required' });
		return;
	}

	console.log(`User ${userId} creating service with images: ${name_of_service}, category_id: ${category_id}`);

	// Step 1: Save service data in 'service' table
	const newService = await serviceModel.create({
		user_id: userId,
		name_of_service,
		category_id: Number(category_id), // Konversi category_id ke number untuk memastikan tipe data benar
		description,
		status: 'pending',
	});

	// Step 2: Upload images if provided
	if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
		console.log('File upload error: No files provided');
		res.status(400).json({ status: 'error', message: 'At least one image file is required!' });
		return;
	}

	const uploadedImages = req.files as Express.Multer.File[];
	if (uploadedImages.length > 2) {
		console.log('File upload error: More than 2 files provided');
		res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed per service' });
		return;
	}

	// Step 3: Save image paths in 'images' table
	const imagePaths = uploadedImages.map((file) => ({ image: file.path, service_id: newService.id }));
	const newImages = [];
	for (const imageData of imagePaths) {
		const newImage = await imageModel.create(imageData);
		newImages.push(newImage);
	}

	console.log(`Service and images created successfully for service ID: ${newService.id}`);
	res.status(201).json({ status: 'success', service: newService, images: newImages });
});

// Get User Services
export const getUserServices = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;

	console.log(`Fetching services for user ${userId}`);

	// Ambil semua layanan milik user
	const services = await serviceModel.findByUserId(userId);

	// Ambil semua ID layanan untuk pencarian gambar
	const serviceIds = services.map((service) => service.id);

	// Ambil semua gambar yang terkait dengan layanan
	const images = await imageModel.findByServiceIds(serviceIds);

	// Gabungkan gambar dengan layanan berdasarkan service_id
	const servicesWithImages = services.map((service) => ({
		...service,
		images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
	}));

	res.json({ status: 'success', services: servicesWithImages });
});

// Update User Service
export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name_of_service, category_id, description } = req.body;
	const userId = (req as any).user.id;

	console.log(`User ${userId} updating service ${id}`);
	const service = await serviceModel.findById(Number(id));

	if (!service || service.user_id !== userId) {
		console.log(`Unauthorized or service not found for service ID: ${id}`);
		res.status(403).json({ status: 'error', message: 'Unauthorized to edit this service' });
		return;
	}

	const updatedService = await serviceModel.updateById(Number(id), {
		name_of_service,
		category_id,
		description,
	});

	res.json({ status: 'success', service: updatedService });
});

// Delete User Service
export const deleteUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = (req as any).user.id;

	console.log(`User ${userId} deleting service ${id}`);
	const service = await serviceModel.findById(Number(id));

	if (!service || service.user_id !== userId) {
		console.log(`Unauthorized or service not found for service ID: ${id}`);
		res.status(403).json({ status: 'error', message: 'Unauthorized to delete this service' });
		return;
	}

	await serviceModel.deleteById(Number(id));
	res.json({ status: 'success', message: 'Service deleted successfully' });
});
