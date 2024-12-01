import express from 'express';
import { createPlan, deletePlan, getAllPlans, getPlanById, updatePlan } from '../../../controllers/admin/subscriptionListController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

router.get('/', authenticateToken, allowRoles(['admin']), getAllPlans);
router.get('/:id', authenticateToken, allowRoles(['admin']), getPlanById);
router.post('/', authenticateToken, allowRoles(['admin']), createPlan);
router.put('/:id', authenticateToken, allowRoles(['admin']), updatePlan);
router.delete('/:id', authenticateToken, allowRoles(['admin']), deletePlan);

export default router;
