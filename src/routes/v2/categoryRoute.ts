import express from 'express';
import { getAllCategory } from '../../controllers/admin/categoryController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getAllCategory);

export default router;
