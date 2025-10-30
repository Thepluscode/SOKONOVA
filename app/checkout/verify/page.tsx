"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

/**
 * Payment Verification Page
 *
 * This page handles the redirect back from PSP (Paystack/Flutterwave)
 * after payment is completed.
 *
 * The PSP will redirect here with query parameters:
 * - Paystack: ?reference=xxx&trxref=xxx&status=success
 * - Flutterwave: ?tx_ref=xxx&transaction_id=xxx&status=successful
 *
 * The actual payment verification happens via webhook on the backend.
 * This page just polls the order status to show feedback to the user.
 */
export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "checking" | "success" | "failed" | "error"
  >("checking");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get orderId from sessionStorage (set before redirect)
    const pendingOrderId = sessionStorage.getItem("pendingOrderId");
    if (pendingOrderId) {
      setOrderId(pendingOrderId);
    }

    // Get status from query params
    const psStatus = searchParams?.get("status");
    const reference = searchParams?.get("reference") || searchParams?.get("tx_ref");

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found");
      return;
    }

    // Check if PSP indicates success
    if (psStatus === "success" || psStatus === "successful") {
      // Poll backend to confirm payment was marked as SUCCEEDED
      pollPaymentStatus(pendingOrderId);
    } else if (psStatus === "cancelled" || psStatus === "failed") {
      setStatus("failed");
      setMessage("Payment was cancelled or failed");
    } else {
      // Unknown status, still try to poll
      pollPaymentStatus(pendingOrderId);
    }
  }, [searchParams]);

  const pollPaymentStatus = async (orderId: string | null) => {
    if (!orderId) {
      setStatus("error");
      setMessage("Order ID not found");
      return;
    }

    // Poll backend for up to 30 seconds
    let attempts = 0;
    const maxAttempts = 15;
    const interval = 2000; // 2 seconds

    const poll = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/payments/${orderId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payment status");
        }

        const payment = await res.json();

        if (payment.status === "SUCCEEDED") {
          setStatus("success");
          setMessage("Payment successful! Your order has been confirmed.");
          sessionStorage.removeItem("pendingOrderId");
          return;
        }

        if (payment.status === "FAILED") {
          setStatus("failed");
          setMessage("Payment failed. Please try again.");
          return;
        }

        // Still pending, try again
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        } else {
          setStatus("error");
          setMessage(
            "Payment verification timed out. Please check your order status or contact support."
          );
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
        setStatus("error");
        setMessage(
          "Error verifying payment. Please check your order status or contact support."
        );
      }
    };

    poll();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl border border-border p-8 bg-card">
        {status === "checking" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h1 className="text-2xl font-semibold mb-2">
              Verifying Payment...
            </h1>
            <p className="text-muted-foreground mb-4">
              Please wait while we confirm your payment.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono text-xs">{orderId}</span>
              </p>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 text-green-500">✓</div>
            <h1 className="text-2xl font-semibold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">
                Order ID: <span className="font-mono text-xs">{orderId}</span>
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href={`/orders/${orderId}`}>View Order</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 text-red-500">✗</div>
            <h1 className="text-2xl font-semibold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">
                Order ID: <span className="font-mono text-xs">{orderId}</span>
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/checkout">Try Again</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold mb-2">
              Verification Error
            </h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">
                Order ID: <span className="font-mono text-xs">{orderId}</span>
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
