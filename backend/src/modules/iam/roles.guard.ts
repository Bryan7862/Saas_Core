import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // Assuming user.userRoles is populated. 
        // We might need to adjust AuthService validateUser to include userRoles in the payload 
        // or fetch them here if not present.
        // For performance, better if they are in the request.user object (from Strategy).

        // Check if user has at least one of the required roles
        // We need to see how user structure comes from JwtStrategy.
        // Let's assume for now user has 'roles' property as an array of codes.

        if (!user || !user.roles) {
            console.warn('User roles missing in request. Ensure JwtStrategy attaches them.');
            return false;
        }

        return requiredRoles.some((role) => user.roles.includes(role));
    }
}
