import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { IamService } from '../iam.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../entities/user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true; // No permissions required
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Context Header (passed by frontend) or default behavior
        // Assuming your standard AuthGuard attaches the user. 
        // We also need the 'x-company-id' header or query param which defines the context.
        // For now, let's assume the user object populated by JwtStrategy might NOT have the current context roles loaded deep enough.

        // We need the companyId to validate roles.
        // Option A: Front sends 'x-company-id' header.
        // Option B: User has a specific 'defaultCompanyId' or we check ALL roles? 
        // Security requirement says: Protect by Organization. So we MUST check context.

        const companyId = request.headers['x-company-id'] || user.defaultCompanyId;

        if (!companyId) {
            throw new ForbiddenException('No Organization Context provided for Permission Check');
        }

        if (!user || !user.userId) {
            throw new ForbiddenException('User not authenticated');
        }

        // Fetch user roles for this company WITH their permissions
        const userRoles = await this.userRoleRepository.find({
            where: { userId: user.userId, companyId: companyId },
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
        });

        // Flatten permissions
        const userPermissions = userRoles.flatMap(ur =>
            ur.role.rolePermissions.map(rp => rp.permission.code)
        );

        // Debug Log
        // console.log(`User ${user.email} in Org ${companyId} has permissions:`, userPermissions);

        // Check if user has ALL required permissions (or SOME? Usually ALL for a single route decorator)
        // Let's assume ANY of the required permissions allows access if multiple are listed? 
        // Or if multiple are listed, does it mean AND? 
        // Usually @RequirePermissions('users:read', 'users:write') means AND.
        // But simpler is: check if user has the specific required one.

        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

        if (!hasPermission) {
            throw new ForbiddenException(`Missing required permissions: ${requiredPermissions.join(', ')}`);
        }

        return true;
    }
}
