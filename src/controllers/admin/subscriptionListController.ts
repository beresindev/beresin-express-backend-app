import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import subscriptionListModel from '../../models/subscriptionListModel';

export const getAllPlans = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
	const plans = await subscriptionListModel.findAll();
	if (plans.length === 0) {
		res.status(404).json({ status: 'error', message: 'Belum ada list subscription.' });
		return;
	}

	res.json({ status: 'success', plans });
});

export const getPlanById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	const plan = await subscriptionListModel.findById(Number(id));
	if (!plan) {
		res.status(404).json({ status: 'error', message: 'List subscription tidak ditemukan.' });
		return;
	}

	res.json({ status: 'success', plan });
});

export const createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { boost_name, duration, price } = req.body;

	if (!boost_name || !duration || !price) {
		res.status(400).json({
			status: 'error',
			message: 'Semua data (boost_name, duration, price) harus diisi.',
		});
		return;
	}

	const newPlan = await subscriptionListModel.create({ boost_name, duration, price });

	res.status(201).json({ status: 'success', plan: newPlan });
});

export const updatePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const { boost_name, duration, price } = req.body;

	if (!boost_name || !duration || !price) {
		res.status(400).json({
			status: 'error',
			message: 'Semua data (boost_name, duration, price) harus diisi untuk pembaruan.',
		});
		return;
	}

	const updatedPlan = await subscriptionListModel.updateById(Number(id), { boost_name, duration, price });
	if (!updatedPlan) {
		res.status(404).json({ status: 'error', message: 'List subscription tidak ditemukan.' });
		return;
	}

	res.json({ status: 'success', plan: updatedPlan });
});

export const deletePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	const deletedCount = await subscriptionListModel.deleteById(Number(id));
	if (deletedCount === 0) {
		res.status(404).json({ status: 'error', message: 'List subscription tidak ditemukan.' });
		return;
	}

	res.json({ status: 'success', message: 'List subscription berhasil dihapus.' });
});
