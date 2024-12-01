import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import userModel from '../models/userModel';
import { generateToken } from '../utils/jwt';
import { addToBlacklist } from '../utils/tokenBlacklist';

export const register = async (req: Request, res: Response): Promise<void> => {
	let { username, name, email, phone, password } = req.body;

	try {
		username = username.replace(/\s+/g, '');

		if (/\s/.test(req.body.username)) {
			res.status(400).json({ status: 'error', message: 'Username cannot contain spaces' });
			return;
		}

		let normalizedPhone = phone;
		if (phone.startsWith('0')) {
			normalizedPhone = '62' + phone.slice(1);
		}

		if (normalizedPhone.length < 11 || normalizedPhone.length > 13) {
			res.status(400).json({ status: 'error', message: 'Phone number must be 11-13 characters' });
			return;
		}

		const existingUser = (await userModel.findByEmail(email)) || (await userModel.findByUsername(username)) || (await userModel.findByPhone(normalizedPhone));

		if (existingUser) {
			res.status(400).json({ status: 'error', message: 'Email, username, or phone already in use' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await userModel.create({
			username,
			name,
			email,
			phone: normalizedPhone,
			password: hashedPassword,
			role: 'User',
		});

		const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

		res.status(201).json({
			status: 'success',
			message: 'User registered successfully',
			token,
			user: {
				id: newUser.id,
				username: newUser.username,
				name: newUser.name,
				email: newUser.email,
				phone: newUser.phone,
				role: newUser.role,
				created_at: newUser.created_at,
				updated_at: newUser.updated_at,
			},
		});
	} catch (error) {
		console.error('Register error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		const user = await userModel.findByEmail(email);
		if (!user) {
			res.status(400).json({ status: 'error', message: 'Invalid email or password' });
			return;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(400).json({ status: 'error', message: 'Invalid email or password' });
			return;
		}

		const token = generateToken({ id: user.id, email: user.email, role: user.role });

		res.json({
			status: 'success',
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				name: user.name,
				phone: user.phone,
				role: user.role,
				created_at: user.created_at,
				updated_at: user.updated_at,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

export const logout = async (req: Request, res: Response): Promise<void> => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (token) {
		addToBlacklist(token);
	}
	res.json({
		status: 'success',
		message: 'Logout successful',
	});
};
