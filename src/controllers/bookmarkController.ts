import { Request, Response } from 'express';
import asyncHandler from '../handlers/asyncHandler';
import bookmarkModel from '../models/bookmarkModel';
import serviceModel from '../models/serviceModel';

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
