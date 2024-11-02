import { Request, Response } from 'express';
import serviceModel from '../../models/serviceModel';

export const createService = async (req: Request, res: Response): Promise<void> => {
	const { name_of_service, category_id, description, isSubscription } = req.body;
	const userId = (req as any).user.id;

	try {
		const newService = await serviceModel.create({
			user_id: userId,
			name_of_service,
			category_id,
			description,
			isSubscription,
			status: 'pending',
		});

		res.status(201).json({ status: 'success', service: newService });
	} catch (error) {
		console.error('Create Service error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

export const getUserServices = async (req: Request, res: Response): Promise<void> => {
	const userId = (req as any).user.id;

	try {
		const services = await serviceModel.findByUserId(userId);
		res.json({ status: 'success', services });
	} catch (error) {
		console.error('Get User Services error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

export const updateUserService = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const { name_of_service, category_id, description, isSubscription } = req.body;
	const userId = (req as any).user.id;

	try {
		const service = await serviceModel.findById(Number(id));
		if (!service || service.user_id !== userId) {
			res.status(403).json({ status: 'error', message: 'Tidak diizinkan untuk mengedit layanan ini' });
			return;
		}

		const updatedService = await serviceModel.updateById(Number(id), {
			name_of_service,
			category_id,
			description,
			isSubscription,
		});
		res.json({ status: 'success', service: updatedService });
	} catch (error) {
		console.error('Update Service error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

// Delete Service untuk User
export const deleteUserService = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const userId = (req as any).user.id;

	try {
		const service = await serviceModel.findById(Number(id));
		if (!service || service.user_id !== userId) {
			res.status(403).json({ status: 'error', message: 'Tidak diizinkan untuk menghapus layanan ini' });
			return;
		}

		await serviceModel.deleteById(Number(id));
		res.json({ status: 'success', message: 'Layanan berhasil dihapus' });
	} catch (error) {
		console.error('Delete Service error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};