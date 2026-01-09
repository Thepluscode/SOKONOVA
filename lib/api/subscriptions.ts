// lib/api/subscriptions.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get all subscription plans
 */
export function getSubscriptionPlans() {
  return apiFetch(`${apiBase}/subscriptions/plans`);
}

/**
 * Subscribe to a plan
 */
export function subscribeToPlan(data: {
  userId: string;
  planId: string;
  paymentMethod: string;
}) {
  return apiFetch(`${apiBase}/subscriptions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get user's subscription
 */
export function getMySubscription(userId: string) {
  return apiFetch(`${apiBase}/subscriptions/user/${userId}`);
}

/**
 * Cancel subscription
 */
export function cancelSubscription(id: string, userId: string) {
  return apiFetch(`${apiBase}/subscriptions/${id}/cancel`, {
    method: "PUT",
    body: JSON.stringify({ userId }),
  });
}

/**
 * Get all subscriptions (admin only)
 */
export function getAllSubscriptions(adminId: string) {
  return apiFetch(`${apiBase}/subscriptions/admin/all?adminId=${adminId}`);
}

/**
 * Get subscription stats (admin only)
 */
export function getSubscriptionStats(adminId: string) {
  return apiFetch(`${apiBase}/subscriptions/admin/stats?adminId=${adminId}`);
}