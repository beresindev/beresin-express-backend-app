import { body } from 'express-validator';

export const userValidationRules = [body('email').isEmail(), body('username').isLength({ min: 3 })];
