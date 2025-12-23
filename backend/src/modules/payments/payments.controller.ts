import { Controller, Post, Body, UseGuards, Request, Headers, BadRequestException } from '@nestjs/common';
import { CulqiService } from './providers/culqi.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { PlanCode } from '../subscriptions/enums/plan-code.enum';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly culqiService: CulqiService,
        private readonly configService: ConfigService,
    ) { }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async createCharge(
        @Request() req,
        @Headers('x-company-id') companyId: string,
        @Body('planCode') planCode: PlanCode,
    ) {
        if (!companyId) throw new BadRequestException('Organization Context Required');

        let amount = 0;
        let description = '';

        if (planCode === PlanCode.BASIC) {
            amount = 5000; // S/ 50.00
            description = 'Suscripción BASIC';
        }
        else if (planCode === PlanCode.PRO) {
            amount = 10000; // S/ 100.00
            description = 'Suscripción PRO';
        }
        else throw new BadRequestException('Invalid Plan for Checkout');

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
            checkoutUrl: null
        };
    }
}
