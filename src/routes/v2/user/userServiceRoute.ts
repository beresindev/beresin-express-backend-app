import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { createServiceWithImages, deleteUserService, getServiceById, getUserServices, updateUserService } from '../../../controllers/user/serviceController';
import { rateLimitForUser } from '../../../middlewares/admin/rateLimitMiddleware';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, 
});

const detectMultipart = (req: Request, res: Response, next: NextFunction) => {
	if (req.is('multipart/form-data')) {
		return upload.array('images', 10)(req, res, next);
	}
	next();
};

// Routes
router.get('/', authenticateToken, rateLimitForUser, allowRoles(['User']), getUserServices);
router.get('/:id', authenticateToken, rateLimitForUser, allowRoles(['User']), getServiceById);
router.post('/', authenticateToken, rateLimitForUser, allowRoles(['User']), detectMultipart, createServiceWithImages);
router.put('/:id', authenticateToken, rateLimitForUser, allowRoles(['User']), detectMultipart, updateUserService);
router.delete('/:id', authenticateToken, rateLimitForUser, allowRoles(['User']), deleteUserService);

export default router;
