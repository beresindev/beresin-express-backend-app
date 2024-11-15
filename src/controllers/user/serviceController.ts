import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import userModel from '../../models/userModel';

// Function to save uploaded images directly from `multipart/form-data`
const saveUploadedImages = (files: Express.Multer.File[], serviceId: number) => {
	return files.map((file, i) => {
		const extension = path.extname(file.originalname).toLowerCase(); // Get file extension
		const validExtensions = ['.jpg', '.jpeg', '.png'];

		if (!validExtensions.includes(extension)) {
			throw new Error('Unsupported image format. Only jpg, jpeg, and png are allowed.');
		}

		// Create unique image path
		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}${extension}`);
		fs.writeFileSync(imagePath, file.buffer);

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

	if (!name_of_service || !category_id || !description) {
		res.status(400).json({ status: 'error', message: 'name_of_service, category_id, and description are required' });
		return;
	}

	const files = req.files as Express.Multer.File[];

	try {
		const newService = await serviceModel.create({
			user_id: userId,
			name_of_service,
			category_id: Number(category_id),
			description,
			status: 'pending',
		});

		const imagePaths = saveUploadedImages(files, newService.id);

		const newImages = [];
		for (const imageData of imagePaths) {
			const newImage = await imageModel.create(imageData);
			newImages.push(newImage);
		}

		const user = await userModel.findById(userId);
		const userPhone = user ? user.phone : null;

		res.status(201).json({
			status: 'success',
			service: {
				...newService,
				phone: userPhone,
				images: newImages.map((img) => img.image),
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

	const files = req.files as Express.Multer.File[];

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
		const imagePaths = saveUploadedImages(files, service.id);

		const newImages = [];
		for (const imageData of imagePaths) {
			const newImage = await imageModel.create(imageData);
			newImages.push(newImage);
		}

		const user = await userModel.findById(userId);
		const userPhone = user ? user.phone : null;

		res.json({
			status: 'success',
			service: {
				...updatedService,
				phone: userPhone,
				images: newImages.map((img) => img.image),
			},
		});
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
