import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { getUserProfile } from '../../controllers/user/userController';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);

export default router;
