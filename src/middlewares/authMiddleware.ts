import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
	user?: string | JwtPayload;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		res.sendStatus(401);
		return;
	}

	jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
		if (err) {
			res.sendStatus(403);
			return;
		}
		req.user = user;
		next();
	});
};
