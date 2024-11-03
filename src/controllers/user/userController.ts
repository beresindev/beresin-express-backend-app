import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
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
