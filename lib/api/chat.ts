// lib/api/chat.ts
import { apiBase, apiFetch } from "./base";

/**
 * Ask a question about a product
 */
export async function askProductQuestion(userId: string, productId: string, question: string) {
  return apiFetch(`${apiBase}/chat/ask`, {
    method: "POST",
    body: JSON.stringify({ userId, productId, question }),
  });
}

/**
 * Compare products
 */
export async function compareProducts(userId: string, productIds: string[], question: string) {
  return apiFetch(`${apiBase}/chat/compare`, {
    method: "POST",
    body: JSON.stringify({ userId, productIds, question }),
  });
}