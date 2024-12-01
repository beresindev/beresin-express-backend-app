import express from 'express';
import { getAllCategory } from '../../../controllers/admin/categoryController';
import { rateLimitForUser } from '../../../middlewares/admin/rateLimitMiddleware';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// Route untuk user dan admin
router.get('/', authenticateToken, rateLimitForUser, allowRoles(['User']), getAllCategory);

export default router;
