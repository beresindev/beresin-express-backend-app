import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { createServiceWithImages, deleteUserService, getUserServices, updateUserService } from '../../../controllers/user/serviceController';
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

// Rute untuk membuat layanan baru tanpa kolom `isSubscription`
router.post('/', authenticateToken, allowRoles(['User']), upload.array('images', 2), createServiceWithImages);

// Rute untuk mendapatkan semua layanan milik pengguna
router.get('/', authenticateToken, allowRoles(['User']), getUserServices);

// Rute PUT untuk memperbarui layanan tanpa `isSubscription`
router.put('/:id', authenticateToken, allowRoles(['User']), upload.array('images', 2), updateUserService);

// Rute DELETE untuk menghapus layanan
router.delete('/:id', authenticateToken, allowRoles(['User']), deleteUserService);

export default router;
