// lib/api/sponsored-placements.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get sponsored placements for a category
 */
export function getSponsoredPlacementsByCategory(categorySlug: string) {
  return apiFetch(`${apiBase}/sponsored-placements/category/${categorySlug}`);
}

/**
 * Get sponsored placements for a search term
 */
export function getSponsoredPlacementsBySearch(term: string) {
  return apiFetch(`${apiBase}/sponsored-placements/search?term=${term}`);
}

/**
 * Create a sponsored placement
 */
export function createSponsoredPlacement(data: {
  sellerId: string;
  productId: string;
  categorySlug?: string;
  searchTerm?: string;
  bidAmount: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
}) {
  return apiFetch(`${apiBase}/sponsored-placements`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get seller's sponsored placements
 */
export function getSellerSponsoredPlacements(sellerId: string) {
  return apiFetch(`${apiBase}/sponsored-placements/seller/${sellerId}`);
}

/**
 * Update a sponsored placement
 */
export function updateSponsoredPlacement(id: string, data: { bidAmount?: number; startDate?: string; endDate?: string }) {
  return apiFetch(`${apiBase}/sponsored-placements/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a sponsored placement
 */
export function deleteSponsoredPlacement(id: string) {
  return apiFetch(`${apiBase}/sponsored-placements/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get all sponsored placements (admin only)
 */
export function getAllSponsoredPlacements() {
  return apiFetch(`${apiBase}/sponsored-placements/admin/all`);
}

/**
 * Update sponsored placement status (admin only)
 */
export function updateSponsoredPlacementStatus(id: string, status: string) {
  return apiFetch(`${apiBase}/sponsored-placements/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}