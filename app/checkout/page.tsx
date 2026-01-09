'use client'

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/api/orders";
import { createPaymentIntent } from "@/lib/api/payments";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, cartId, clear } = useCart();
  const [status, setStatus] = useState<
    "idle" | "processing" | "payment_initiated" | "paid" | "error"
  >("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    provider: "flutterwave" as "flutterwave" | "paystack" | "stripe",
  });

  // Calculate cart total
  const total = items.reduce((sum, line) => {
    const priceNum = Number(line.product?.price ?? 0);
    return sum + priceNum * line.qty;
  }, 0);

  const placeOrder = async () => {
    const userId = session?.user?.id;
    if (!cartId || !userId) {
      setStatus("error");
      return;
    }

    setStatus("processing");
    try {
      // Step 1: Create order in backend with status=PENDING
      const newOrder = await createOrder(
        cartId,
        userId,
        total,
        "USD",
        `${formData.address}, ${formData.city}`
      );

      setOrderId(newOrder.id);

      // Step 2: Request a payment intent from backend
      const payment = await createPaymentIntent(
        newOrder.id,
        formData.provider
      );

      setPaymentInfo(payment);
      setStatus("payment_initiated");

      // Step 3: Clear the cart (order now holds those items)
      await clear();

      // Step 4: Redirect to PSP checkout
      // For Paystack/Flutterwave, redirect to their hosted checkout page
      if (payment.checkoutUrl) {
        // Store orderId in sessionStorage for verification page
        sessionStorage.setItem("pendingOrderId", newOrder.id);
        window.location.href = payment.checkoutUrl;
        return;
      }

      // For Stripe, you would use Elements UI here
      // This requires additional client-side setup with Stripe.js
      if (payment.clientSecret) {
        // For now, show message to implement Stripe Elements
        alert(
          "Stripe requires Elements UI integration. Please implement Stripe Elements for production."
        );
        return;
      }

      // Fallback: no redirect URL provided (shouldn't happen in production)
      throw new Error("No checkout URL or client secret provided");
    } catch (error) {
      console.error("Checkout error:", error);
      setStatus("error");
    }
  };

  if (items.length === 0 && status === "idle") {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
        <div className="rounded-2xl border border-border p-6 bg-card">
          Your cart is empty.{" "}
          <Link href="/" className="underline">
            Continue shopping
          </Link>
          .
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
        <div className="rounded-2xl border border-border p-6 bg-card">
          Please{" "}
          <Link href="/auth/signin" className="underline">
            sign in
          </Link>{" "}
          to complete your purchase.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      {status === "paid" ? (
        <div className="rounded-2xl border border-border p-6 bg-card space-y-4">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-2">
              Payment Successful!
            </h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your order. Your order ID is:{" "}
              <span className="font-mono text-sm">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      ) : status === "payment_initiated" ? (
        <div className="rounded-2xl border border-border p-6 bg-card space-y-4">
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h2 className="text-2xl font-semibold mb-2">
              Processing Payment...
            </h2>
            <p className="text-muted-foreground mb-4">
              Order ID: <span className="font-mono text-sm">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Payment Reference:{" "}
              <span className="font-mono text-xs">
                {paymentInfo?.externalRef}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              In production, you would be redirected to {formData.provider} to
              complete payment.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border p-6 bg-card space-y-6">
          {/* Order Summary */}
          <div className="pb-4 border-b border-border">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <div className="space-y-2">
              {items.map((line, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {line.product?.title || line.productId} × {line.qty}
                  </span>
                  <span className="font-medium">
                    ${(Number(line.product?.price ?? 0) * line.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>${total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Shipping Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="rounded-xl border border-border bg-background px-3 py-2"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
              <input
                className="rounded-xl border border-border bg-background px-3 py-2"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                className="rounded-xl border border-border bg-background px-3 py-2"
                placeholder="Street Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <input
                className="rounded-xl border border-border bg-background px-3 py-2"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Payment Provider Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["flutterwave", "paystack", "stripe"] as const).map(
                (provider) => (
                  <button
                    key={provider}
                    type="button"
                    className={`rounded-xl border-2 px-4 py-3 text-center capitalize transition-colors ${
                      formData.provider === provider
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, provider })}
                  >
                    {provider}
                  </button>
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              In production, this will redirect to {formData.provider} for
              secure payment processing.
            </p>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={placeOrder}
            disabled={
              status === "processing" ||
              !formData.fullName ||
              !formData.address ||
              !formData.city
            }
            className="w-full"
          >
            {status === "processing" ? "Creating Order..." : "Place Order"}
          </Button>

          {status === "error" && (
            <div className="text-red-600 p-3 rounded-lg bg-red-50 dark:bg-red-950">
              Order creation failed. Please try again or contact support.
            </div>
          )}

          {/* Info Notice */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>Demo Mode:</strong> This is a demonstration of the payment
            flow. In production:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Order is created with status PENDING</li>
              <li>Payment intent is initiated with {formData.provider}</li>
              <li>You are redirected to PSP checkout page</li>
              <li>PSP sends webhook to confirm payment</li>
              <li>Order status changes to PAID</li>
              <li>Fulfillment process begins</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}