// lib/api/admin-control-tower.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get system health overview
 */
export function getSystemHealth(adminId: string) {
  return apiFetch(`${apiBase}/admin-control-tower/health?adminId=${adminId}`);
}

/**
 * Get platform metrics
 */
export function getPlatformMetrics(adminId: string) {
  return apiFetch(`${apiBase}/admin-control-tower/metrics?adminId=${adminId}`);
}

/**
 * Get recent activities
 */
export function getRecentActivities(adminId: string) {
  return apiFetch(`${apiBase}/admin-control-tower/activities?adminId=${adminId}`);
}

/**
 * Get system alerts
 */
export function getSystemAlerts(adminId: string) {
  return apiFetch(`${apiBase}/admin-control-tower/alerts?adminId=${adminId}`);
}

/**
 * Get user insights
 */
export function getUserInsights(adminId: string) {
  return apiFetch(`${apiBase}/admin-control-tower/user-insights?adminId=${adminId}`);
}