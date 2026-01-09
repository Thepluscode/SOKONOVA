// lib/api/storefront.ts
import { apiBase, apiFetch } from "./base";

/**
 * PUBLIC: Get storefront by seller handle
 */
export async function getStorefrontByHandle(sellerHandle: string) {
  return apiFetch(`${apiBase}/storefront/handle/${sellerHandle}`);
}

/**
 * Seller: Update storefront profile
 */
export function updateStorefront(
  userId: string,
  data: {
    shopName?: string;
    sellerHandle?: string;
    shopLogoUrl?: string;
    shopBannerUrl?: string;
    shopBio?: string;
    country?: string;
    city?: string;
  }
) {
  return apiFetch(`${apiBase}/users/${userId}/storefront`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Get featured sellers for homepage
 */
export async function getFeaturedSellers(limit = 6) {
  try {
    return await apiFetch(`${apiBase}/storefront/featured?limit=${limit}`);
  } catch (error: unknown) {
    // Fallback: get top-rated sellers
    try {
      return await apiFetch(
        `${apiBase}/users?role=SELLER&sortBy=rating&limit=${limit}`
      );
    } catch (fallbackError: unknown) {
      return [];
    }
  }
}