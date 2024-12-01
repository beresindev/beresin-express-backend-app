import express from 'express';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { getUserBookmarks, toggleBookmark } from '../../../controllers/user/bookmarkController';

const router = express.Router();

router.get('/', authenticateToken, getUserBookmarks);

router.post('/:serviceId', authenticateToken, toggleBookmark);

export default router;
