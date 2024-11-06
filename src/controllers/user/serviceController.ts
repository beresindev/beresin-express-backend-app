import { Request, Response } from 'express';
import asyncHandler from '../../handlers/asyncHandler';
import imageModel from '../../models/imageModel';
import serviceModel from '../../models/serviceModel';

export const getUserServices = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    console.log(`Fetching services for user ${userId}`);

    // Ambil semua layanan milik user
    const services = await serviceModel.findByUserId(userId);

    // Ambil semua ID layanan untuk pencarian gambar
    const serviceIds = services.map((service) => service.id);

    // Ambil semua gambar yang terkait dengan layanan
    const images = await imageModel.findByServiceIds(serviceIds);

    // Gabungkan gambar dengan layanan berdasarkan service_id
    const servicesWithImages = services.map((service) => ({
        ...service,
        images: images.filter((image) => image.service_id === service.id).map((img) => img.image),
    }));

    res.json({ status: 'success', services: servicesWithImages });
});

// Membuat layanan baru dengan gambar
export const createServiceWithImages = asyncHandler(async (req: Request, res: Response) => {
    const { name_of_service, category_id, description } = req.body;
    const userId = (req as any).user.id;

    if (!category_id) {
        res.status(400).json({ status: 'error', message: 'category_id is required' });
        return;
    }

    const newService = await serviceModel.create({
        user_id: userId,
        name_of_service,
        category_id: Number(category_id),
        description,
        status: 'pending',
    });

    const uploadedImages = req.files as Express.Multer.File[];
    const imagePaths = uploadedImages.map((file) => ({ image: file.path, service_id: newService.id }));
    const newImages = [];
    for (const imageData of imagePaths) {
        const newImage = await imageModel.create(imageData);
        newImages.push(newImage);
    }

    res.status(201).json({ status: 'success', service: newService, images: newImages });
});

// Mengupdate layanan
export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name_of_service, category_id, description } = req.body;
    const userId = (req as any).user.id;

    const service = await serviceModel.findById(Number(id));
    if (!service || service.user_id !== userId) {
        res.status(403).json({ status: 'error', message: 'Unauthorized to edit this service' });
        return;
    }

    const updatedService = await serviceModel.updateById(Number(id), {
        name_of_service,
        category_id: Number(category_id),
        description,
    });

    if (!updatedService) {
        res.status(500).json({ status: 'error', message: 'Failed to update service' });
        return;
    }

    const serviceResponse = { ...updatedService, images: [] as string[] };
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        await imageModel.deleteByServiceId(service.id);

        const uploadedImages = req.files as Express.Multer.File[];
        const imagePaths = uploadedImages.map((file) => ({ image: file.path, service_id: service.id }));
        const newImages = [];
        for (const imageData of imagePaths) {
            const newImage = await imageModel.create(imageData);
            newImages.push(newImage);
        }
        serviceResponse.images = newImages.map((img) => img.image);
    } else {
        const existingImages = await imageModel.findByServiceId(service.id);
        serviceResponse.images = existingImages.map((img) => img.image);
    }

    res.json({ status: 'success', service: serviceResponse });
});


export const deleteUserService = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Verifikasi bahwa layanan tersebut adalah milik pengguna
    const service = await serviceModel.findById(Number(id));
    if (!service || service.user_id !== userId) {
        res.status(403).json({ status: 'error', message: 'Unauthorized to delete this service' });
        return;
    }

    // Hapus gambar terkait sebelum menghapus layanan
    await imageModel.deleteByServiceId(service.id);

    // Hapus layanan
    await serviceModel.deleteById(Number(id));
    res.json({ status: 'success', message: 'Service deleted successfully' });
});