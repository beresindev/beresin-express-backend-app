import express from 'express';
import { getAllCategory } from '../../controllers/admin/categoryController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = express.Router();

// Route untuk user dan admin
router.get('/', authenticateToken, getAllCategory);

export default router;
