import express from 'express';
import multer from 'multer';
import { createServiceWithImages, deleteUserService, getUserServices, updateUserService } from '../../../controllers/user/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// Konfigurasi multer untuk menyimpan file di folder `services/uploads/images` dan memfilter jenis file
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'services/uploads/images/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname); // Nama file unik
	},
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	// Hanya menerima file dengan tipe MIME png, jpg, atau jpeg
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true); // Tidak ada error, jadi argumen pertama adalah null
	} else {
		cb(null, false); // Tidak ada error, tapi file ditolak
	}
};

// Buat instance multer dengan storage dan filter
const upload = multer({ storage, fileFilter });

// Rute untuk membuat layanan baru dengan gambar
router.post(
	'/',
	authenticateToken,
	allowRoles(['User']),
	upload.array('images', 2), // Maksimal 2 gambar
	createServiceWithImages,
);

// Rute lain untuk melihat, memperbarui, dan menghapus layanan pengguna
router.get('/', authenticateToken, allowRoles(['User']), getUserServices);
router.put('/:id', authenticateToken, allowRoles(['User']), updateUserService);
router.delete('/:id', authenticateToken, allowRoles(['User']), deleteUserService);

export default router;
