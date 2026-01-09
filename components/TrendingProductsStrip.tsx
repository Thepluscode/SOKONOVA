"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";

const shimmerBase64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNlNGU2ZWIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNnKSIvPgo8L3N2Zz4K";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image: string;
};

export function TrendingProductsStrip({
  products,
  title = "Trending Products",
  autoScroll = false,
  autoScrollInterval = 6000,
  showIndicators = true,
  renderSkeleton = false,
}: {
  products: Product[];
  title?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showIndicators?: boolean;
  renderSkeleton?: boolean;
}) {
  const { add } = useCart();
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
  }, [products]);

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

  if (!products?.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        No trending products yet.
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
        aria-label="Trending products"
        role="list"
        onMouseEnter={() => autoScroll && setIsPaused(true)}
        onMouseLeave={() => autoScroll && setIsPaused(false)}
        onTouchStart={() => autoScroll && setIsPaused(true)}
        onTouchEnd={() => autoScroll && setTimeout(() => setIsPaused(false), 3000)}
      >
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.03 * i }}
            className="snap-start shrink-0"
            role="listitem"
          >
            <div className="group w-[200px] rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card active:scale-[.99] transition-all">
              {renderSkeleton ? (
                <div className="aspect-square bg-muted animate-pulse" />
              ) : (
                <Link href={`/products/${p.id}`}>
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={shimmerBase64}
                    />
                  </div>
                </Link>
              )}
              <div className="p-3">
                {renderSkeleton ? (
                  <>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {p.name}
                    </div>
                    <div className="text-sm font-semibold">${p.price.toFixed(2)}</div>
                  </>
                )}
              </div>
              {!renderSkeleton && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => add(p.id, 1)}
                    className="w-full text-xs font-medium bg-primary text-primary-foreground py-1.5 rounded-lg hover:opacity-90 active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
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
