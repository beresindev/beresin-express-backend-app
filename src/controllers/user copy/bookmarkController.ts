import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import bookmarkModel from '../../models/bookmarkModel';
import serviceModel from '../../models/serviceModel';
import imageModel from '../../models/imageModel';
import userModel from '../../models/userModel';
import subscriptionModel from '../../models/subscriptionModel';

// Get all services bookmarked by the user
export const getUserBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const userId = (req as any).user.id; // Mendapatkan user ID dari middleware autentikasi

	// Fetch all bookmarks for the user
	const bookmarks = await bookmarkModel.findByUser(userId);

	if (bookmarks.length === 0) {
		res.json({
			status: 'success',
			message: 'Belum ada layanan yang dibookmark.',
			services: [],
		});
		return;
	}

	// Extract service IDs from bookmarks
	const serviceIds = bookmarks.map((bookmark) => bookmark.service_id);

	// Fetch services for the bookmarked service IDs
	const services = await serviceModel.findByIds(serviceIds);

	// Fetch related images for services
	const images = await imageModel.findByServiceIds(serviceIds);

	// Fetch users related to the services
	const userIds = services.map((service) => service.user_id);
	const users = await userModel.findByIds(userIds);

	// Fetch subscription details
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

	// Map services with their images, user phone, and subscription details
	const servicesWithDetails = services.map((service) => {
		const serviceImages = images.filter((image) => image.service_id === service.id).map((img) => img.image);
		const user = users.find((user) => user.id === service.user_id);
		const subscriptionDetail = subscriptions.find((sub) => sub.service_id === service.id);

		// Remove isSubscription from the top-level service
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

// Toggle bookmark untuk service
export const toggleBookmark = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;
	const { serviceId } = req.params;

	// Validasi apakah service ada dan statusnya "accept"
	const service = await serviceModel.findById(Number(serviceId));
	if (!service || service.status !== 'accept') {
		res.status(400).json({ status: 'error', message: 'Service tidak ditemukan atau belum disetujui (accept).' });
		return;
	}

	// Periksa apakah user sudah memberikan bookmark sebelumnya
	const existingBookmark = await bookmarkModel.find(userId, Number(serviceId));

	if (existingBookmark) {
		// Jika sudah di-bookmark, hapus bookmark
		await bookmarkModel.delete(userId, Number(serviceId));
		await serviceModel.updateBookmarkCount(Number(serviceId), false); // Kurangi 1 dari bookmark_count
		res.status(200).json({ status: 'success', message: 'Bookmark berhasil dihapus.' });
	} else {
		// Jika belum di-bookmark, tambahkan bookmark
		const bookmark = await bookmarkModel.create(userId, Number(serviceId));
		await serviceModel.updateBookmarkCount(Number(serviceId), true); // Tambahkan 1 ke bookmark_count
		res.status(201).json({ status: 'success', message: 'Bookmark berhasil ditambahkan.', bookmark });
	}
});

