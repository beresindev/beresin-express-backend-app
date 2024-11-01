import User from '@models/userModel';
import { Request, Response } from 'express';

export const getUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = parseInt(req.params.id, 10);
		const user = await User.findById(userId);
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};
