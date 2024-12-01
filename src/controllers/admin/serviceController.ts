import { Request, Response } from 'express';
import db from '../../configs/knexConfig';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import subscriptionModel from '../../models/subscriptionModel';

export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
	console.log('Fetching all services');

	const { category_id } = req.query;

	let servicesQuery = db('service').select('*');

	if (category_id) {
		servicesQuery = servicesQuery.where('category_id', Number(category_id));
	}

	const services = await servicesQuery;

	if (services.length === 0) {
		res.json({ status: 'success', message: 'Tidak ada jasa yang tersedia saat ini.', services: [] });
		return;
	}

	const sortedServices = services.sort((a, b) => a.id - b.id);

	const serviceIds = sortedServices.map((service) => service.id);

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
						expired_at: subscription.expired_at,
					}
				: { service_id: serviceId, isSubscription: false, boost_name: null, duration: null, expired_at: null };
		}),
	);

	const servicesWithDetails = sortedServices.map((service) => {
		const subscriptionDetail = subscriptions.find((sub) => sub.service_id === service.id);
		const { isSubscription, expired_at, ...rest } = service;
		return {
			...rest,
			images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
			subscription: {
				isSubscription: subscriptionDetail?.isSubscription || false,
				boost_name: subscriptionDetail?.boost_name || 'Tidak ada',
				duration: subscriptionDetail?.duration || 'Tidak ada',
				expired_at: subscriptionDetail?.expired_at || null,
			},
		};
	});

	res.json({ status: 'success', services: servicesWithDetails });
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	console.log(`Fetching service with ID: ${id}`);

	const service = await serviceModel.findById(Number(id));
	if (!service) {
		console.log(`Service ${id} not found`);
		res.status(404).json({ status: 'error', message: 'Service not found' });
		return;
	}

	const images = await imageModel.findByServiceId(Number(id));

	const subscription = await subscriptionModel.findActiveByServiceId(Number(id));

	const subscriptionDetails = subscription
		? {
				isSubscription: true,
				boost_name: subscription.boost_name,
				duration: subscription.duration,
				expired_at: subscription.expired_at,
			}
		: {
				isSubscription: false,
				boost_name: 'Tidak ada',
				duration: 'Tidak ada',
				expired_at: null, 
			};

	const { isSubscription, ...rest } = service;

	const serviceWithDetails = {
		...rest,
		images: images.map((img) => img.image),
		subscription: subscriptionDetails,
	};

	res.json({ status: 'success', service: serviceWithDetails });
});

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
