import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import bookmarkModel from '../../models/bookmarkModel';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import subscriptionModel from '../../models/subscriptionModel';
import userModel from '../../models/userModel';

export const getUserBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const userId = (req as any).user.id;

	const bookmarks = await bookmarkModel.findByUser(userId);

	if (bookmarks.length === 0) {
		res.json({
			status: 'success',
			message: 'Belum ada layanan yang dibookmark.',
			services: [],
		});
		return;
	}

	const serviceIds = bookmarks.map((bookmark) => bookmark.service_id);

	const services = await serviceModel.findByIds(serviceIds);

	const images = await imageModel.findByServiceIds(serviceIds);

	const userIds = services.map((service) => service.user_id);
	const users = await userModel.findByIds(userIds);

	const subscriptions = await Promise.all(
		serviceIds.map(async (serviceId) => {
			const subscription = await subscriptionModel.findActiveByServiceId(serviceId);
			return subscription
				? {
						service_id: serviceId,
						isSubscription: true,
						boost_name: subscription.boost_name,
						duration: subscription.duration,
						expired_at: new Date(new Date(subscription.updated_at).getTime() + subscription.duration * 24 * 60 * 60 * 1000).toISOString(),
					}
				: {
						service_id: serviceId,
						isSubscription: false,
						boost_name: 'Tidak ada',
						duration: 'Tidak ada',
						expired_at: null,
					};
		}),
	);

	const servicesWithDetails = services.map((service) => {
		const serviceImages = images.filter((image) => image.service_id === service.id).map((img) => img.image);
		const user = users.find((user) => user.id === service.user_id);
		const subscriptionDetail = subscriptions.find((sub) => sub.service_id === service.id);

		const { isSubscription, ...serviceWithoutSubscription } = service;

		return {
			...serviceWithoutSubscription,
			phone: user ? user.phone : null,
			images: serviceImages,
			subscription: subscriptionDetail || {
				isSubscription: false,
				boost_name: 'Tidak ada',
				duration: 'Tidak ada',
				expired_at: null,
			},
		};
	});

	res.json({
		status: 'success',
		services: servicesWithDetails,
	});
});

export const toggleBookmark = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;
	const { serviceId } = req.params;

	const service = await serviceModel.findById(Number(serviceId));
	if (!service || service.status !== 'accept') {
		res.status(400).json({ status: 'error', message: 'Service tidak ditemukan atau belum disetujui (accept).' });
		return;
	}

	const existingBookmark = await bookmarkModel.find(userId, Number(serviceId));

	if (existingBookmark) {
		await bookmarkModel.delete(userId, Number(serviceId));
		await serviceModel.updateBookmarkCount(Number(serviceId), false);
		res.status(200).json({ status: 'success', message: 'Bookmark berhasil dihapus.' });
	} else {
		const bookmark = await bookmarkModel.create(userId, Number(serviceId));
		await serviceModel.updateBookmarkCount(Number(serviceId), true); 
		res.status(201).json({ status: 'success', message: 'Bookmark berhasil ditambahkan.', bookmark });
	}
});
