import { Controller, Post, Body, UseGuards, Request, Headers, BadRequestException } from '@nestjs/common';
import { CulqiService } from './providers/culqi.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { PlanCode } from '../subscriptions/enums/plan-code.enum';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly culqiService: CulqiService,
        private readonly configService: ConfigService,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    @Post('subscribe') // Renamed from checkout for clarity
    @UseGuards(JwtAuthGuard)
    async subscribe(
        @Request() req,
        @Headers('x-company-id') companyId: string,
        @Body('planCode') planCode: PlanCode,
    ) {
        if (!companyId) throw new BadRequestException('Organization Context Required');

        const plan = await this.subscriptionsService.getPlanByCode(planCode);
        if (!plan) throw new BadRequestException('Invalid Plan');

        // Culqi Amount is in cents
        const amount = Math.round(plan.pricePe * 100);
        const description = `Suscripción ${plan.name}`;

        const order = await this.culqiService.createOrder(
            companyId,
            amount,
            description,
            req.user.email
        );

        return {
            orderId: order.id,
            publicKey: this.culqiService.getPublicKey(),
            description: description,
            amount: amount,
            currency: 'PEN',
            // If Culqi had a checkout URL, we'd pass it. For now frontend uses public key + orderId.
        };
    }

    @Post('confirm')
    @UseGuards(JwtAuthGuard)
    async confirmPayment(
        @Headers('x-company-id') companyId: string,
        @Body('planCode') planCode: PlanCode,
        @Body('chargeId') chargeId: string, // Or subscription ID if recurring
    ) {
        if (!companyId) throw new BadRequestException('Organization Context Required');

        // 1. Verify Payment with Culqi
        const charge = await this.culqiService.getCharge(chargeId);
        if (!charge || charge.object !== 'charge' || charge.outcome.type !== 'sale') {
            throw new BadRequestException('Payment Verification Failed');
        }

        // 2. Activate Subscription
        // Calculate end date (30 days from now)
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + 30);

        await this.subscriptionsService.activateSubscription(
            companyId,
            planCode,
            charge.customer_id || 'guest',
            charge.id, // Using Charge ID as Subscription ID for one-off/mock
            endsAt
        );

        return { success: true, plan: planCode };
    }
}
