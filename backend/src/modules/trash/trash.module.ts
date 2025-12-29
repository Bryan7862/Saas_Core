import { Module, forwardRef } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TrashAudit } from './entities/trash-audit.entity';
import { TrashService } from './trash.service';
import { UserRole } from '../iam/entities/user-role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TrashAudit, UserRole]),
        forwardRef(() => AuthModule),
        forwardRef(() => OrganizationsModule)
    ],
    controllers: [TrashController],
    providers: [TrashService],
    exports: [TrashService],
})
export class TrashModule { }
