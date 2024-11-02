import { Request, Response } from 'express';
import categoryModel from '../../models/categoryModel';

// Create Category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
	const { name_of_category } = req.body;

	try {
		const newCategory = await categoryModel.create({ name_of_category });
		res.status(201).json({ status: 'success', category: newCategory });
	} catch (error) {
		console.error('Create Category error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

// Get All Category
export const getAllCategory = async (_req: Request, res: Response): Promise<void> => {
	try {
		console.log('getAllCategory: Mengambil kategori...'); // Debug log
		const category = await categoryModel.findAll();
		console.log('getAllCategory: Kategori ditemukan', category); // Debug log
		res.status(200).json({ status: 'success', category });
	} catch (error) {
		console.error('Get Category error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

// Update Category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	const { name_of_category } = req.body;

	try {
		const updatedCategory = await categoryModel.updateById(Number(id), { name_of_category });
		if (!updatedCategory) {
			res.status(404).json({ status: 'error', message: 'Category not found' });
			return;
		}
		res.json({ status: 'success', category: updatedCategory });
	} catch (error) {
		console.error('Update Category error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		const deleted = await categoryModel.deleteById(Number(id));
		if (!deleted) {
			res.status(404).json({ status: 'error', message: 'Category not found' });
			return;
		}
		res.json({ status: 'success', message: 'Category deleted successfully' });
	} catch (error) {
		console.error('Delete Category error:', error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
};
