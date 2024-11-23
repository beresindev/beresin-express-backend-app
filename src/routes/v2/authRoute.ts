import express from 'express';
import { login, logout, register } from '../../controllers/authController';
import asyncHandler from '../../handlers/asyncHandler';
import { runValidation, validateRegister } from '../../middlewares/validationMiddleware';

const router = express.Router();

router.post('/register', validateRegister, runValidation, asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));

export default router;
