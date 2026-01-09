// lib/api/notifications.ts
import { apiBase, apiFetch, handle } from "./base";

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  limit = 50,
  unreadOnly = false
) {
  const params = new URLSearchParams({ userId, limit: limit.toString() });
  if (unreadOnly) params.set("unreadOnly", "true");

  const res = await apiFetch(`${apiBase}/notifications?${params.toString()}`);
  return handle(res);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const res = await apiFetch(
    `${apiBase}/notifications/unread-count?userId=${userId}`
  );
  const data = await handle(res);
  return Number(data.count);
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(
  notificationId: string,
  userId: string
) {
  const res = await apiFetch(`${apiBase}/notifications/${notificationId}/read`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return handle(res);
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId: string) {
  const res = await apiFetch(`${apiBase}/notifications/mark-all-read`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return handle(res);
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  const res = await apiFetch(`${apiBase}/notifications/${notificationId}/delete`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return handle(res);
}

/**
 * Get user notification preferences
 */
export async function getUserNotificationPreferences(userId: string) {
  const res = await apiFetch(
    `${apiBase}/users/${userId}/notification-preferences`
  );
  return handle(res);
}

/**
 * Update user notification preferences
 */
export async function updateUserNotificationPreferences(
  userId: string,
  preferences: {
    notifyEmail?: boolean;
    notifySms?: boolean;
    quietHoursStart?: number | null;
    quietHoursEnd?: number | null;
    timezone?: string;
  }
) {
  const res = await apiFetch(
    `${apiBase}/users/${userId}/notification-preferences`,
    {
      method: "PATCH",
      body: JSON.stringify(preferences),
    }
  );
  return handle(res);
}