// routes/v1/admin/adminServiceRoute.ts
import express from 'express';
import { deleteServiceByAdmin, getAllServices, getServiceById, updateServiceStatus } from '../../../controllers/admin/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// Admin dapat melihat semua layanan dan mengubah status layanan
router.get('/', authenticateToken, allowRoles(['admin']), getAllServices);
router.get('/:id', authenticateToken, allowRoles(['admin']), getServiceById); // Fetch a single service by ID
router.patch('/:id/status', authenticateToken, allowRoles(['admin']), updateServiceStatus); // Mengubah status layanan
router.delete('/:id', authenticateToken, allowRoles(['admin']), deleteServiceByAdmin); // Menghapus layanan

export default router;
