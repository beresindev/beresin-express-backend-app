import express from 'express';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { toggleLike } from '../../../controllers/user/likeController';

const router = express.Router();

router.post('/:serviceId', authenticateToken, toggleLike);

export default router;
