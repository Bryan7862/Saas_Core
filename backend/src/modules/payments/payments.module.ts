import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { CulqiService } from './providers/culqi.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [ConfigModule, SubscriptionsModule],
    controllers: [PaymentsController], // Removed StripeWebhookController for now
    providers: [CulqiService],
})
export class PaymentsModule { }
