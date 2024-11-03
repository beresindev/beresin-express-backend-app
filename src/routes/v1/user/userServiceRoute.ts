// routes/v1/user/serviceRoute.ts
import express from 'express';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { createService, getUserServices, updateUserService, deleteUserService } from '../../../controllers/user/serviceController';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// User hanya bisa melihat, membuat, mengedit, dan menghapus layanan milik mereka sendiri
router.get('/', authenticateToken, allowRoles(['User']), getUserServices); // Melihat layanan milik user
router.post('/', authenticateToken, allowRoles(['User']), createService); // Membuat layanan baru
router.put('/:id', authenticateToken, allowRoles(['User']), updateUserService); // Mengedit layanan
router.delete('/:id', authenticateToken, allowRoles(['User']), deleteUserService); // Menghapus layanan

export default router;
