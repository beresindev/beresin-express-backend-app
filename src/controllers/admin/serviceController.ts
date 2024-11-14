import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';

// Get All Services with Images
export const getAllServices = asyncHandler(async (_req: Request, res: Response) => {
	console.log('Fetching all services');

	// Ambil semua layanan
	const services = await serviceModel.findAll();

	// Ambil semua ID layanan
	const serviceIds = services.map((service) => service.id);

	// Ambil semua gambar yang terkait dengan layanan
	const images = await imageModel.findByServiceIds(serviceIds);

	// Gabungkan gambar dengan layanan berdasarkan service_id
	const servicesWithImages = services.map((service) => ({
		...service,
		images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
	}));

	console.log(`Services found: ${servicesWithImages.length}`);
	res.json({ status: 'success', services: servicesWithImages });
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	console.log(`Fetching service with ID: ${id}`);

	// Fetch the service by ID
	const service = await serviceModel.findById(Number(id));
	if (!service) {
		console.log(`Service ${id} not found`);
		res.status(404).json({ status: 'error', message: 'Service not found' });
		return;
	}

	// Fetch associated images for the service
	const images = await imageModel.findByServiceId(Number(id));

	const serviceWithImages = {
		...service,
		images: images.map((img) => img.image),
	};

	res.json({ status: 'success', service: serviceWithImages });
});

// Update Service Status
export const updateServiceStatus = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	console.log(`Updating status for service ${id} to ${status}`);

	if (!['accept', 'decline', 'pending'].includes(status)) {
		res.status(400).json({ status: 'error', message: 'Invalid status' });
		return;
	}

	const updatedService = await serviceModel.updateStatus(Number(id), status);
	if (!updatedService) {
		console.log(`Service ${id} not found`);
		res.status(404).json({ status: 'error', message: 'Service not found' });
		return;
	}

	res.json({ status: 'success', service: updatedService });
});

// Delete Service by Admin
export const deleteServiceByAdmin = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	console.log(`Admin deleting service with ID: ${id}`);

	const deleted = await serviceModel.deleteById(Number(id));
	if (!deleted) {
		console.log(`Service ${id} not found`);
		res.status(404).json({ status: 'error', message: 'Service not found' });
		return;
	}

	res.json({ status: 'success', message: 'Service deleted by admin' });
});
