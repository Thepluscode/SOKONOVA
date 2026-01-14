// User Service - API integration for user account management

import api from '../api';

interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    role: string;
    storeName?: string;
    bio?: string;
    createdAt: string;
}

interface AddressData {
    id?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault?: boolean;
}

interface NotificationSettings {
    emailOrders: boolean;
    emailPromotions: boolean;
    emailNewsletter: boolean;
    pushOrders: boolean;
    pushPromotions: boolean;
    smsOrders: boolean;
}

export const userService = {
    /**
     * Get current user profile
     * GET /users/me
     */
    getProfile: async (): Promise<UserProfile> => {
        return api.get<UserProfile>('/users/me');
    },

    /**
     * Update user profile
     * PATCH /users/me
     */
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        return api.patch<UserProfile>('/users/me', data);
    },

    /**
     * Update password
     * POST /users/me/password
     */
    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        return api.post('/users/me/password', { currentPassword, newPassword });
    },

    /**
     * Get user addresses
     * GET /users/me/addresses
     */
    getAddresses: async (): Promise<AddressData[]> => {
        return api.get<AddressData[]>('/users/me/addresses');
    },

    /**
     * Add address
     * POST /users/me/addresses
     */
    addAddress: async (data: AddressData): Promise<AddressData> => {
        return api.post<AddressData>('/users/me/addresses', data);
    },

    /**
     * Update address
     * PATCH /users/me/addresses/:id
     */
    updateAddress: async (id: string, data: Partial<AddressData>): Promise<AddressData> => {
        return api.patch<AddressData>(`/users/me/addresses/${id}`, data);
    },

    /**
     * Delete address
     * DELETE /users/me/addresses/:id
     */
    deleteAddress: async (id: string): Promise<void> => {
        return api.delete(`/users/me/addresses/${id}`);
    },

    /**
     * Get notification settings
     * GET /users/me/notifications
     */
    getNotificationSettings: async (): Promise<NotificationSettings> => {
        return api.get<NotificationSettings>('/users/me/notifications');
    },

    /**
     * Update notification settings
     * PATCH /users/me/notifications
     */
    updateNotificationSettings: async (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
        return api.patch<NotificationSettings>('/users/me/notifications', data);
    },

    /**
     * Delete account
     * DELETE /users/me
     */
    deleteAccount: async (password: string): Promise<void> => {
        return api.post('/users/me/delete', { password });
    },

    /**
     * Get user by ID (public profile)
     * GET /users/:id
     */
    getById: async (id: string): Promise<UserProfile> => {
        return api.get<UserProfile>(`/users/${id}`);
    },
};

export default userService;
