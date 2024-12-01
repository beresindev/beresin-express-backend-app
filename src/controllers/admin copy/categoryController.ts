import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import categoryModel from '../../models/categoryModel';

// Create Category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
	const { name_of_category } = req.body;
	console.log(`Creating category: ${name_of_category}`);

	const newCategory = await categoryModel.create({ name_of_category });
	res.status(201).json({ status: 'success', category: newCategory });
});

// Get All Categories
export const getAllCategory = asyncHandler(async (_req: Request, res: Response) => {
	console.log('Fetching all categories');

	const categories = await categoryModel.findAll();
	console.log(`Categories found: ${categories.length}`);

	res.status(200).json({ status: 'success', categories });
});

// Update Category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name_of_category } = req.body;
	console.log(`Updating category ${id} with name: ${name_of_category}`);

	const updatedCategory = await categoryModel.updateById(Number(id), { name_of_category });
	if (!updatedCategory) {
		console.log(`Category ${id} not found`);
		res.status(404).json({ status: 'error', message: 'Category not found' });
		return;
	}

	res.json({ status: 'success', category: updatedCategory });
});

// Delete Category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	console.log(`Deleting category with ID: ${id}`);

	const deleted = await categoryModel.deleteById(Number(id));
	if (!deleted) {
		console.log(`Category ${id} not found`);
		res.status(404).json({ status: 'error', message: 'Category not found' });
		return;
	}

	res.json({ status: 'success', message: 'Category deleted successfully' });
});
