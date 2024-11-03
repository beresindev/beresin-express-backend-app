import express from 'express';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../../../controllers/admin/categoryController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { allowRoles } from '../../../middlewares/roleMIddleware';

const router = express.Router();

// Route CRUD untuk admin saja
router.get('/', authenticateToken, allowRoles(['admin']), getAllCategory);
router.post('/', authenticateToken, allowRoles(['admin']), createCategory);
router.put('/:id', authenticateToken, allowRoles(['admin']), updateCategory);
router.delete('/:id', authenticateToken, allowRoles(['admin']), deleteCategory);

export default router;
