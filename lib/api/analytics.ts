// lib/api/analytics.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get seller profitability data
 */
export async function getSellerProfitability(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/profitability`);
}

/**
 * Get seller order history with fee breakdown
 */
export async function getSellerOrdersWithFees(sellerId: string, limit = 50) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/orders?limit=${limit}`);
}

/**
 * Simulate pricing scenarios
 */
export async function simulatePricingScenario(
  sellerId: string,
  scenario: {
    feeChange?: number;
    bundleDiscount?: number;
    productId?: string;
  }
) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/simulate-pricing`, {
    method: "POST",
    body: JSON.stringify(scenario),
  });
}

/**
 * Get inventory velocity metrics
 */
export async function getInventoryVelocity(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/inventory-velocity`);
}

/**
 * Get buyer cohort data
 */
export async function getBuyerCohorts(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/buyer-cohorts`);
}

/**
 * Get buyer segmentation data
 */
export async function getBuyerSegments(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/buyer-segments`);
}

/**
 * Generate discount campaign for a segment
 */
export async function generateDiscountCampaign(
  sellerId: string,
  segmentId: string,
  discountData: {
    discountPercentage: number;
    durationDays: number;
    maxUses?: number;
  }
) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/segments/${segmentId}/discount-campaign`, {
    method: "POST",
    body: JSON.stringify(discountData),
  });
}

/**
 * Get inventory risk analysis
 */
export async function getInventoryRiskAnalysis(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/inventory-risk`);
}

/**
 * Get aging inventory report
 */
export async function getAgingInventory(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/aging-inventory`);
}

/**
 * Get stockout predictions
 */
export async function getStockoutPredictions(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/stockout-predictions`);
}

/**
 * Generate inventory recommendations
 */
export async function generateInventoryRecommendations(
  sellerId: string,
  productId?: string
) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/inventory-recommendations`, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

/**
 * Get ops summary for admin dashboard
 */
export async function getOpsSummary(adminId: string) {
  return apiFetch(`${apiBase}/analytics/ops-summary?adminId=${adminId}`);
}

/**
 * Get seller analytics summary
 */
export async function getSellerAnalyticsSummary(sellerId: string) {
  return apiFetch(`${apiBase}/analytics/seller/${sellerId}/summary`);
}