import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { createServiceWithImages, deleteUserService, getUserServices, updateUserService } from '../../../controllers/user/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// Configure multer only for multipart/form-data requests
const storage = multer.memoryStorage(); // Using memory storage to handle both types
const upload = multer({ storage });

const detectMultipart = (req: Request, res: Response, next: NextFunction) => {
	if (req.is('multipart/form-data')) {
		return upload.array('images', 2)(req, res, next); // Use multer for multipart requests
	}
	next(); // Continue without multer if it's not multipart
};

// Routes setup
router.post('/', authenticateToken, allowRoles(['User']), detectMultipart, createServiceWithImages);
router.get('/', authenticateToken, allowRoles(['User']), getUserServices);
router.put('/:id', authenticateToken, allowRoles(['User']), detectMultipart, updateUserService);
router.delete('/:id', authenticateToken, allowRoles(['User']), deleteUserService);

export default router;
