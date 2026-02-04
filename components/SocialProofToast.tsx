"use client";

import { useEffect, useMemo, useState } from "react";
import { getSocialProof } from "@/lib/api/discovery";

type SocialProofEvent = {
  id: string;
  userName: string;
  userLocation: string;
  productName: string;
  action: "purchased" | "reviewed" | "wishlisted";
  timeAgo: string;
};

const ACTION_COPY: Record<SocialProofEvent["action"], string> = {
  purchased: "just purchased",
  reviewed: "just reviewed",
  wishlisted: "added to wishlist",
};

const ACTION_ICON: Record<SocialProofEvent["action"], string> = {
  purchased: "ri-shopping-bag-line",
  reviewed: "ri-star-line",
  wishlisted: "ri-heart-line",
};

export function SocialProofToast() {
  const [events, setEvents] = useState<SocialProofEvent[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getSocialProof(6);
        if (mounted) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load social proof:", error);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % events.length);
        setVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  const event = useMemo(() => events[index], [events, index]);

  if (!event) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-sm rounded-lg border border-border bg-background/95 shadow-xl backdrop-blur transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <i className={ACTION_ICON[event.action]} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{event.userName}</span>{" "}
            <span className="text-muted-foreground">from</span>{" "}
            <span className="font-medium">{event.userLocation}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {ACTION_COPY[event.action]}{" "}
            <span className="font-medium text-foreground">{event.productName}</span>
          </p>
          <p className="text-xs text-muted-foreground">{event.timeAgo}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Dismiss"
        >
          <i className="ri-close-line" />
        </button>
      </div>
    </div>
  );
}
