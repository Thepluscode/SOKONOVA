// lib/api/landing.ts
import { apiBase, apiFetch } from "./base";

/**
 * Get trending products for homepage
 */
export async function getTrendingProducts(limit = 8) {
  try {
    return await apiFetch(`${apiBase}/products/trending?limit=${limit}`);
  } catch (error: unknown) {
    return [];
  }
}
