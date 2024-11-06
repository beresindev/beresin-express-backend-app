import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/tokenBlacklist';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		res.status(401).json({ status: 'error', message: 'Access Denied' });
		return;
	}

	if (isTokenBlacklisted(token)) {
		res.status(403).json({ status: 'error', message: 'Token has been revoked' });
		return;
	}

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET!);
		(req as any).user = verified;
		next();
	} catch (error) {
		res.status(403).json({ status: 'error', message: 'Invalid Token' });
	}
};
