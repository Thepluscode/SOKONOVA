// lib/api/payouts.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get pending (unpaid) earnings for a seller
 * Returns gross sales, fees, and net amount owed
 */
export function sellerGetPendingPayout(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/payouts/seller/pending?${params.toString()}`);
}

/**
 * Get all earnings history (pending and paid) for a seller
 */
export function sellerGetAllPayouts(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/payouts/seller/all?${params.toString()}`);
}

/**
 * Get CSV download URL for seller earnings
 * Use this for bank transfer / mobile money reconciliation
 */
export function sellerPayoutCsvUrl(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return `${apiBase}/payouts/seller/csv?${params.toString()}`;
}

/**
 * Admin: Mark order items as paid out
 */
export function adminMarkPaidOut(orderItemIds: string[], batchId: string) {
  return apiFetch(`${apiBase}/payouts/admin/mark-paid`, {
    method: "POST",
    body: JSON.stringify({ orderItemIds, batchId }),
  });
}

/**
 * Admin: Get payout summary for all sellers
 */
export function adminPayoutSummary() {
  return apiFetch(`${apiBase}/payouts/admin/summary`);
}