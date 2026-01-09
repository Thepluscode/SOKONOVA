// lib/api/payments.ts
import { apiBase, apiFetch } from "./base";

export function createPaymentIntent(
  orderId: string,
  provider: "flutterwave" | "paystack" | "stripe"
) {
  return apiFetch(`${apiBase}/payments/intent`, {
    method: "POST",
    body: JSON.stringify({ orderId, provider }),
  });
}

export function getPaymentStatus(orderId: string) {
  return apiFetch(`${apiBase}/payments/${orderId}`);
}