// controllers/serviceController.ts
import { Request, Response } from 'express';
import serviceModel from '../models/serviceModel';

export const getAllApprovedServices = async (_req: Request, res: Response): Promise<void> => {
	try {
		// Memanggil model untuk mengambil semua layanan yang disetujui
		const services = await serviceModel.findAllApproved();
		res.status(200).json({ status: 'success', services });
	} catch (error) {
		console.error('Get All Approved Services error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};
