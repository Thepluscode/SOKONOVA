import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

/**
 * Role hierarchy: ADMIN > MANAGER > OPERATOR > SELLER/BUYER
 * Higher roles inherit access from lower roles
 */
const ROLE_HIERARCHY: Record<string, number> = {
  ADMIN: 100,
  MANAGER: 80,
  OPERATOR: 60,
  SELLER: 40,
  BUYER: 20,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;

    // Check if user's role level meets or exceeds any required role
    const hasRole = requiredRoles.some((role) => {
      const requiredRoleLevel = ROLE_HIERARCHY[role] || 0;
      return userRoleLevel >= requiredRoleLevel;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}

/**
 * Helper function to check role hierarchy
 */
export function hasRoleOrHigher(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}
