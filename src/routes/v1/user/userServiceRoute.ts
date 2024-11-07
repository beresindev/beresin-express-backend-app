import express from 'express';
import multer from 'multer';
import { createServiceWithImages, deleteUserService, getUserServices, updateUserService } from '../../../controllers/user/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'services/uploads/images/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({ storage, fileFilter });

router.post('/', authenticateToken, allowRoles(['User']), upload.array('images', 2), createServiceWithImages);
router.get('/', authenticateToken, allowRoles(['User']), getUserServices);
router.put('/:id', authenticateToken, allowRoles(['User']), upload.array('images', 2), updateUserService);
router.delete('/:id', authenticateToken, allowRoles(['User']), deleteUserService);

export default router;
