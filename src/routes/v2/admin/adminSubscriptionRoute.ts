import express from 'express';
import { createOrUpdateSubscription, deleteSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription } from '../../../controllers/admin/subscriptionController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

router.get('/', authenticateToken, allowRoles(['admin']), getAllSubscriptions);
router.get('/:id', authenticateToken, allowRoles(['admin']), getSubscriptionById);
router.post('/', authenticateToken, allowRoles(['admin']), createOrUpdateSubscription);
router.patch('/:id', authenticateToken, allowRoles(['admin']), updateSubscription);
router.delete('/:id', authenticateToken, allowRoles(['admin']), deleteSubscription);

export default router;
