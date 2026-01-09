// lib/api/productViews.ts
import { apiBase, apiFetch } from "./base";

/**
 * Track a product view for personalized recommendations
 */
export async function trackProductView(userId: string, productId: string) {
  return apiFetch(`${apiBase}/product-views`, {
    method: "POST",
    body: JSON.stringify({ userId, productId }),
  });
}