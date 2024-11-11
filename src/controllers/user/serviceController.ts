import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';

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

// Membuat layanan baru dengan gambar
export const createServiceWithImages = asyncHandler(async (req: Request, res: Response) => {
	const { name_of_service, category_id, description } = req.body;
	const userId = (req as any).user.id;

	// Log untuk memeriksa seluruh request body
	console.log('Full request body (create):', req.body);

	// Log spesifik untuk field images
	console.log('Images field (create):', req.body.images);

	// Validate required fields
	if (!name_of_service || !category_id || !description) {
		res.status(400).json({ status: 'error', message: 'name_of_service, category_id, and description are required' });
		return;
	}

	let images: string[] = [];

	// Handle parsing jika `multipart/form-data` vs JSON
	if (req.is('multipart/form-data')) {
		// Jika `images` adalah string, coba parsing sebagai JSON
		if (typeof req.body.images === 'string') {
			try {
				images = JSON.parse(req.body.images);
				console.log('Parsed images (create):', images); // Log hasil parsing images
			} catch (error) {
				console.error('Error parsing images JSON (create):', error); // Log error parsing JSON
				res.status(400).json({ status: 'error', message: 'Invalid images format' });
				return;
			}
		} else {
			res.status(400).json({ status: 'error', message: 'Images should be in Base64 format within a JSON array' });
			return;
		}
	} else {
		// Untuk JSON data format (direct Base64 images in `req.body.images`)
		images = req.body.images;
	}

	// Log setelah memastikan images telah terisi
	console.log('Final images array (create):', images);

	// Validasi bahwa images adalah array dan memiliki item
	if (!Array.isArray(images) || images.length === 0) {
		res.status(400).json({ status: 'error', message: 'At least one image is required' });
		return;
	}
	if (images.length > 2) {
		res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed' });
		return;
	}

	// Lanjutkan proses penyimpanan layanan baru
	const newService = await serviceModel.create({
		user_id: userId,
		name_of_service,
		category_id: Number(category_id),
		description,
		status: 'pending',
	});

	// Proses simpan Base64 images ke file
	const imagePaths = [];
	for (let i = 0; i < images.length; i++) {
		const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');
		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}.png`);
		fs.writeFileSync(imagePath, buffer);
		imagePaths.push({ image: imagePath, service_id: newService.id });
	}

	const newImages = [];
	for (const imageData of imagePaths) {
		const newImage = await imageModel.create(imageData);
		newImages.push(newImage);
	}

	res.status(201).json({ status: 'success', service: newService, images: newImages });
});

export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name_of_service, category_id, description } = req.body;
	const userId = (req as any).user.id;

	// Log untuk memeriksa seluruh request body
	console.log('Full request body (update):', req.body);

	// Log spesifik untuk field images
	console.log('Images field (update):', req.body.images);

	// Check if service exists and belongs to the user
	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(403).json({ status: 'error', message: 'Unauthorized to edit this service' });
		return;
	}

	// Validate required fields
	if (!name_of_service || !category_id || !description) {
		res.status(400).json({ status: 'error', message: 'name_of_service, category_id, and description are required' });
		return;
	}

	let images: string[] = [];

	if (req.is('multipart/form-data')) {
		// Jika `images` adalah string, coba parsing sebagai JSON
		if (typeof req.body.images === 'string') {
			try {
				images = JSON.parse(req.body.images);
				console.log('Parsed images (update):', images); // Log hasil parsing images
			} catch (error) {
				console.error('Error parsing images JSON (update):', error); // Log error parsing JSON
				res.status(400).json({ status: 'error', message: 'Invalid images format' });
				return;
			}
		} else {
			res.status(400).json({ status: 'error', message: 'Images should be in Base64 format within a JSON array' });
			return;
		}
	} else {
		images = req.body.images;
	}

	// Log setelah memastikan images telah terisi
	console.log('Final images array (update):', images);

	// Validasi bahwa images adalah array dan memiliki item
	if (!Array.isArray(images) || images.length === 0) {
		res.status(400).json({ status: 'error', message: 'At least one image is required' });
		return;
	}
	if (images.length > 2) {
		res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed' });
		return;
	}

	// Lanjutkan proses update layanan
	const updatedService = await serviceModel.updateById(Number(id), {
		name_of_service,
		category_id: Number(category_id),
		description,
	});

	if (!updatedService) {
		res.status(500).json({ status: 'error', message: 'Failed to update service' });
		return;
	}

	const serviceResponse = { ...updatedService, images: [] as string[] };

	// Hapus gambar yang ada sebelum menambahkan yang baru
	await imageModel.deleteByServiceId(service.id);

	// Proses simpan Base64 images ke file
	const imagePaths = [];
	for (let i = 0; i < images.length; i++) {
		const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');
		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}.png`);
		fs.writeFileSync(imagePath, buffer);
		imagePaths.push({ image: imagePath, service_id: service.id });
	}

	const newImages = [];
	for (const imageData of imagePaths) {
		const newImage = await imageModel.create(imageData);
		newImages.push(newImage);
	}

	serviceResponse.images = newImages.map((img) => img.image);

	res.json({ status: 'success', service: serviceResponse });
});

export const deleteUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = (req as any).user.id;

	// Verifikasi bahwa layanan tersebut adalah milik pengguna
	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(403).json({ status: 'error', message: 'Unauthorized to delete this service' });
		return;
	}

	// Hapus gambar terkait sebelum menghapus layanan
	await imageModel.deleteByServiceId(service.id);

	// Hapus layanan
	await serviceModel.deleteById(Number(id));
	res.json({ status: 'success', message: 'Service deleted successfully' });
});
