"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function CategoryStrip({
  categories,
  title = "Shop by Category",
  autoScroll = false,
  autoScrollInterval = 7000,
  showIndicators = true,
}: {
  categories: Array<{
    name: string;
    icon?: string;
    href: string;
    count?: number;
    avatars?: Array<{ id: string; shopLogoUrl?: string | null }>;
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

  // Calculate total pages
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
  }, [categories]);

  // Track current page
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

  // Auto-scroll
  useEffect(() => {
    if (!autoScroll || isPaused || totalPages <= 1) return;

    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const visibleWidth = el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextScroll = el.scrollLeft + visibleWidth;

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
    setTimeout(() => setIsPaused(false), 10000);
  };

  const scrollToPage = (page: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const visibleWidth = el.clientWidth;
    el.scrollTo({ left: page * visibleWidth, behavior: "smooth" });
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  if (!categories?.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        No categories available.
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
        aria-label="Categories"
        role="list"
        onMouseEnter={() => autoScroll && setIsPaused(true)}
        onMouseLeave={() => autoScroll && setIsPaused(false)}
        onTouchStart={() => autoScroll && setIsPaused(true)}
        onTouchEnd={() => autoScroll && setTimeout(() => setIsPaused(false), 3000)}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.03 * i }}
            className="snap-start shrink-0"
            role="listitem"
          >
            <Link
              href={cat.href}
              className="block w-[180px] rounded-2xl border border-border bg-card p-4 hover:shadow-card active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
            >
              <div className="flex flex-col items-center text-center gap-3">
                {cat.icon && (
                  <div className="text-4xl">{cat.icon}</div>
                )}
                <div>
                  <div className="text-sm font-semibold mb-1">{cat.name}</div>
                  {cat.count !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      {cat.count.toLocaleString()} items
                    </div>
                  )}
                </div>
              </div>

              {cat.avatars && cat.avatars.length > 0 && (
                <div className="mt-3 flex justify-center -space-x-2">
                  {cat.avatars.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="relative w-7 h-7 rounded-full border border-border bg-background overflow-hidden"
                    >
                      {s.shopLogoUrl ? (
                        <Image
                          src={s.shopLogoUrl}
                          alt="seller logo"
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full text-[9px] text-muted-foreground grid place-items-center font-medium">
                          SN
                        </div>
                      )}
                    </div>
                  ))}
                  {cat.avatars.length > 4 && (
                    <div className="relative w-7 h-7 rounded-full border border-border bg-muted grid place-items-center">
                      <span className="text-[9px] font-medium text-muted-foreground">
                        +{cat.avatars.length - 4}
                      </span>
                    </div>
                  )}
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
