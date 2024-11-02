import { Request, Response } from 'express';
import imageModel from '../models/imageModel';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
	const { service_id } = req.body;

	// Cek apakah ada error dari multer
	if (!req.files) {
		res.status(400).json({ status: 'error', message: 'Only .png, .jpg, and .jpeg files are allowed!' });
		return;
	}

	try {
		// Cek apakah sudah ada 2 gambar untuk service_id ini
		const existingImages = await imageModel.findByServiceId(service_id);
		if (existingImages.length >= 2) {
			res.status(400).json({ status: 'error', message: 'Maximum of 2 images allowed per service' });
			return;
		}

		// Ambil gambar yang diupload dari request
		const uploadedImages = req.files as Express.Multer.File[];
		const imagePaths = uploadedImages.map((file) => ({
			image: file.path,
			service_id,
		}));

		// Simpan setiap gambar dalam database
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
