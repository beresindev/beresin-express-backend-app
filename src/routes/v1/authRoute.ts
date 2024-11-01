import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};
