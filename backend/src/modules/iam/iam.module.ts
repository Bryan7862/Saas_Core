import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { User } from '../auth/entities/user.entity'; // Needed for UserRole relation check if any

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Role,
            Permission,
            UserRole,
            RolePermission,
            User, // For validation if needed, or remove if not used directly
        ]),
    ],
    controllers: [IamController],
    providers: [IamService],
    exports: [IamService],
})
export class IamModule { }
