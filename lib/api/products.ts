// lib/api/products.ts
import { apiBase, apiFetch } from "./base";

/**
 * PUBLIC: Get all products
 */
export async function getAllProducts() {
  return apiFetch(`${apiBase}/products`);
}

/**
 * PUBLIC: Get product by ID
 */
export async function getProductById(id: string) {
  return apiFetch(`${apiBase}/products/${id}`);
}

/**
 * PUBLIC: Get products by IDs
 */
export async function getProductsByIds(ids: string[]) {
  const idsQuery = ids.map(id => `ids=${id}`).join('&');
  return apiFetch(`${apiBase}/products?${idsQuery}`);
}

/**
 * SELLER: Get seller's products
 */
export async function getSellerProducts(sellerId: string) {
  return apiFetch(`${apiBase}/products?sellerId=${sellerId}`);
}

/**
 * SELLER: Create product
 */
export async function createProduct(
  sellerId: string,
  data: {
    title: string;
    description: string;
    price: number;
    currency?: string;
    imageUrl?: string;
    category?: string;
  }
) {
  return apiFetch(`${apiBase}/products`, {
    method: "POST",
    body: JSON.stringify({ ...data, sellerId }),
  });
}

/**
 * SELLER: Update product
 */
export async function updateProduct(
  id: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    imageUrl?: string;
    category?: string;
  }
) {
  return apiFetch(`${apiBase}/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * SELLER: Update inventory
 */
export async function updateInventory(
  productId: string,
  quantity: number
) {
  return apiFetch(`${apiBase}/products/${productId}/inventory`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}