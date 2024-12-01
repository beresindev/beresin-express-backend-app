import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import userModel from '../../models/userModel';

export const getUserProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const userId = (req as any).user.id;
	console.log(`Fetching profile for user ID: ${userId}`);

	const user = await userModel.findById(userId);
	if (!user) {
		console.log(`User ID: ${userId} not found`);
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	console.log(`User profile retrieved for user ID: ${userId}`);
	res.json({
		status: 'success',
		message: 'User profile retrieved successfully',
		user: {
			id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			created_at: user.created_at,
			updated_at: user.updated_at,
		},
	});
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;

	// Cek apakah pengguna ada
	const user = await userModel.findById(userId);
	if (!user) {
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	// Langkah 1: Temukan semua layanan milik pengguna
	const services = await serviceModel.findByUserId(userId);
	const serviceIds = services.map((service) => service.id);

	// Langkah 2: Hapus semua gambar terkait layanan milik pengguna
	if (serviceIds.length > 0) {
		await imageModel.deleteByServiceIds(serviceIds); // Hapus gambar yang terkait dengan layanan
	}

	// Langkah 3: Hapus semua layanan milik pengguna
	await serviceModel.deleteByUserId(userId); // Hapus layanan berdasarkan user_id

	// Langkah 4: Hapus pengguna dari database
	await userModel.deleteById(userId);

	res.json({ status: 'success', message: 'Account and all related content deleted successfully' });
});
