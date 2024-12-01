import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../../../controllers/admin/userController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

router.get('/', authenticateToken, allowRoles(['admin']), getAllUsers);
router.get('/:id', authenticateToken, allowRoles(['admin']), getUserById);
router.post('/', authenticateToken, allowRoles(['admin']), createUser);
router.put('/:id', authenticateToken, allowRoles(['admin']), updateUser);
router.delete('/:id', authenticateToken, allowRoles(['admin']), deleteUser);

export default router;
