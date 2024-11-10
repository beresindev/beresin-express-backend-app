import express from 'express';
import { getAllApprovedServices } from '../../controllers/serviceController';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/all', authenticateToken, getAllApprovedServices);

export default router;
