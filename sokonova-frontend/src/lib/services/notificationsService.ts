// Notifications Service - API integration for notifications module

import api, { buildQuery } from '../api';
import type { Notification } from '../types';

interface NotificationFilters {
    limit?: number;
    unreadOnly?: boolean;
}

export const notificationsService = {
    /**
     * List notifications for user
     * GET /notifications?userId=...&limit=...&unreadOnly=...
     */
    list: async (userId: string, filters?: NotificationFilters): Promise<Notification[]> => {
        const params = {
            userId,
            limit: filters?.limit,
            unreadOnly: filters?.unreadOnly,
        };
        const query = buildQuery(params as Record<string, string | number | boolean | undefined>);
        return api.get<Notification[]>(`/notifications${query}`);
    },

    /**
     * Get unread notification count
     * GET /notifications/unread-count?userId=...
     */
    getUnreadCount: async (userId: string): Promise<{ count: number }> => {
        return api.get<{ count: number }>(`/notifications/unread-count?userId=${userId}`);
    },

    /**
     * Mark notification as read
     * POST /notifications/:id/read
     */
    markRead: async (id: string, userId: string): Promise<{ success: boolean }> => {
        return api.post<{ success: boolean }>(`/notifications/${id}/read`, { userId });
    },

    /**
     * Mark all notifications as read
     * POST /notifications/mark-all-read
     */
    markAllRead: async (userId: string): Promise<{ success: boolean }> => {
        return api.post<{ success: boolean }>('/notifications/mark-all-read', { userId });
    },

    /**
     * Delete notification
     * POST /notifications/:id/delete
     */
    delete: async (id: string, userId: string): Promise<{ success: boolean }> => {
        return api.post<{ success: boolean }>(`/notifications/${id}/delete`, { userId });
    },
};

export default notificationsService;
