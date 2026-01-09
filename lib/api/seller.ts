// lib/api/seller.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get all products for a seller
 */
export function getSellerProducts(sellerId: string) {
  return apiFetch(`${apiBase}/seller/products?sellerId=${sellerId}`);
}

/**
 * Create a new product (seller)
 */
export function createSellerProduct(data: {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
}) {
  return apiFetch(`${apiBase}/seller/products`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update product details (seller)
 */
export function updateSellerProduct(
  sellerId: string,
  productId: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    imageUrl?: string;
  }
) {
  return apiFetch(`${apiBase}/seller/products/${productId}?sellerId=${sellerId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Update product inventory (seller)
 */
export function updateSellerInventory(
  sellerId: string,
  productId: string,
  quantity: number
) {
  return apiFetch(`${apiBase}/seller/products/${productId}/inventory?sellerId=${sellerId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

/**
 * Promote a user to seller role
 * In production, this would require admin approval or payment
 */
export function promoteToSeller(userId: string) {
  return apiFetch(`${apiBase}/users/${userId}/promote-seller`, {
    method: "POST",
  });
}