import express from 'express';
import { getUser } from '@controllers/userController';
import { authenticateToken } from '@middlewares/authMiddleware';

const router = express.Router();

router.get('/user/:id', authenticateToken, getUser);

export default router;
