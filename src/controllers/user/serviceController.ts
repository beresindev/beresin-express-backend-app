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

	// Validate required fields
	if (!name_of_service || !category_id || !description) {
		res.status(400).json({ status: 'error', message: 'name_of_service, category_id, and description are required' });
		return; // Add return to stop execution here
	}

	// Initialize images array
	let images: string[] = [];

	// Handle `multipart/form-data` vs. JSON request handling for images
	if (req.is('multipart/form-data')) {
		// For multipart, `images` might be sent as a string; parse it if so
		if (typeof req.body.images === 'string') {
			try {
				images = JSON.parse(req.body.images);
			} catch (error) {
				res.status(400).json({ status: 'error', message: 'Invalid images format' });
				return; // Stop execution
			}
		} else {
			res.status(400).json({ status: 'error', message: 'Images should be in Base64 format within a JSON array' });
			return;
		}
	} else {
		// Handle JSON data format (direct Base64 images in `req.body.images`)
		images = req.body.images;
	}

	// Validate that images is an array and has at least one item
	if (!Array.isArray(images) || images.length === 0) {
		res.status(400).json({ status: 'error', message: 'At least one image is required' });
		return;
	}
	if (images.length > 2) {
		res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed' });
		return;
	}

	// Validate each image's Base64 format
	for (let i = 0; i < images.length; i++) {
		if (!/^data:image\/(png|jpeg|jpg);base64,/.test(images[i])) {
			res.status(400).json({ status: 'error', message: 'Invalid Base64 image format' });
			return;
		}
	}

	// Proceed with service creation
	const newService = await serviceModel.create({
		user_id: userId,
		name_of_service,
		category_id: Number(category_id),
		description,
		status: 'pending',
	});

	// Process and save each Base64 image
	const imagePaths = [];
	for (let i = 0; i < images.length; i++) {
		const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');
		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}.png`);

		// Save the image file
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

	// Handle `multipart/form-data` vs. JSON request handling for images
	console.log('Request Headers:', req.headers);
	console.log('Request Body:', req.body);

	if (req.is('multipart/form-data')) {
		// Parse `images` as JSON if it's a string
		if (typeof req.body.images === 'string') {
			try {
				images = JSON.parse(req.body.images);
				console.log('Parsed images:', images); // Debugging
			} catch (error) {
				console.error('Error parsing images JSON:', error); // Log any JSON parsing error
				res.status(400).json({ status: 'error', message: 'Invalid images format' });
				return;
			}
		} else {
			res.status(400).json({ status: 'error', message: 'Images should be in Base64 format within a JSON array' });
			return;
		}
	} else {
		// Handle JSON data format (direct Base64 images in `req.body.images`)
		images = req.body.images;
	}

	// Validate that images is an array and has at least one item
	if (!Array.isArray(images) || images.length === 0) {
		console.log('Images validation failed. Received images:', images); // Log received images for debugging
		res.status(400).json({ status: 'error', message: 'At least one image is required' });
		return;
	}
	if (images.length > 2) {
		res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed' });
		return;
	}

	// Validate each image's Base64 format
	for (let i = 0; i < images.length; i++) {
		if (!/^data:image\/(png|jpeg|jpg);base64,/.test(images[i])) {
			res.status(400).json({ status: 'error', message: 'Invalid Base64 image format' });
			return;
		}
	}

	// Update the service details
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

	// Delete existing images for this service
	await imageModel.deleteByServiceId(service.id);

	// Process and save each new Base64 image
	const imagePaths = [];
	for (let i = 0; i < images.length; i++) {
		const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');
		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}.png`);

		// Save the image file
		fs.writeFileSync(imagePath, buffer);

		imagePaths.push({ image: imagePath, service_id: service.id });
	}

	// Save new image paths to the database
	const newImages = [];
	for (const imageData of imagePaths) {
		const newImage = await imageModel.create(imageData);
		newImages.push(newImage);
	}

	serviceResponse.images = newImages.map((img) => img.image);

	// Final response
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
