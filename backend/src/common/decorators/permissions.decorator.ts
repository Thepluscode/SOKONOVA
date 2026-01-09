import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Permissions decorator for fine-grained access control
 * Usage: @Permissions('manage:teams', 'view:audit')
 */
export const Permissions = (...permissions: string[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Standard permissions mapping for role hierarchy
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
    ADMIN: [
        // Full access
        'manage:teams',
        'manage:users',
        'manage:sellers',
        'manage:products',
        'manage:orders',
        'manage:disputes',
        'manage:payouts',
        'view:audit',
        'manage:audit',
        'view:analytics',
        'manage:settings',
    ],
    MANAGER: [
        // Team and user management, view-only for most operations
        'manage:teams',
        'view:users',
        'manage:sellers',
        'view:products',
        'view:orders',
        'view:disputes',
        'view:payouts',
        'view:audit',
        'view:analytics',
    ],
    OPERATOR: [
        // Day-to-day operations
        'view:users',
        'view:sellers',
        'view:products',
        'view:orders',
        'manage:disputes',
        'view:payouts',
        'view:analytics',
    ],
    SELLER: [
        // Seller-specific permissions
        'manage:own_products',
        'view:own_orders',
        'manage:own_fulfillment',
        'view:own_analytics',
    ],
    BUYER: [
        // Buyer-specific permissions
        'manage:own_orders',
        'manage:own_profile',
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
}
