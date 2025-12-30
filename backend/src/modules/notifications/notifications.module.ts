import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';

@Global() // Global so other modules can inject NotificationsService easily
@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsGateway, NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
