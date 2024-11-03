import { NextFunction, Request, Response } from 'express';

export const allowRoles = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const user = (req as any).user;

		if (!user || !roles.includes(user.role)) {
			res.status(403).json({ status: 'error', message: 'Access denied' });
			return;
		}

		next();
	};
};
