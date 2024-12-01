import cors from 'cors';
import express from 'express';
import path from 'path';
import { errorHandler } from './handlers/errorHandler';

import adminCategoryRoute from './routes/v2/admin/adminCategoryRoute';
import adminServiceRoute from './routes/v2/admin/adminServiceRoute';
import adminSubscriptionListRoute from './routes/v2/admin/adminSubscriptionListRoute';
import adminSubscriptionRoute from './routes/v2/admin/adminSubscriptionRoute';
import adminUserRoute from './routes/v2/admin/adminUserRoute';
import authRoute from './routes/v2/authRoute';

import categoryRoute from './routes/v2/categoryRoute';
import serviceRoute from './routes/v2/serviceRoute';
import statusRoute from './routes/v2/statusRoute';
import likeRoute from './routes/v2/user/userLikeRoute';
import bookmarkRoute from './routes/v2/user/userBookmarkRoute';

import userCategoryRoute from './routes/v2/user/userCategoryRoute';
import userRoute from './routes/v2/user/userRoute';
import userServiceRoute from './routes/v2/user/userServiceRoute';
import userSubscriptionListRoute from './routes/v2/user/userSubscriptionListRoute';

const app = express();
app.use(express.json());

app.use(express.json({ limit: '20mb' }));

app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'https://dashboard.beresin.bforbilly.tech',
			'https://beresin.bforbilly.tech',
		],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);

app.use('/api', statusRoute);

app.use('/api/v2/auth', authRoute);

app.use('/services/uploads/images', express.static(path.resolve(__dirname, '../services/uploads/images')));

app.use('/api/v2/user', userRoute);
app.use('/api/v2/user/services', userServiceRoute);
app.use('/api/v2/user/category', userCategoryRoute);
app.use('/api/v2/user/subscription-list', userSubscriptionListRoute);
app.use('/api/v2/user/likes', likeRoute);
app.use('/api/v2/user/bookmarks', bookmarkRoute);

app.use('/api/v2/services', serviceRoute);
app.use('/api/v2/category', categoryRoute);

app.use('/api/v2/admin/category', adminCategoryRoute);
app.use('/api/v2/admin/services', adminServiceRoute);
app.use('/api/v2/admin/users', adminUserRoute);
app.use('/api/v2/admin/subscription-list', adminSubscriptionListRoute);
app.use('/api/v2/admin/subscriptions', adminSubscriptionRoute);

app.use(errorHandler);

export default app;
