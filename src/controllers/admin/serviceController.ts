import { Request, Response } from 'express';
import serviceModel from '../../models/serviceModel';

export const updateServiceStatus = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const { status } = req.body;

	if (!['accept', 'decline', 'pending'].includes(status)) {
		res.status(400).json({ status: 'error', message: 'Status tidak valid' });
		return;
	}

	try {
		const updatedService = await serviceModel.updateStatus(Number(id), status);
		if (!updatedService) {
			res.status(404).json({ status: 'error', message: 'Service tidak ditemukan' });
			return;
		}
		res.json({ status: 'success', service: updatedService });
	} catch (error) {
		console.error('Update Service Status error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
	try {
		const services = await serviceModel.findAll();
		res.json({ status: 'success', services });
	} catch (error) {
		console.error('Get All Services error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

export const deleteServiceByAdmin = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		const deleted = await serviceModel.deleteById(Number(id));
		if (!deleted) {
			res.status(404).json({ status: 'error', message: 'Service tidak ditemukan' });
			return;
		}
		res.json({ status: 'success', message: 'Layanan berhasil dihapus oleh admin' });
	} catch (error) {
		console.error('Delete Service by Admin error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};