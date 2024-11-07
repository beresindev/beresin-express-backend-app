import express from 'express';
import { deleteAccount, getUserProfile } from '../../../controllers/user/userController';
import { authenticateToken } from '../../../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.delete('/deleteAccount', authenticateToken, deleteAccount);

export default router;
