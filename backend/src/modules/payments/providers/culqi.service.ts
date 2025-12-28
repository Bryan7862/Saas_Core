import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CulqiService implements OnModuleInit {
    private culqi: AxiosInstance;
    private publicKey: string;
    private secretKey: string;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.secretKey = this.configService.get<string>('CULQI_SECRET_KEY') || 'sk_test_placeholder';
        this.publicKey = this.configService.get<string>('CULQI_PUBLIC_KEY') || 'pk_test_placeholder';

        if (this.secretKey === 'sk_test_placeholder') {
            console.warn('CULQI_SECRET_KEY not set. Using placeholder. Payments will fail.');
        }

        this.culqi = axios.create({
            baseURL: 'https://api.culqi.com/v2',
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async createOrder(organizationId: string, amount: number, description: string, email: string) {
        // Amount is in cents (e.g. 5000 = S/ 50.00)
        try {
            const response = await this.culqi.post('/orders', {
                amount: amount,
                currency_code: 'PEN',
                description: description,
                order_number: `ORD-${organizationId}-${Date.now()}`,
                client_details: {
                    email: email,
                },
                expiration_date: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
                metadata: {
                    organizationId,
                    planCode: description.includes('BASIC') ? 'BASIC' : 'PRO', // Simple logic
                },
            });
            return response.data;
        } catch (error) {
            console.error('Culqi Create Order Error:', error.response?.data || error.message);
            throw new Error('Failed to create Culqi Order');
        }
    }

    getPublicKey() {
        return this.publicKey;
    }

    // --- Webhook Verification ---
    async getCharge(chargeId: string) {
        try {
            const response = await this.culqi.get(`/charges/${chargeId}`);
            return response.data;
        } catch (error) {
            console.error('Culqi Get Charge Error:', error.response?.data || error.message);
            // If 404, returns null or throws. 
            // Better to throw so we know verify failed.
            throw new Error('Failed to verify charge with Culqi');
        }
    }
}
