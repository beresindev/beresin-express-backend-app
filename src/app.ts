import cors from 'cors';
import express from 'express';
import path from 'path';
import { errorHandler } from './handlers/errorHandler';
// Routes untuk Admin
import adminCategoryRoute from './routes/v2/admin/adminCategoryRoute';
import adminServiceRoute from './routes/v2/admin/adminServiceRoute';
import adminSubscriptionListRoute from './routes/v2/admin/adminSubscriptionListRoute';
import adminSubscriptionRoute from './routes/v2/admin/adminSubscriptionRoute';
import adminUserRoute from './routes/v2/admin/adminUserRoute';
import authRoute from './routes/v2/authRoute';
// Routes umum
import categoryRoute from './routes/v2/categoryRoute';
import serviceRoute from './routes/v2/serviceRoute';
import statusRoute from './routes/v2/statusRoute';
import likeRoute from './routes/v2/user/userLikeRoute';
import bookmarkRoute from './routes/v2/user/userBookmarkRoute';
// Routes untuk User
import userCategoryRoute from './routes/v2/user/userCategoryRoute';
import userRoute from './routes/v2/user/userRoute';
import userServiceRoute from './routes/v2/user/userServiceRoute';
import userSubscriptionListRoute from './routes/v2/user/userSubscriptionListRoute';

// Tambahkan ini

const app = express();
app.use(express.json());

app.use(express.json({ limit: '20mb' }));

// Enable CORS with specific settings
app.use(
	cors({
		origin: 'http://localhost:3000', // Allow only localhost:3000
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
		allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
		credentials: true, // Enable credentials (cookies, authorization headers)
	}),
);

// Route status
app.use('/api', statusRoute);

// Route untuk autentikasi
app.use('/api/v2/auth', authRoute);

//Route images
app.use('/services/uploads/images', express.static(path.resolve(__dirname, '../services/uploads/images')));

// Route untuk user
app.use('/api/v2/user', userRoute); // Mengelola profil user
app.use('/api/v2/user/services', userServiceRoute); // CRUD layanan milik user
app.use('/api/v2/user/category', userCategoryRoute); // Mengelola kategori layanan untuk user
app.use('/api/v2/user/subscription-list', userSubscriptionListRoute); // Mengelola daftar langganan
app.use('/api/v2/user/likes', likeRoute); // Tambahkan rute untuk like
app.use('/api/v2/user/bookmarks', bookmarkRoute); // Tambahkan rute untuk bookmark

// Route umum yang bisa diakses semua pengguna
app.use('/api/v2/services', serviceRoute); // Melihat semua layanan yang disetujui
app.use('/api/v2/category', categoryRoute); // Menampilkan semua kategori

// Route khusus admin
app.use('/api/v2/admin/category', adminCategoryRoute); // CRUD kategori layanan oleh admin
app.use('/api/v2/admin/services', adminServiceRoute); // Manajemen layanan oleh admin
app.use('/api/v2/admin/users', adminUserRoute);
app.use('/api/v2/admin/subscription-list', adminSubscriptionListRoute);
app.use('/api/v2/admin/subscriptions', adminSubscriptionRoute); // Added Subscription Route

// Middleware penanganan error
app.use(errorHandler);

export default app;
