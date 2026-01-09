// lib/api/seller-applications.ts
import { apiBase, apiFetch } from "./base";

/**
 * Submit seller application
 */
export function submitSellerApplication(data: {
  userId: string;
  businessName: string;
  phone: string;
  country: string;
  city: string;
  storefrontDesc: string;
}) {
  return apiFetch(`${apiBase}/seller-applications/apply`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Check my application status
 */
export function getMySellerApplication(userId: string) {
  const qs = new URLSearchParams({ userId });
  return apiFetch(`${apiBase}/seller-applications/mine?${qs.toString()}`);
}

/**
 * Admin: Get pending applications
 */
export function getAdminPendingApplications(adminId: string) {
  const qs = new URLSearchParams({ adminId });
  return apiFetch(`${apiBase}/seller-applications/pending?${qs.toString()}`);
}

/**
 * Admin: Approve application
 */
export function adminApproveApplication(
  appId: string,
  adminId: string,
  adminNote?: string,
) {
  return apiFetch(`${apiBase}/seller-applications/${appId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ adminId, adminNote }),
  });
}

/**
 * Admin: Reject application
 */
export function adminRejectApplication(
  appId: string,
  adminId: string,
  adminNote?: string,
) {
  return apiFetch(`${apiBase}/seller-applications/${appId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ adminId, adminNote }),
  });
}