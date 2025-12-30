import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationSettingsController } from './organization-settings.controller';
import { Company } from './entities/company.entity';
import { UserRole } from '../iam/entities/user-role.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { IamModule } from '../iam/iam.module';

import { OrganizationSettings } from './entities/organization-settings.entity';

import { forwardRef } from '@nestjs/common';
import { TrashModule } from '../trash/trash.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company, UserRole, OrganizationSettings]),
        IamModule,
        SubscriptionsModule,
        forwardRef(() => TrashModule),
        NotificationsModule,
    ],
    controllers: [OrganizationsController, OrganizationSettingsController],
    providers: [OrganizationsService],
    exports: [OrganizationsService], // Export so AuthModule can use it
})
export class OrganizationsModule { }
