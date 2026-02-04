// lib/api/discovery.ts
import { apiBase, apiFetch } from "./base";

/**
 * PUBLIC: Get discovery highlights (categories + regions with featured sellers)
 */
export async function getDiscoveryHighlights() {
  return apiFetch(`${apiBase}/discovery/highlights`);
}

/**
 * AUTHENTICATED: Get personalized discovery for logged-in users
 */
export async function getPersonalizedDiscovery(userId: string) {
  return apiFetch(`${apiBase}/discovery/personalized?userId=${userId}`);
}

/**
 * PUBLIC: Get category page data (sellers + products for a category)
 */
export async function getCategoryPage(slug: string) {
  return apiFetch(`${apiBase}/discovery/by-category/${slug}`);
}

/**
 * PUBLIC: Get region page data (sellers + products for a region)
 */
export async function getRegionPage(regionSlug: string) {
  return apiFetch(`${apiBase}/discovery/by-region/${regionSlug}`);
}

/**
 * PUBLIC: Get social proof events
 */
export async function getSocialProof(limit = 6) {
  return apiFetch(`${apiBase}/discovery/social-proof?limit=${limit}`);
}
