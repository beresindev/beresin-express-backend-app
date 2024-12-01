import { Request, Response } from 'express';
import cron from 'node-cron';
import asyncHandler from '../../handlers/asyncHandler';
import serviceModel from '../../models/serviceModel';
import subscriptionListModel from '../../models/subscriptionListModel';
import subscriptionModel from '../../models/subscriptionModel';

// Utility function to calculate expiration date
const calculateExpiration = (updatedAt: Date, duration: number): string => {
	const expirationDate = new Date(updatedAt);
	expirationDate.setDate(expirationDate.getDate() + duration);
	return expirationDate.toISOString();
};

// Deactivate expired subscriptions using cron
const deactivateExpiredSubscriptions = async () => {
	try {
		const now = new Date();
		console.log('Running cron job at:', now);

		// Find expired subscriptions
		const expiredSubscriptions = await subscriptionModel.findExpiredSubscriptions(now);
		console.log('Expired Subscriptions Found:', expiredSubscriptions);

		for (const subscription of expiredSubscriptions) {
			console.log(`Deactivating subscription ID: ${subscription.id}`);

			// Deactivate the subscription
			await subscriptionModel.updateById(subscription.id, { is_active: false });

			console.log(`Updating service ID: ${subscription.service_id}`);
			// Update the related service's isSubscription to false
			await serviceModel.updateById(subscription.service_id, { isSubscription: false });
		}
	} catch (error) {
		console.error('Error deactivating expired subscriptions:', error);
	}
};

// Schedule the job to run daily at midnight
cron.schedule('0 0 * * *', deactivateExpiredSubscriptions); // Runs every day at midnight

// Get all subscriptions
export const getAllSubscriptions = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
	const subscriptions = await subscriptionModel.findAll();

	// Enhance subscriptions with the expired_at field
	const enhancedSubscriptions = subscriptions.map((subscription) => ({
		...subscription,
		expired_at: calculateExpiration(subscription.updated_at, subscription.duration),
	}));

	res.json({ status: 'success', subscriptions: enhancedSubscriptions });
});

// Get a single subscription by ID
export const getSubscriptionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	const subscription = await subscriptionModel.findById(Number(id));
	if (!subscription) {
		res.status(404).json({ status: 'error', message: 'Subscription not found.' });
		return;
	}

	// Add the expired_at field
	const enhancedSubscription = {
		...subscription,
		expired_at: calculateExpiration(subscription.updated_at, subscription.duration),
	};

	res.json({ status: 'success', subscription: enhancedSubscription });
});

// Create or update a subscription

export const createOrUpdateSubscription = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { service_id, plan_id } = req.body;

	// Validate required fields
	if (!service_id || !plan_id) {
		res.status(400).json({
			status: 'error',
			message: 'Semua data (service_id, plan_id) harus diisi.',
		});
		return;
	}

	// Ensure the service exists
	const service = await serviceModel.findById(service_id);
	if (!service) {
		res.status(404).json({ status: 'error', message: 'Service tidak ditemukan.' });
		return;
	}

	// Ensure the plan exists
	const plan = await subscriptionListModel.findById(plan_id);
	if (!plan) {
		res.status(404).json({ status: 'error', message: 'List subscription tidak ditemukan.' });
		return;
	}

	// Check if there's an existing subscription for the service
	const existingSubscription = await subscriptionModel.findActiveOrInactiveByServiceId(service_id);

	if (existingSubscription) {
		// Reactivate the subscription if inactive
		if (!existingSubscription.is_active) {
			const reactivatedSubscription = await subscriptionModel.updateById(existingSubscription.id, {
				is_active: true,
				duration: plan.duration,
				price: plan.price,
				boost_name: plan.boost_name,
				updated_at: new Date(),
			});

			// Ensure the related service is marked as subscribed
			await serviceModel.updateById(service_id, { isSubscription: true });

			res.status(200).json({
				status: 'success',
				message: 'Subscription reactivated successfully.',
				subscription: reactivatedSubscription,
			});
		} else {
			// Calculate remaining time for active subscriptions
			const currentTime = new Date();
			const createdAt = new Date(existingSubscription.created_at);
			const elapsedTimeInMilliseconds = currentTime.getTime() - createdAt.getTime();
			const elapsedTimeInMinutes = Math.floor(elapsedTimeInMilliseconds / (60 * 1000)); // Convert to minutes

			const remainingTime = Math.max(existingSubscription.duration - elapsedTimeInMinutes, 0); // Ensure non-negative
			const updatedDuration = remainingTime + plan.duration; // Add the new duration to the remaining time

			// Update the existing subscription
			const updatedSubscription = await subscriptionModel.updateById(existingSubscription.id, {
				duration: updatedDuration,
				price: plan.price,
				boost_name: plan.boost_name,
				updated_at: new Date(),
			});

			res.status(200).json({
				status: 'success',
				message: 'Subscription updated successfully.',
				subscription: updatedSubscription,
				details: {
					elapsedTimeInMinutes,
					remainingTime,
					updatedDuration,
				},
			});
		}
	} else {
		// Create a new subscription if none exists
		const newSubscription = await subscriptionModel.create({
			service_id,
			duration: plan.duration,
			price: plan.price,
			boost_name: plan.boost_name,
			is_active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		// Update the service's isSubscription field
		await serviceModel.updateById(service_id, { isSubscription: true });

		res.status(201).json({
			status: 'success',
			message: 'Subscription created successfully.',
			subscription: newSubscription,
		});
	}
});

// Update an existing subscription
export const updateSubscription = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params; // Subscription ID
	const updates = req.body; // Partial updates sent by the client

	// Ensure the subscription exists
	const subscription = await subscriptionModel.findById(Number(id));
	if (!subscription) {
		res.status(404).json({ status: 'error', message: 'Subscription not found.' });
		return;
	}

	// Update the subscription
	const updatedSubscription = await subscriptionModel.updateById(Number(id), updates);

	// Handle changes to `is_active` and update the `service.isSubscription` field if necessary
	if (updates.hasOwnProperty('is_active')) {
		await serviceModel.updateById(subscription.service_id, { isSubscription: updates.is_active });
	}

	res.json({
		status: 'success',
		message: 'Subscription successfully updated.',
		subscription: updatedSubscription,
	});
});

// Delete a subscription
export const deleteSubscription = asyncHandler(async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	// Check if the subscription exists
	const deletedCount = await subscriptionModel.deleteById(Number(id));
	if (deletedCount === 0) {
		res.status(404).json({ status: 'error', message: 'Subscription not found.' });
		return;
	}

	res.json({ status: 'success', message: 'Subscription successfully deleted.' });
});
