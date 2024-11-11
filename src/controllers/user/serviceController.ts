import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import userModel from '../../models/userModel';

// Helper function to validate and get file extension from MIME type
const validateAndGetExtension = (mimeType: string): string | null => {
	if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
		return 'jpg';
	} else if (mimeType === 'image/png') {
		return 'png';
	}
	return null; // Return null if format is not supported
};

// Function to save images with validation and correct extension
const saveImages = (images: string[], serviceId: number) => {
	return images.map((image, i) => {
		// Extract MIME type
		const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/);
		const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : null;

		// Validate and get file extension
		const extension = mimeType ? validateAndGetExtension(mimeType) : null;
		if (!extension) {
			throw new Error(`Unsupported image format. Only jpg, jpeg, and png are allowed.`);
		}

		// Remove the base64 prefix to get raw data
		const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
		const buffer = Buffer.from(base64Data, 'base64');

		// Create the file path with the validated extension
		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}.${extension}`);
		fs.writeFileSync(imagePath, buffer);

		return { image: imagePath, service_id: serviceId };
	});
};

// Controller to fetch user services with images
export const getUserServices = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;
	console.log(`Fetching services for user ${userId}`);

	const services = await serviceModel.findByUserId(userId);
	const serviceIds = services.map((service) => service.id);
	const images = await imageModel.findByServiceIds(serviceIds);

	// Fetch user data to get the phone number
	const user = await userModel.findById(userId);
	const userPhone = user ? user.phone : null;

	const servicesWithImages = services.map((service) => ({
		...service,
		phone: userPhone,
		images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
	}));

	res.json({ status: 'success', services: servicesWithImages });
});

// Controller to create a new service with images
export const createServiceWithImages = asyncHandler(async (req: Request, res: Response) => {
	const { name_of_service, category_id, description } = req.body;
	const userId = (req as any).user.id;

	// Validate required fields
	if (!name_of_service || !category_id || !description) {
		res.status(400).json({ status: 'error', message: 'name_of_service, category_id, and description are required' });
		return;
	}

	let images: string[] = [];

	// Handle parsing if `multipart/form-data` vs JSON
	if (req.is('multipart/form-data')) {
		if (typeof req.body.images === 'string') {
			try {
				images = JSON.parse(req.body.images);
			} catch (error) {
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

	try {
		// Create the service first
		const newService = await serviceModel.create({
			user_id: userId,
			name_of_service,
			category_id: Number(category_id),
			description,
			status: 'pending',
		});

		// Save images associated with the new service
		const imagePaths = saveImages(images, newService.id); // Use newService.id here

		const newImages = [];
		for (const imageData of imagePaths) {
			const newImage = await imageModel.create(imageData);
			newImages.push(newImage);
		}

		// Fetch user's phone number for consistency with `GET` response
		const user = await userModel.findById(userId);
		const userPhone = user ? user.phone : null;

		// Format response to match `GET` response structure
		res.status(201).json({
			status: 'success',
			service: {
				...newService,
				phone: userPhone,
				images: newImages.map((img) => img.image), // Only the image paths, as in `GET` response
			},
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		res.status(400).json({ status: 'error', message: errorMessage });
	}
});

// Controller to update an existing service with images
export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name_of_service, category_id, description } = req.body;
	const userId = (req as any).user.id;

	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(403).json({ status: 'error', message: 'Unauthorized to edit this service' });
		return;
	}

	if (!name_of_service || !category_id || !description) {
		res.status(400).json({ status: 'error', message: 'name_of_service, category_id, and description are required' });
		return;
	}

	let images: string[] = [];

	if (req.is('multipart/form-data')) {
		if (typeof req.body.images === 'string') {
			try {
				images = JSON.parse(req.body.images);
			} catch (error) {
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

	try {
		const updatedService = await serviceModel.updateById(Number(id), {
			name_of_service,
			category_id: Number(category_id),
			description,
		});

		if (!updatedService) {
			res.status(500).json({ status: 'error', message: 'Failed to update service' });
			return;
		}

		await imageModel.deleteByServiceId(service.id);
		const imagePaths = saveImages(images, service.id);

		const newImages = [];
		for (const imageData of imagePaths) {
			const newImage = await imageModel.create(imageData);
			newImages.push(newImage);
		}

		res.json({ status: 'success', service: { ...updatedService, images: newImages.map((img) => img.image) } });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		res.status(400).json({ status: 'error', message: errorMessage });
	}
});

// Controller to delete a service
export const deleteUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = (req as any).user.id;

	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(403).json({ status: 'error', message: 'Unauthorized to delete this service' });
		return;
	}

	await imageModel.deleteByServiceId(service.id);
	await serviceModel.deleteById(Number(id));
	res.json({ status: 'success', message: 'Service deleted successfully' });
});
