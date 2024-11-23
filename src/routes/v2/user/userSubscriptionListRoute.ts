import express from 'express';
import { getAllPlans, getPlanById } from '../../../controllers/admin/subscriptionListController';
import { authenticateToken } from '../../../middlewares/authMiddleware';

const router = express.Router();

// User can view subscription plans
router.get('/', authenticateToken, getAllPlans);
router.get('/:id', authenticateToken, getPlanById);

export default router;
