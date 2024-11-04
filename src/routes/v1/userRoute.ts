import express from 'express';
import { getUserProfile } from '../../controllers/user/userController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);

export default router;
