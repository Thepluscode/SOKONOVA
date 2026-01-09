// lib/api/social.ts
import { apiBase, apiFetch } from "./base";

/**
 * PUBLIC: Get community stories
 */
export async function getCommunityStories(limit: number = 10) {
  return apiFetch(`${apiBase}/social/stories/community?limit=${limit}`);
}

/**
 * AUTHENTICATED: Create community story
 */
export async function createCommunityStory(
  userId: string,
  productId: string,
  content: string,
  imageUrl?: string
) {
  return apiFetch(`${apiBase}/social/stories`, {
    method: "POST",
    body: JSON.stringify({ userId, productId, content, imageUrl }),
  });
}

/**
 * PUBLIC: Get influencer storefronts
 */
export async function getInfluencerStorefronts(limit: number = 10) {
  return apiFetch(`${apiBase}/social/influencers/storefronts?limit=${limit}`);
}

/**
 * PUBLIC: Get influencer storefront by handle
 */
export async function getInfluencerStorefront(handle: string) {
  return apiFetch(`${apiBase}/social/influencers/${handle}/storefront`);
}