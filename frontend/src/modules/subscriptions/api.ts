import { api } from '../../lib/api';

export interface Subscription {
    id: string;
    organizationId: string;
    planCode: 'FREE' | 'BASIC' | 'PRO';
    status: 'ACTIVE' | 'PENDING_PAYMENT' | 'SUSPENDED' | 'CANCELED' | 'TRIAL';
    amount?: number; // Only for UI display if needed
    currency?: string;
    interval?: string;
    endsAt?: string;
}

export const getCurrentSubscription = async (): Promise<Subscription> => {
    const response = await api.get('/subscriptions/current');
    return response.data;
};

export const createPaymentOrder = async (planCode: string): Promise<{
    orderId: string;
    publicKey: string;
    description: string;
    amount: number;
    currency: string;
}> => {
    const response = await api.post('/payments/checkout', { planCode });
    return response.data;
};
