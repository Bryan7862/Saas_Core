import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { User } from '../auth/entities/user.entity'; // Needed for UserRole relation check if any
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Role,
            Permission,
            UserRole,
            RolePermission,
            User, // For validation if needed, or remove if not used directly
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [IamController],
    providers: [IamService, RolesGuard, PermissionsGuard],
    exports: [IamService, RolesGuard, PermissionsGuard],
})
export class IamModule { }
