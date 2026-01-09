import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator for role-based access control
 * Usage: @Roles(Role.ADMIN, Role.MANAGER)
 * Roles: ADMIN, MANAGER, OPERATOR, SELLER, BUYER
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
