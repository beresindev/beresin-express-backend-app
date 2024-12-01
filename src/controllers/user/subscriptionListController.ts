import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import subscriptionListModel from '../../models/subscriptionListModel';

// Get all subscription plans for users
export const getAllPlans = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
	const plans = await subscriptionListModel.findAll();
	if (plans.length === 0) {
		res.status(404).json({ status: 'error', message: 'Belum ada list subscription.' });
		return;
	}

	res.json({ status: 'success', plans });
});

// Get a single subscription plan by ID for users
export const getPlanById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	const plan = await subscriptionListModel.findById(Number(id));
	if (!plan) {
		res.status(404).json({ status: 'error', message: 'List subscription tidak ditemukan.' });
		return;
	}

	res.json({ status: 'success', plan });
});
