// lib/api/orders.ts
import { apiBase, apiFetch } from "./base";

export function createOrder(
  cartId: string,
  userId: string,
  total: number,
  currency: string,
  shippingAdr?: string
) {
  const u = new URLSearchParams({ cartId });
  return apiFetch(`${apiBase}/orders/create?${u.toString()}`, {
    method: "POST",
    body: JSON.stringify({ userId, total, currency, shippingAdr }),
  });
}