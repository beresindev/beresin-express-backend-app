import express from 'express';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { getUserBookmarks, toggleBookmark } from '../../../controllers/user/bookmarkController';

const router = express.Router();

// Route untuk mendapatkan semua bookmarks milik user
router.get('/', authenticateToken, getUserBookmarks);

// Toggle bookmark untuk service
router.post('/:serviceId', authenticateToken, toggleBookmark);

export default router;
