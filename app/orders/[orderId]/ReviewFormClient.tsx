"use client";

import { useState } from "react";
import { submitReview } from "@/lib/api/reviews";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function ReviewFormClient({
  orderItemId,
  canReview = true,
}: {
  orderItemId: string;
  canReview?: boolean;
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
      <div className="text-green-600 dark:text-green-400 text-[11px] font-medium">
        ✓ Review submitted. Thank you!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="text-lg"
            onClick={() => setRating(star)}
          >
            {star <= rating ? "★" : "☆"}
          </button>
        ))}
      </div>

      <textarea
        className="w-full rounded-lg border border-border bg-background px-2 py-1 h-16 text-[11px] text-foreground resize-none"
        placeholder="Share your experience with this item..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button
        className="text-[11px] h-auto py-1 px-2"
        onClick={async () => {
          const userId = session?.user?.id;
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