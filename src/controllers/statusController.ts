import { Request, Response } from 'express';
import db from '../configs/knexConfig';
import asyncHandler from '../handlers/asyncHandler';

export const getStatus = asyncHandler(async (_req: Request, res: Response) => {
	console.log('Checking database connection status');

	let dbReady = false;
	let dbSize = 'unknown';
	let dbLatency = 'unknown';

	try {
		const start = Date.now();
		await db.raw('SELECT 1+1 AS result');
		const latency = Date.now() - start;

		dbReady = true;
		dbLatency = `${latency} ms`;

		const sizeQuery = await db.raw(`SELECT pg_size_pretty(pg_database_size(current_database())) AS size`);
		dbSize = sizeQuery.rows[0].size;

		console.log('Database connected successfully');
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Database connection error:', errorMessage);
	}

	res.status(dbReady ? 200 : 500).json({
		status: dbReady ? 'success' : 'error',
		message: dbReady ? 'Database connected successfully' : 'Database connection failed',
		database: {
			ready: dbReady,
			size: dbSize,
			latency: dbLatency,
		},
	});
});
