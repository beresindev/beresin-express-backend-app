import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import userModel from '../../models/userModel';

export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
	const users = await userModel.findAll();
	res.json({ status: 'success', users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await userModel.findById(Number(id));
	if (!user) {
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	res.json({ status: 'success', user });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
	const { username, name, email, phone, password, role } = req.body;

	const existingUser = (await userModel.findByEmail(email)) || (await userModel.findByUsername(username));
	if (existingUser) {
		res.status(400).json({ status: 'error', message: 'Email or username already in use' });
		return;
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await userModel.create({
		username,
		name,
		email,
		phone,
		password: hashedPassword,
		role: role || 'User',
	});

	res.status(201).json({ status: 'success', message: 'User created successfully', user: newUser });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { username, name, email, phone, password, role } = req.body;

	const user = await userModel.findById(Number(id));
	if (!user) {
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	const updatedData: Partial<Omit<typeof user, 'password'>> & { password?: string } = {
		username,
		name,
		email,
		phone,
		role,
	};

	if (password) {
		updatedData.password = await bcrypt.hash(password, 10);
	}

	const updatedUser = await userModel.updateById(Number(id), updatedData);
	res.json({ status: 'success', message: 'User updated successfully', user: updatedUser });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await userModel.findById(Number(id));
	if (!user) {
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	const userName = user.name;

	const services = await serviceModel.findByUserId(Number(id));
	const serviceIds = services.map((service) => service.id);

	if (serviceIds.length > 0) {
		await imageModel.deleteByServiceIds(serviceIds);
	}

	await serviceModel.deleteByUserId(Number(id));

	await userModel.deleteById(Number(id));

	res.json({
		status: 'success',
		message: `User '${userName}' and related services and images deleted successfully`,
	});
});
