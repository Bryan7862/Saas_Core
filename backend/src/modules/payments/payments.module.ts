import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { CulqiService } from './providers/culqi.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { CulqiWebhookController } from './webhooks/culqi-webhook.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [TransactionsModule, SubscriptionsModule],
    controllers: [PaymentsController, CulqiWebhookController],
    providers: [CulqiService],
    exports: [CulqiService],
})
export class PaymentsModule { }
