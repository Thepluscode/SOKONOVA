import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, hasPermission } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        const userRole = user.role || 'BUYER';

        // Check if user has any of the required permissions
        const hasRequiredPermission = requiredPermissions.some((permission) =>
            hasPermission(userRole, permission),
        );

        if (!hasRequiredPermission) {
            throw new ForbiddenException(
                `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
            );
        }

        return true;
    }
}
