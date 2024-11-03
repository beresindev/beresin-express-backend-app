import express from 'express';
import { getAllApprovedServices } from '../../controllers/serviceController';

const router = express.Router();

// Rute untuk mengambil semua layanan yang disetujui
router.get('/all', getAllApprovedServices);

export default router;
