// lib/api/seller-services.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get all available seller services
 */
export function getAllSellerServices() {
  return apiFetch(`${apiBase}/seller-services`);
}

/**
 * Get service by ID
 */
export function getSellerServiceById(id: string) {
  return apiFetch(`${apiBase}/seller-services/${id}`);
}

/**
 * Get services offered by seller
 */
export function getMySellerServices(sellerId: string) {
  return apiFetch(`${apiBase}/seller-services/seller/${sellerId}`);
}

/**
 * Offer a new service
 */
export function offerSellerService(data: {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  deliveryTime: number;
}) {
  return apiFetch(`${apiBase}/seller-services`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update service
 */
export function updateSellerService(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    deliveryTime: number;
    active: boolean;
  }>
) {
  return apiFetch(`${apiBase}/seller-services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete service (deactivate)
 */
export function deleteSellerService(id: string) {
  return apiFetch(`${apiBase}/seller-services/${id}`, {
    method: "DELETE",
  });
}

/**
 * Purchase a service (create order)
 */
export function purchaseSellerService(
  id: string,
  data: {
    buyerId: string;
    sellerId: string;
    message: string;
    price: number;
    currency: string;
  }
) {
  return apiFetch(`${apiBase}/seller-services/${id}/order`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get service orders for a seller
 */
export function getServiceOrders(sellerId: string) {
  return apiFetch(`${apiBase}/seller-services/orders/seller/${sellerId}`);
}

/**
 * Get service orders for a buyer
 */
export function getBuyerServiceOrders(buyerId: string) {
  return apiFetch(`${apiBase}/seller-services/orders/buyer/${buyerId}`);
}

/**
 * Get service order by ID
 */
export function getServiceOrderById(id: string) {
  return apiFetch(`${apiBase}/seller-services/orders/${id}`);
}

/**
 * Update order status
 */
export function updateServiceOrderStatus(
  orderId: string,
  status: string,
  note?: string
) {
  return apiFetch(`${apiBase}/seller-services/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, note }),
  });
}