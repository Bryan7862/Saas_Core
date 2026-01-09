import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContextMiddleware } from './common/middleware/context.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { IamModule } from './modules/iam/iam.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TrashModule } from './modules/trash/trash.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PlansModule } from './modules/plans/plans.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // Rate Limiting - Protección contra ataques de fuerza bruta
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 minuto en milisegundos
            limit: 30, // 30 requests por minuto por IP
        }]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME') || configService.get<string>('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: configService.get<string>('NODE_ENV') === 'development',
                ssl: configService.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        IamModule,
        OrganizationsModule,
        TrashModule,
        NotificationsModule,
        SubscriptionsModule,
        TransactionsModule,
        PaymentsModule,
        DashboardModule,
        PlansModule,
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ContextMiddleware).forRoutes('*');
    }
}