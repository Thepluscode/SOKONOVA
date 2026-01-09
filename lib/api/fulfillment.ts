// lib/api/fulfillment.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get delivery estimate for a product
 */
export async function getDeliveryEstimate(productId: string, location?: string) {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  
  return apiFetch(`${apiBase}/fulfillment/products/${productId}/delivery-estimate?${params}`);
}

/**
 * Get shipping options for checkout
 */
export async function getShippingOptions(
  items: Array<{ productId: string; quantity: number }>,
  location?: string
) {
  return apiFetch(`${apiBase}/fulfillment/shipping-options`, {
    method: "POST",
    body: JSON.stringify({ items, location }),
  });
}

/**
 * Track shipment
 */
export async function trackShipment(trackingNumber: string) {
  return apiFetch(`${apiBase}/fulfillment/track/${trackingNumber}`);
}

/**
 * Get delivery performance metrics
 */
export async function getDeliveryPerformance(sellerId: string) {
  return apiFetch(`${apiBase}/fulfillment/sellers/${sellerId}/delivery-performance`);
}

/**
 * Buyer: Get order tracking information
 */
export function getOrderTracking(orderId: string, userId: string) {
  const params = new URLSearchParams({ userId });
  return apiFetch(`${apiBase}/fulfillment/tracking/${orderId}?${params.toString()}`);
}

/**
 * Seller: Get open fulfillment queue (items to ship)
 */
export function sellerGetOpenFulfillment(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/fulfillment/seller/open?${params.toString()}`);
}

/**
 * Seller: Get fulfillment statistics
 */
export function sellerGetFulfillmentStats(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/fulfillment/seller/stats?${params.toString()}`);
}

/**
 * Seller: Mark item as shipped
 */
export function sellerMarkShipped(
  orderItemId: string,
  sellerId: string,
  carrier?: string,
  trackingCode?: string,
  note?: string,
) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/fulfillment/seller/ship/${orderItemId}?${params.toString()}`, {
    method: "PATCH",
    body: JSON.stringify({ carrier, trackingCode, note }),
  });
}

/**
 * Seller: Mark item as delivered
 */
export function sellerMarkDelivered(
  orderItemId: string,
  sellerId: string,
  proofUrl?: string,
  note?: string,
) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/fulfillment/seller/deliver/${orderItemId}?${params.toString()}`, {
    method: "PATCH",
    body: JSON.stringify({ proofUrl, note }),
  });
}

/**
 * Seller: Mark item as having an issue
 */
export function sellerMarkIssue(
  orderItemId: string,
  sellerId: string,
  note: string,
) {
  const params = new URLSearchParams({ sellerId });
  return apiFetch(`${apiBase}/fulfillment/seller/issue/${orderItemId}?${params.toString()}`, {
    method: "PATCH",
    body: JSON.stringify({ note }),
  });
}

// NEW FEATURES FOR LOGISTICS & FULFILLMENT EXCELLENCE

/**
 * Get delivery promise estimate with confidence level
 */
export async function getDeliveryPromise(productId: string, location?: string) {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  
  return apiFetch(`${apiBase}/fulfillment/delivery-promise/${productId}?${params}`);
}

/**
 * Get exception workflow status for an order item
 */
export async function getExceptionStatus(orderItemId: string) {
  return apiFetch(`${apiBase}/fulfillment/exceptions/${orderItemId}`);
}

/**
 * Get micro-fulfillment partner performance metrics
 */
export async function getMicroFulfillmentMetrics(sellerId: string) {
  return apiFetch(`${apiBase}/fulfillment/micro-fulfillment/${sellerId}/metrics`);
}

/**
 * Opt-in to micro-fulfillment service
 */
export async function optInToMicroFulfillment(sellerId: string, partnerId: string) {
  return apiFetch(`${apiBase}/fulfillment/micro-fulfillment/${sellerId}/opt-in`, {
    method: "POST",
    body: JSON.stringify({ partnerId }),
  });
}

/**
 * Get fulfillment partner options
 */
export async function getFulfillmentPartners(sellerId: string) {
  return apiFetch(`${apiBase}/fulfillment/micro-fulfillment/${sellerId}/partners`);
}
