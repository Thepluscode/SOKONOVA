"use client";

import { useState } from "react";
import { submitReview } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function ReviewFormClient({
  orderItemId,
  canReview,
}: {
  orderItemId: string;
  canReview: boolean; // true if fulfillmentStatus === DELIVERED
}) {
  const { data: session } = useSession();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  if (!canReview) {
    return null;
  }

  if (status === "sent") {
    return (
      <div className="text-[11px] text-green-600 dark:text-green-400 font-medium">
        ✓ Thanks for your review!
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3 text-[11px] space-y-2">
      <div className="font-semibold text-[11px]">Rate this item</div>

      <div className="flex items-center gap-2">
        <label>Rating</label>
        <select
          className="rounded-lg border border-border bg-background px-2 py-1 text-[11px]"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full rounded-lg border border-border bg-background px-2 py-1 h-16 text-[11px]"
        placeholder="How was the quality, delivery, packaging?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button
        className="text-[11px] h-auto py-1 px-2"
        onClick={async () => {
          const userId = (session?.user as any)?.id;
          if (!userId) {
            setStatus("error");
            return;
          }
          try {
            await submitReview({
              buyerId: userId,
              orderItemId,
              rating,
              comment,
            });
            setStatus("sent");
          } catch {
            setStatus("error");
          }
        }}
      >
        Submit review
      </Button>

      {status === "error" && (
        <div className="text-red-500 text-[10px]">
          Could not submit review. Please sign in or check if item is
          delivered.
        </div>
      )}
    </div>
  );
}
