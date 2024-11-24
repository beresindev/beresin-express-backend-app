import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import likeModel from '../../models/likeModel';
import serviceModel from '../../models/serviceModel';

// Toggle like untuk service
export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
	const userId = (req as any).user.id;
	const { serviceId } = req.params;

	// Validasi apakah service ada dan statusnya "accept"
	const service = await serviceModel.findById(Number(serviceId));
	if (!service || service.status !== 'accept') {
		res.status(400).json({ status: 'error', message: 'Service tidak ditemukan atau belum disetujui (accept).' });
		return;
	}

	// Periksa apakah user sudah memberikan like sebelumnya
	const existingLike = await likeModel.find(userId, Number(serviceId));

	if (existingLike) {
		// Jika sudah di-like, hapus like
		await likeModel.delete(userId, Number(serviceId));
		await serviceModel.updateLikeCount(Number(serviceId), false); // Kurangi 1 dari like_count
		res.status(200).json({ status: 'success', message: 'Like berhasil dihapus.' });
	} else {
		// Jika belum di-like, tambahkan like
		await likeModel.create(userId, Number(serviceId));
		await serviceModel.updateLikeCount(Number(serviceId), true); // Tambahkan 1 ke like_count
		res.status(201).json({ status: 'success', message: 'Like berhasil ditambahkan.' });
	}
});
