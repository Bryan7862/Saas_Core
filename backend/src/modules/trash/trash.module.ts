import { Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
    imports: [AuthModule, OrganizationsModule],
    controllers: [TrashController],
})
export class TrashModule { }
