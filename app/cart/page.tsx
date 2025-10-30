
"use client";

import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function CartPage() {
  const { items, remove, clear } = useCart();

  const total = items.reduce((sum, line) => {
    const priceNum = Number(line.product?.price ?? 0);
    return sum + priceNum * line.qty;
  }, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border p-6 bg-card">
          Your cart is empty.{" "}
          <Link href="/" className="underline">
            Continue shopping
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((line, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border border-border p-4 bg-card"
            >
              <div>
                <div className="font-medium">
                  {line.product?.title || line.productId}
                </div>
                <div className="text-sm text-muted-foreground">
                  Qty {line.qty}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="font-medium">
                  {line.product?.currency ?? "USD"}{" "}
                  {(Number(line.product?.price ?? 0) * line.qty).toFixed(2)}
                </div>
                <Button variant="ghost" onClick={() => remove(line.productId)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="text-lg">Total</div>
            <div className="text-xl font-semibold">{total.toFixed(2)}</div>
          </div>

          <div className="flex gap-3">
            <Link href="/checkout">
              <Button>Proceed to Checkout</Button>
            </Link>
            <Button variant="ghost" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
