import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CulqiService implements OnModuleInit {
    private readonly logger = new Logger(CulqiService.name);
    private culqi: AxiosInstance;
    private publicKey: string;
    private secretKey: string;
    private isMockMode: boolean = false;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.secretKey = this.configService.get<string>('CULQI_SECRET_KEY') || 'sk_test_placeholder';
        this.publicKey = this.configService.get<string>('CULQI_PUBLIC_KEY') || 'pk_test_placeholder';

        if (this.secretKey === 'sk_test_placeholder') {
            this.logger.warn('⚠️ Keys not set. Activando MOCK MODE. Los pagos serán simulados.');
            this.isMockMode = true;
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
        if (this.isMockMode) {
            this.logger.debug(`[Mock] Creating Order for ${amount} PEN`);
            return {
                object: "order",
                id: `ord_mock_${organizationId}_${Date.now()}`,
                amount: amount,
                currency_code: "PEN",
                description: description,
                state: "pending",
                total_fee: 0,
                net_amount: amount,
                fee_details: null,
                creation_date: Date.now(),
                expiration_date: Date.now() + 86400000,
                metadata: { organizationId }
            };
        }

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
            this.logger.error(`Create Order Error: ${error.response?.data || error.message}`);
            throw new Error('Failed to create Culqi Order');
        }
    }

    getPublicKey() {
        return this.publicKey;
    }

    // --- Webhook Verification ---
    async getCharge(chargeId: string) {
        if (this.isMockMode || chargeId.startsWith('chr_mock_')) {
            this.logger.debug(`[Mock] Verifying Charge ${chargeId}`);
            return {
                object: "charge",
                id: chargeId,
                amount: 10000,
                current_amount: 10000,
                currency_code: "PEN",
                state: "captured", // Important for activation logic
                outcome: {
                    type: "sale",
                    code: "AUT0000",
                    merchant_message: "La operación de venta ha sido autorizada exitosamente"
                }
            };
        }
        try {
            const response = await this.culqi.get(`/charges/${chargeId}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Get Charge Error: ${error.response?.data || error.message}`);
            // If 404, returns null or throws. 
            // Better to throw so we know verify failed.
            throw new Error('Failed to verify charge with Culqi');
        }
    }
}
