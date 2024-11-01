import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		res.status(401).json({ message: 'Access Denied' });
		return; // stop further execution without returning any value
	}

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET!);
		(req as any).user = verified;
		next(); // call next without returning any value
	} catch (error) {
		res.status(403).json({ message: 'Invalid Token' });
	}
};
