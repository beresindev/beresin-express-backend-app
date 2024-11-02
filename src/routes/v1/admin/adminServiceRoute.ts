// routes/v1/admin/adminServiceRoute.ts
import express from 'express';
import { getAllServices, updateServiceStatus, deleteServiceByAdmin } from '../../../controllers/admin/serviceController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// Admin dapat melihat semua layanan dan mengubah status layanan
router.get('/', authenticateToken, allowRoles(['admin']), getAllServices);
router.patch('/:id/status', authenticateToken, allowRoles(['admin']), updateServiceStatus); // Mengubah status layanan
router.delete('/:id', authenticateToken, allowRoles(['admin']), deleteServiceByAdmin); // Menghapus layanan

export default router;