import { NextFunction, Request, Response } from 'express';
import { ValidationChain, check, validationResult } from 'express-validator';

export const validateRegister: ValidationChain[] = [
	check('username').notEmpty().withMessage('Username is required'),
	check('name').notEmpty().withMessage('Name is required'),
	check('email').isEmail().withMessage('Please provide a valid email'),
	check('phone').isInt().withMessage('Phone must be a number'),
	check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const runValidation = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() });
		return;
	}
	next();
};
