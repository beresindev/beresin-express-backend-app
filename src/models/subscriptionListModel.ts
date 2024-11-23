import db from '../configs/knexConfig';

interface SubscriptionPlan {
	id: number;
	boost_name: string;
	duration: number;
	price: number;
	created_at?: Date;
	updated_at?: Date;
}

const subscriptionListModel = {
    findAll: async (): Promise<SubscriptionPlan[]> => {
        return db<SubscriptionPlan>("subscription_list").select("*").orderBy("id", "asc");
    },

	findById: async (id: number): Promise<SubscriptionPlan | undefined> => {
		return db<SubscriptionPlan>('subscription_list').where({ id }).first();
	},

	create: async (planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
		const [newPlan] = await db<SubscriptionPlan>('subscription_list').insert(planData).returning('*');
		return newPlan;
	},

	updateById: async (id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined> => {
		const [updatedPlan] = await db<SubscriptionPlan>('subscription_list').where({ id }).update(updates).returning('*');
		return updatedPlan;
	},

	deleteById: async (id: number): Promise<number> => {
		return db<SubscriptionPlan>('subscription_list').where({ id }).del();
	},
};

export default subscriptionListModel;
