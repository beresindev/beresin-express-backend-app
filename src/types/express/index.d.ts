import { JwtPayload } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload | string; // Sesuaikan sesuai tipe user
		}
	}
}
