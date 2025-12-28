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

@Module({
    imports: [
        TypeOrmModule.forFeature([Company, UserRole, OrganizationSettings]),
        IamModule,
        SubscriptionsModule,
    ],
    controllers: [OrganizationsController, OrganizationSettingsController],
    providers: [OrganizationsService],
    exports: [OrganizationsService], // Export so AuthModule can use it
})
export class OrganizationsModule { }
