/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class SubscriptionService {
    async getSubscriptionPlans() {
        return axiosClient.get('/subscription-plan');
    }

    async getSubscriptionPlanById(subscriptionPlanId: string) {
        return axiosClient.get(`/subscription-plan/${subscriptionPlanId}`);
    }

    async createSubscriptionPlan(data: Record<string, any>) {
        return axiosClient.post('/subscription-plan', data);
    }

    async updateSubscriptionPlan(subscriptionPlanId: string, data: Record<string, any>) {
        return axiosClient.put(`/subscription-plan/${subscriptionPlanId}`, data);
    }

    async deleteSubscriptionPlan(subscriptionPlanId: string) {
        return axiosClient.delete(`/subscription-plan/${subscriptionPlanId}`);
    }

    async getSubscriptionFeatures() {
        return axiosClient.get('/subscription-feature');
    }

    async getSubscriptionFeatureById(subscriptionFeatureId: string) {
        return axiosClient.get(`/subscription-feature/${subscriptionFeatureId}`);
    }

    async createSubscriptionFeature(data: Record<string, any>) {
        return axiosClient.post('/subscription-feature', data);
    }

    async updateSubscriptionFeature(subscriptionFeatureId: string, data: Record<string, any>) {
        return axiosClient.put(`/subscription-feature/${subscriptionFeatureId}`, data);
    }

    async deleteSubscriptionFeature(subscriptionFeatureId: string) {
        return axiosClient.delete(`/subscription-feature/${subscriptionFeatureId}`);
    }
}

export default new SubscriptionService();
