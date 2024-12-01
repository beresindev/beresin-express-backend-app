import db from '../configs/knexConfig';

interface Subscription {
	id: number;
	service_id: number;
	duration: number; 
	price: number;
	boost_name: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	expired_at?: string; 
}

const calculateExpiration = (updatedAt: Date, duration: number): string => {
	const expirationDate = new Date(updatedAt);
	expirationDate.setDate(expirationDate.getDate() + duration);
	return expirationDate.toISOString();
};

const subscriptionModel = {
	findExpiredSubscriptions: async (now: Date): Promise<Subscription[]> => {
		const subscriptions = await db<Subscription>('subscriptions').where('is_active', true).andWhereRaw(`"updated_at" + interval '1 day' * "duration" <= ?`, [now]);

		return subscriptions.map((subscription) => ({
			...subscription,
			expired_at: calculateExpiration(subscription.updated_at, subscription.duration),
		}));
	},

	findActiveOrInactiveByServiceId: async (serviceId: number): Promise<Subscription | undefined> => {
		const subscription = await db<Subscription>('subscriptions').where({ service_id: serviceId }).first();

		if (subscription) {
			subscription.expired_at = calculateExpiration(subscription.updated_at, subscription.duration);
		}

		return subscription;
	},

	create: async (subscriptionData: Partial<Subscription>): Promise<Subscription> => {
		const [newSubscription] = await db<Subscription>('subscriptions').insert(subscriptionData).returning('*');

		newSubscription.expired_at = calculateExpiration(newSubscription.updated_at, newSubscription.duration);

		return newSubscription;
	},

	findAll: async (): Promise<Subscription[]> => {
		const subscriptions = await db<Subscription>('subscriptions').select('*').orderBy('id', 'asc');

		// Add expired_at to each subscription
		return subscriptions.map((subscription) => ({
			...subscription,
			expired_at: calculateExpiration(subscription.updated_at, subscription.duration),
		}));
	},

	findById: async (id: number): Promise<Subscription | undefined> => {
		const subscription = await db<Subscription>('subscriptions').where({ id }).first();

		if (subscription) {
			subscription.expired_at = calculateExpiration(subscription.updated_at, subscription.duration);
		}

		return subscription;
	},

	findActiveByServiceId: async (serviceId: number): Promise<Subscription | undefined> => {
		const subscription = await db<Subscription>('subscriptions').where({ service_id: serviceId, is_active: true }).first();

		if (subscription) {
			subscription.expired_at = calculateExpiration(subscription.updated_at, subscription.duration);
		}

		return subscription;
	},

	updateById: async (id: number, updates: Partial<Subscription>): Promise<Subscription | undefined> => {
		const [updatedSubscription] = await db<Subscription>('subscriptions').where({ id }).update(updates).returning('*');

		if (updatedSubscription) {
			updatedSubscription.expired_at = calculateExpiration(updatedSubscription.updated_at, updatedSubscription.duration);
		}

		return updatedSubscription;
	},

	deleteById: async (id: number): Promise<number> => {
		return db<Subscription>('subscriptions').where({ id }).del();
	},
};

export default subscriptionModel;
