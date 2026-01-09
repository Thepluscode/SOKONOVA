"use client";

import { useState } from "react";
import { openDispute } from "@/lib/api/disputes";
import { useSession } from "next-auth/react";

export function DisputeButtonClient({
  orderItemId,
}: {
  orderItemId: string;
}) {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState("NOT_DELIVERED");
  const [description, setDescription] = useState("");
  const [photoProofUrl, setPhotoProofUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function submit() {
    const userId = session?.user?.id;
    if (!userId) {
      setStatus("error");
      return;
    }
    try {
      await openDispute({
        buyerId: userId,
        orderItemId,
        reasonCode,
        description,
        photoProofUrl: photoProofUrl || undefined,
      });
      setStatus("sent");
    } catch (error) {
      console.error("Error opening dispute:", error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
        ✓ Issue reported. Our team will follow up.
      </div>
    );
  }

  return (
    <div className="text-xs">
      {!modalOpen ? (
        <button
          className="text-[11px] px-2 py-1 h-auto rounded-lg border border-border bg-background hover:bg-muted text-foreground"
          onClick={() => setModalOpen(true)}
        >
          Report a problem
        </button>
      ) : (
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <div className="text-[11px] font-semibold text-foreground">
            {"Tell us what's wrong"}
          </div>

          <select
            className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[11px] text-foreground"
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
          >
            <option value="NOT_DELIVERED">Never arrived</option>
            <option value="DAMAGED">Item arrived damaged</option>
            <option value="COUNTERFEIT">Counterfeit / fake</option>
            <option value="WRONG_ITEM">Wrong item</option>
            <option value="OTHER">Something else</option>
          </select>

          <textarea
            className="w-full rounded-lg border border-border bg-background px-2 py-1 h-16 text-[11px] text-foreground resize-none"
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[11px] text-foreground"
            placeholder="Photo proof URL (optional)"
            value={photoProofUrl}
            onChange={(e) => setPhotoProofUrl(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className="text-[11px] px-2 py-1 h-auto rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              onClick={submit}
            >
              Submit
            </button>
            <button
              className="text-[11px] px-2 py-1 h-auto rounded-lg border border-border bg-background hover:bg-muted text-foreground"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>

          {status === "error" && (
            <div className="text-red-500 dark:text-red-400 text-[10px]">
              Failed to submit. Please sign in or try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
