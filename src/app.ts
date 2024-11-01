import express from 'express';
import routes from '@routes/v1/userRoute';

const app = express();
app.use(express.json());
app.use('/api/v1', routes);

export default app;
