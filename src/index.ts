import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});