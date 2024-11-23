import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
	createServiceWithImages,
	deleteUserService,
	getServiceById,
	getUserServices, 
	updateUserService,
} from '../../../controllers/user/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

const detectMultipart = (req: Request, res: Response, next: NextFunction) => {
	if (req.is('multipart/form-data')) {
		return upload.array('images', 10)(req, res, next);
	}
	next();
};

// Routes
router.get('/', authenticateToken, allowRoles(['User']), getUserServices);
router.get('/:id', authenticateToken, allowRoles(['User']), getServiceById);
router.post('/', authenticateToken, allowRoles(['User']), detectMultipart, createServiceWithImages);
router.put('/:id', authenticateToken, allowRoles(['User']), detectMultipart, updateUserService);
router.delete('/:id', authenticateToken, allowRoles(['User']), deleteUserService);

export default router;
