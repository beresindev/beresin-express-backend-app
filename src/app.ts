import express from 'express';
import { errorHandler } from './handlers/errorHandler';
import authRoutes from './routes/v1/authRoute';
import userRoutes from './routes/v1/userRoute';

const app = express();
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Tambahkan handler untuk root URL
app.get('/', (req, res) => {
	res.send('Welcome to the API');
});

// Error handling middleware
app.use(errorHandler);

export default app;
