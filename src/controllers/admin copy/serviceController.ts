import { Request, Response } from 'express';
import db from '../../configs/knexConfig';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import subscriptionModel from '../../models/subscriptionModel';

// Get All Services with Images and Subscription Details
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
	console.log('Fetching all services');

	const { category_id } = req.query; // Mendapatkan category_id dari query params

	// Mulai membangun query menggunakan knex langsung
	let servicesQuery = db('service').select('*'); // Membuat query builder knex

	// Jika category_id ada, filter berdasarkan category_id
	if (category_id) {
		servicesQuery = servicesQuery.where('category_id', Number(category_id)); // Filter berdasarkan category_id
	}

	// Ambil data layanan yang sesuai dengan filter (atau semua layanan jika tidak ada filter)
	const services = await servicesQuery;

	if (services.length === 0) {
		res.json({ status: 'success', message: 'Tidak ada jasa yang tersedia saat ini.', services: [] });
		return;
	}

	// Sortir layanan berdasarkan ID
	const sortedServices = services.sort((a, b) => a.id - b.id);

	// Ambil ID layanan untuk keperluan mengambil gambar dan detail langganan
	const serviceIds = sortedServices.map((service) => service.id);

	// Ambil gambar dan langganan untuk semua layanan
	const images = await imageModel.findByServiceIds(serviceIds);
	const subscriptions = await Promise.all(
		serviceIds.map(async (serviceId) => {
			const subscription = await subscriptionModel.findActiveByServiceId(serviceId);
			return subscription
				? {
						service_id: serviceId,
						isSubscription: true,
						boost_name: subscription.boost_name,
						duration: subscription.duration,
					}
				: { service_id: serviceId, isSubscription: false, boost_name: null, duration: null };
		}),
	);

	// Gabungkan data gambar dan subscription dengan layanan
	const servicesWithDetails = sortedServices.map((service) => {
		const subscriptionDetail = subscriptions.find((sub) => sub.service_id === service.id);
		const { isSubscription, ...rest } = service; // Exclude isSubscription from top level
		return {
			...rest,
			images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
			subscription: {
				isSubscription: subscriptionDetail?.isSubscription || false, // Include in subscription details
				boost_name: subscriptionDetail?.boost_name || 'Tidak ada',
				duration: subscriptionDetail?.duration || 'Tidak ada',
			},
		};
	});

	res.json({ status: 'success', services: servicesWithDetails });
});

// Get Service by ID with Images and Subscription Details
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

	// Fetch images for the service
	const images = await imageModel.findByServiceId(Number(id));

	// Fetch subscription details for the service
	const subscription = await subscriptionModel.findActiveByServiceId(Number(id));

	// Map subscription details
	const subscriptionDetails = subscription
		? {
				isSubscription: true,
				boost_name: subscription.boost_name,
				duration: subscription.duration,
			}
		: {
				isSubscription: false,
				boost_name: 'Tidak ada',
				duration: 'Tidak ada',
			};

	// Exclude `isSubscription` from the service response
	const { isSubscription, ...rest } = service;

	// Combine service details with images and subscription
	const serviceWithDetails = {
		...rest,
		images: images.map((img) => img.image),
		subscription: subscriptionDetails,
	};

	res.json({ status: 'success', service: serviceWithDetails });
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
