import express from 'express';
import { getAllPlans, getPlanById } from '../../../controllers/admin/subscriptionListController';
import { rateLimitForUser } from '../../../middlewares/admin/rateLimitMiddleware';
import { authenticateToken } from '../../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, rateLimitForUser, getAllPlans);
router.get('/:id', authenticateToken, rateLimitForUser, getPlanById);

export default router;
