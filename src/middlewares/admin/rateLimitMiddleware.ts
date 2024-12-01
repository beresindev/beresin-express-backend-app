import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, 
	message: 'Terlalu banyak permintaan, coba lagi setelah 15 menit.',
	standardHeaders: true, 
	legacyHeaders: false,  
});

export const rateLimitForUser = (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;

	if (user && user.role === 'User') {
		return apiLimiter(req, res, next);
	}

	next();
};
