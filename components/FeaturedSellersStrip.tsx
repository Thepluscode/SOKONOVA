"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturedSellersStrip({
  sellers,
  title = "Featured Sellers",
  autoScroll = false,
  autoScrollInterval = 5000,
  showIndicators = true,
}: {
  sellers: Array<{
    id: string;
    sellerHandle: string | null;
    shopName: string | null;
    shopLogoUrl?: string | null;
    city?: string | null;
    country?: string | null;
    ratingAvg?: number | null;
    ratingCount?: number | null;
  }>;
  title?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showIndicators?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate total pages based on visible width
  useEffect(() => {
    const calculatePages = () => {
      const el = scrollerRef.current;
      if (!el) return;

      const visibleWidth = el.clientWidth;
      const scrollWidth = el.scrollWidth;
      const pages = Math.ceil(scrollWidth / visibleWidth);
      setTotalPages(pages);
    };

    calculatePages();
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [sellers]);

  // Track current page on scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const visibleWidth = el.clientWidth;
      const page = Math.round(scrollLeft / visibleWidth);
      setCurrentPage(page);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || isPaused || totalPages <= 1) return;

    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const visibleWidth = el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextScroll = el.scrollLeft + visibleWidth;

      // Loop back to start if at the end
      if (nextScroll >= maxScroll) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: visibleWidth, behavior: "smooth" });
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, isPaused, totalPages]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -Math.min(480, el.clientWidth) : Math.min(480, el.clientWidth);
    el.scrollBy({ left: delta, behavior: "smooth" });
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  };

  const scrollToPage = (page: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const visibleWidth = el.clientWidth;
    el.scrollTo({ left: page * visibleWidth, behavior: "smooth" });
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  if (!sellers?.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        No featured sellers yet.
      </div>
    );
  }

  return (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="hidden sm:flex gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy("left")}
            className="btn-ghost border rounded-xl px-3 py-2 text-xs hover:bg-card active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
          >
            ←
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy("right")}
            className="btn-ghost border rounded-xl px-3 py-2 text-xs hover:bg-card active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 pb-2"
        aria-label="Featured sellers"
        role="list"
        onMouseEnter={() => autoScroll && setIsPaused(true)}
        onMouseLeave={() => autoScroll && setIsPaused(false)}
        onTouchStart={() => autoScroll && setIsPaused(true)}
        onTouchEnd={() => autoScroll && setTimeout(() => setIsPaused(false), 3000)}
      >
        {sellers.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.03 * i }}
            className="snap-start shrink-0"
            role="listitem"
          >
            <Link
              href={`/store/${s.sellerHandle ?? s.id}`}
              className="block w-[260px] rounded-2xl border border-border bg-card p-4 hover:shadow-card active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl border border-border bg-background overflow-hidden flex-shrink-0">
                  {s.shopLogoUrl ? (
                    <Image
                      src={s.shopLogoUrl}
                      alt={`${s.shopName ?? s.sellerHandle ?? "Seller"} logo`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-[10px] font-medium text-muted-foreground">
                      SN
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {s.shopName || s.sellerHandle || "Seller"}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {s.city ? `${s.city}${s.country ? ", " + s.country : ""}` : s.country || "—"}
                  </div>
                </div>
              </div>

              {(s.ratingAvg !== null && s.ratingAvg !== undefined) && (
                <div className="mt-3 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {s.ratingAvg.toFixed(1)}★
                  </span>{" "}
                  {s.ratingCount !== null && s.ratingCount !== undefined && `(${s.ratingCount})`}
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Indicator Dots */}
      {showIndicators && totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Carousel pages">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-label={`Go to page ${i + 1}`}
              aria-selected={currentPage === i}
              onClick={() => scrollToPage(i)}
              className={`h-1.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-primary/40 ${
                currentPage === i
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
