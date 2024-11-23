import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { toggleLike } from '../../controllers/likeController';

const router = express.Router();

// Toggle like untuk service
router.post('/:serviceId', authenticateToken, toggleLike);

export default router;
