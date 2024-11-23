import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { addBookmark, getUserBookmarksWithService, removeBookmark } from '../../controllers/bookmarkController';

const router = express.Router();

// Tambahkan bookmark
router.post('/', authenticateToken, addBookmark);

// Hapus bookmark
router.delete('/', authenticateToken, removeBookmark);

// Dapatkan semua bookmark user beserta detail service
router.get('/', authenticateToken, getUserBookmarksWithService);

export default router;
