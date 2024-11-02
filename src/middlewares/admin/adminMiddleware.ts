import { NextFunction, Request, Response } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
	const user = (req as any).user;

	if (user && user.role === 'admin') {
		next();
	} else {
		res.status(403).json({ status: 'error', message: 'Access denied, admin only' });
	}
};
