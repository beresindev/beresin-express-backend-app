// routes/v1/admin/adminServiceRoute.ts
import express from 'express';
import { deleteServiceByAdmin, getAllServices, getServiceById, updateServiceStatus } from '../../../controllers/admin/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

router.get('/', authenticateToken, allowRoles(['admin']), getAllServices);
router.get('/:id', authenticateToken, allowRoles(['admin']), getServiceById);
router.patch('/:id/status', authenticateToken, allowRoles(['admin']), updateServiceStatus); 
router.delete('/:id', authenticateToken, allowRoles(['admin']), deleteServiceByAdmin); 

export default router;
