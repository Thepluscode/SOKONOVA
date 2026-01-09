// lib/api/disputes.ts
import { apiBase, apiFetch } from "./base";

/**
 * Buyer: Open a dispute
 */
export function openDispute(data: {
  buyerId: string;
  orderItemId: string;
  reasonCode: string;
  description: string;
  photoProofUrl?: string;
}) {
  return apiFetch(`${apiBase}/disputes/open`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Buyer: List my disputes
 */
export function getMyDisputes(buyerId: string) {
  const qs = new URLSearchParams({ buyerId });
  return apiFetch(`${apiBase}/disputes/mine?${qs.toString()}`);
}

/**
 * Seller: View disputes involving their items
 */
export function sellerGetDisputes(sellerId: string) {
  const qs = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/disputes/seller?${qs.toString()}`);
}

/**
 * Seller/Admin: Resolve dispute
 */
export function resolveDispute(
  disputeId: string,
  actorId: string,
  status: string,
  resolutionNote?: string,
) {
  return apiFetch(`${apiBase}/disputes/${disputeId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ actorId, status, resolutionNote }),
  });
}