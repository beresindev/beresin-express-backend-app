import { Request, Response } from 'express';
import imageModel from '../models/imageModel';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
	const { service_id } = req.body;

	// Check for multer error or empty files
	if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
		res.status(400).json({ status: 'error', message: 'At least one image is required' });
		return; // Exit the function without returning a Response object
	}

	try {
		const existingImages = await imageModel.findByServiceId(service_id);
		if (existingImages.length >= 2) {
			res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed per service' });
			return;
		}

		const uploadedImages = req.files as Express.Multer.File[];
		const imagePaths = uploadedImages.map((file) => ({
			image: file.path,
			service_id,
		}));

		const newImages = [];
		for (const imageData of imagePaths) {
			const newImage = await imageModel.create(imageData);
			newImages.push(newImage);
		}

		res.status(201).json({ status: 'success', images: newImages });
	} catch (error) {
		console.error('Upload Image error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};
