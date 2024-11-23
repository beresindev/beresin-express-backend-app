import fs from 'fs';
import path from 'path';

export const saveUploadedImages = (files: Express.Multer.File[], serviceId: number): { image: string; service_id: number }[] => {
	const validExtensions = ['.jpg', '.jpeg', '.png'];

	if (files.length > 2) {
		throw new Error('Hanya diperbolehkan mengunggah maksimal 2 foto.');
	}

	return files.map((file, i) => {
		const extension = path.extname(file.originalname).toLowerCase();

		if (!validExtensions.includes(extension)) {
			throw new Error('Format gambar tidak didukung. Hanya jpg, jpeg, dan png yang diperbolehkan.');
		}

		const imagePath = path.join('services/uploads/images', `${Date.now()}-${i}${extension}`);
		fs.writeFileSync(imagePath, file.buffer);

		return { image: imagePath, service_id: serviceId };
	});
};
