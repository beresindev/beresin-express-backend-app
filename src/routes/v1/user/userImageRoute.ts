// import express from 'express';
// import multer from 'multer';
// import { uploadImage } from '../../../controllers/imageController';
// import { authenticateToken } from '../../../middlewares/authMiddleware';

// // Konfigurasi multer untuk menyimpan file di folder `services/uploads/images` dan memfilter jenis file
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'services/uploads/images/');
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + '-' + file.originalname); // Nama file unik
// 	},
// });

// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
// 	// Hanya menerima file dengan tipe MIME png, jpg, atau jpeg
// 	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
// 		cb(null, true); // Tidak ada error, jadi argumen pertama adalah null
// 	} else {
// 		cb(null, false); // Tidak ada error, tapi file ditolak
// 	}
// };

// // Buat instance multer dengan storage dan filter
// const upload = multer({ storage, fileFilter });

// const router = express.Router();

// // Route untuk upload gambar (maksimal 2 gambar per service)
// router.post('/uploadImage', authenticateToken, upload.array('image', 2), uploadImage);

// export default router;
