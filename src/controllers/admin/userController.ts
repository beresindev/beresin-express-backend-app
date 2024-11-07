import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';
import userModel from '../../models/userModel';

// Mendapatkan daftar semua pengguna
export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
	const users = await userModel.findAll();
	res.json({ status: 'success', users });
});

// Menambahkan pengguna baru
export const createUser = asyncHandler(async (req: Request, res: Response) => {
	const { username, name, email, phone, password, role } = req.body;

	// Periksa apakah email atau username sudah ada
	const existingUser = (await userModel.findByEmail(email)) || (await userModel.findByUsername(username));
	if (existingUser) {
		res.status(400).json({ status: 'error', message: 'Email or username already in use' });
		return;
	}

	// Enkripsi password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Buat pengguna baru
	const newUser = await userModel.create({
		username,
		name,
		email,
		phone,
		password: hashedPassword,
		role: role || 'User', // Default role adalah 'User'
	});

	res.status(201).json({ status: 'success', message: 'User created successfully', user: newUser });
});

// Memperbarui data pengguna berdasarkan ID
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { username, name, email, phone, password, role } = req.body;

	// Periksa apakah pengguna ada
	const user = await userModel.findById(Number(id));
	if (!user) {
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	// Siapkan data yang akan diperbarui
	const updatedData: Partial<Omit<typeof user, 'password'>> & { password?: string } = {
		username,
		name,
		email,
		phone,
		role,
	};

	// Enkripsi password jika ada
	if (password) {
		updatedData.password = await bcrypt.hash(password, 10);
	}

	const updatedUser = await userModel.updateById(Number(id), updatedData);
	res.json({ status: 'success', message: 'User updated successfully', user: updatedUser });
});

// Menghapus pengguna berdasarkan ID
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	// Periksa apakah pengguna ada
	const user = await userModel.findById(Number(id));
	if (!user) {
		res.status(404).json({ status: 'error', message: 'User not found' });
		return;
	}

	// Simpan nama pengguna untuk ditampilkan dalam respons setelah penghapusan
	const userName = user.name;

	// Langkah 1: Temukan semua layanan pengguna
	const services = await serviceModel.findByUserId(Number(id));
	const serviceIds = services.map((service) => service.id);

	// Langkah 2: Hapus semua gambar terkait layanan pengguna
	if (serviceIds.length > 0) {
		await imageModel.deleteByServiceIds(serviceIds); // Hapus semua gambar terkait layanan
	}

	// Langkah 3: Hapus semua layanan pengguna
	await serviceModel.deleteByUserId(Number(id)); // Hapus layanan berdasarkan user_id

	// Langkah 4: Hapus pengguna
	await userModel.deleteById(Number(id));

	res.json({
		status: 'success',
		message: `User '${userName}' and related services and images deleted successfully`,
	});
});
