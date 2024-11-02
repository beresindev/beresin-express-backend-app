import express from 'express';
import { errorHandler } from './handlers/errorHandler';
import authRoute from './routes/v1/authRoute';
import userRoute from './routes/v1/userRoute';

// Routes untuk User
import userServiceRoute from './routes/v1/user/userServiceRoute';
import userCategoryRoute from './routes/v1/user/userCategoryRoute';

// Routes untuk Admin
import adminCategoryRoute from './routes/v1/admin/adminCategoryRoute';
import adminServiceRoute from './routes/v1/admin/adminServiceRoute';

// Routes umum
import categoryRoute from './routes/v1/categoryRoute';
import imageRoute from './routes/v1/user/userImageRoute';
import serviceRoute from './routes/v1/serviceRoute';

const app = express();
app.use(express.json());

// Route untuk autentikasi
app.use('/api/v1/auth', authRoute);

// Route untuk user
app.use('/api/v1/user', userRoute);                 // Mengelola profil user
app.use('/api/v1/user/services', userServiceRoute); // CRUD layanan milik user
app.use('/api/v1/user/category', userCategoryRoute); // Mengelola kategori layanan untuk user
app.use('/api/v1/user/image', imageRoute);                // Mengelola upload gambar

// Route umum yang bisa diakses semua pengguna
app.use('/api/v1/services', serviceRoute); // Melihat semua layanan yang disetujui
app.use('/api/v1/category', categoryRoute);          // Menampilkan semua kategori

// Route khusus admin
app.use('/api/v1/admin/category', adminCategoryRoute); // CRUD kategori layanan oleh admin
app.use('/api/v1/admin/services', adminServiceRoute);   // Manajemen layanan oleh admin

// Middleware penanganan error
app.use(errorHandler);

export default app;
