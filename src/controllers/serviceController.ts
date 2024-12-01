import { Request, Response } from 'express';
import asyncHandler from '../handlers/asyncHandler';
import imageModel from '../models/imageModel';
import serviceModel from '../models/serviceModel';
import subscriptionModel from '../models/subscriptionModel';
import userModel from '../models/userModel';

export const getAllApprovedServices = asyncHandler(async (_req: Request, res: Response) => {
	try {
		console.log('Fetching all approved services with subscription details');

		const services = await serviceModel.findAllApproved();

		if (services.length === 0) {
			res.status(404).json({ status: 'error', message: 'Belum ada layanan yang disetujui.' });
			return;
		}

		const serviceIds = services.map((service) => service.id);
		const images = await imageModel.findByServiceIds(serviceIds);

		const userIds = services.map((service) => service.user_id);
		const users = await userModel.findByIds(userIds);

		const subscriptions = await Promise.all(
			serviceIds.map(async (serviceId) => {
				const subscription = await subscriptionModel.findActiveByServiceId(serviceId);
				return subscription
					? {
							isSubscription: true,
							boost_name: subscription.boost_name,
							duration: subscription.duration,
							expired_at: new Date(new Date(subscription.updated_at).getTime() + subscription.duration * 24 * 60 * 60 * 1000).toISOString(),
						}
					: {
							isSubscription: false,
							boost_name: 'Tidak ada',
							duration: 'Tidak ada',
							expired_at: null,
						};
			}),
		);

		const servicesWithDetails = services.map((service, index) => {
			const serviceImages = images.filter((image) => image.service_id === service.id).map((img) => img.image);
			const user = users.find((user) => user.id === service.user_id);
			const subscriptionDetail = subscriptions[index];

			const { isSubscription, ...serviceWithoutSubscription } = service;

			return {
				...serviceWithoutSubscription,
				phone: user ? user.phone : null,
				images: serviceImages,
				subscription: subscriptionDetail,
			};
		});

		console.log(`Approved services with subscription details: ${servicesWithDetails.length}`);
		res.status(200).json({ status: 'success', services: servicesWithDetails });
	} catch (error) {
		console.error('Error fetching approved services with subscription details:', error);
		res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
	}
});
