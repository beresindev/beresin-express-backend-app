import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import userModel from '../../models/userModel';
import { saveUploadedImages } from '../../utils/filleHandler';
import { capitalize, capitalizeFirstWord } from '../../utils/formatStyle';
import { parseCurrency, serviceValidationInput } from '../../validations/serviceValidation';

// Fetch user services with images
export const getUserServices = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;

	const services = await serviceModel.findByUserId(userId);
	const serviceIds = services.map((service) => service.id);
	const images = await imageModel.findByServiceIds(serviceIds);

	const user = await userModel.findById(userId);

	const servicesWithImages = services.map((service) => ({
		...service,
		phone: user?.phone || null,
		images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
	}));

	res.json({ status: 'success', services: servicesWithImages });
});

// Create new service with images
export const createServiceWithImages = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;
	const { name_of_service, category_id, description, min_price, max_price } = req.body;

	const errors = serviceValidationInput({ name_of_service, category_id, description, min_price, max_price });
	if (errors.length) {
		res.status(400).json({ status: 'error', message: errors.join(' ') });
		return;
	}

	const formattedName = `Jasa ${capitalize(name_of_service)}`;
	const formattedDescription = capitalizeFirstWord(description);

	const files = req.files as Express.Multer.File[];

	const newService = await serviceModel.create({
		user_id: userId,
		name_of_service: formattedName,
		category_id: Number(category_id),
		description: formattedDescription,
		min_price: parseCurrency(min_price),
		max_price: parseCurrency(max_price),
		status: 'pending',
	});

	const imagePaths = saveUploadedImages(files, newService.id);
	const newImages = await Promise.all(imagePaths.map((imageData) => imageModel.create(imageData)));

	const user = await userModel.findById(userId);

	res.status(201).json({
		status: 'success',
		service: {
			...newService,
			phone: user?.phone || null,
			images: newImages.map((img) => img.image),
		},
	});
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = (req as any).user.id;

	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(404).json({ status: 'error', message: 'Layanan tidak ditemukan atau Anda tidak memiliki akses.' });
		return; // Explicitly end function execution
	}

	const images = await imageModel.findByServiceId(Number(id));

	const serviceWithImages = {
		...service,
		images: images.map((img) => img.image),
	};

	res.json({ status: 'success', service: serviceWithImages });
});

// Update existing service with images
export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = (req as any).user.id;
	const { name_of_service, category_id, description, min_price, max_price } = req.body;

	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(403).json({ status: 'error', message: 'Anda tidak diizinkan untuk mengedit layanan ini.' });
		return;
	}

	const errors = serviceValidationInput({ name_of_service, category_id, description, min_price, max_price });
	if (errors.length) {
		res.status(400).json({ status: 'error', message: errors.join(' ') });
		return;
	}

	const formattedName = `Jasa ${capitalize(name_of_service)}`;
	const formattedDescription = capitalizeFirstWord(description);

	const files = req.files as Express.Multer.File[];

	const updatedService = await serviceModel.updateById(Number(id), {
		name_of_service: formattedName,
		category_id: Number(category_id),
		description: formattedDescription,
		min_price: parseCurrency(min_price),
		max_price: parseCurrency(max_price),
	});

	await imageModel.deleteByServiceId(service.id);
	const imagePaths = saveUploadedImages(files, service.id);
	const newImages = await Promise.all(imagePaths.map((imageData) => imageModel.create(imageData)));

	const user = await userModel.findById(userId);

	res.json({
		status: 'success',
		service: {
			...updatedService,
			phone: user?.phone || null,
			images: newImages.map((img) => img.image),
		},
	});
});

export const deleteUserService = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = (req as any).user.id;

	const service = await serviceModel.findById(Number(id));
	if (!service || service.user_id !== userId) {
		res.status(403).json({ status: 'error', message: 'Anda tidak diizinkan untuk menghapus layanan ini.' });
		return;
	}

	await imageModel.deleteByServiceId(service.id);
	await serviceModel.deleteById(Number(id));

	res.json({ status: 'success', message: 'Layanan berhasil dihapus.' });
});
