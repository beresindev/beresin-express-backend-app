import express from 'express';
import { getUserProfile } from '../../controllers/user/userController';
import asyncHandler from '../../handlers/asyncHandler';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, asyncHandler(getUserProfile));

export default router;
