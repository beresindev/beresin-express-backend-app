import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { toggleBookmark } from '../../controllers/bookmarkController';

const router = express.Router();

// Toggle bookmark untuk service
router.post('/:serviceId', authenticateToken, toggleBookmark);

export default router;
