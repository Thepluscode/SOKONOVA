// lib/api/reviews.ts
import { apiBase, apiFetch, handle } from "./base";

/**
 * Buyer: Submit a review for a delivered item
 */
export async function submitReview(data: {
  buyerId: string;
  orderItemId: string;
  rating: number;
  comment: string;
}) {
  const res = await apiFetch(`${apiBase}/reviews/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handle(res);
}

/**
 * PUBLIC: Get reviews for a seller's storefront
 */
export async function getSellerReviews(sellerHandle: string) {
  try {
    const res = await apiFetch(`${apiBase}/reviews/seller/${sellerHandle}`);
    return await handle(res);
  } catch (error: unknown) {
    // do not hard-crash storefront if no reviews yet
    return { seller: null, reviews: [] };
  }
}