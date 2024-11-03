import { Request, Response } from 'express';
import userModel from '../../models/userModel';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = (req as any).user.id;
		const user = await userModel.findById(userId);
		if (!user) {
			res.status(404).json({ status: 'error', message: 'User not found' });
			return;
		}

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
	} catch (error) {
		console.error('Get user profile error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};
