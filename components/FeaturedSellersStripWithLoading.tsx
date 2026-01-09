"use client";

import { useState, useEffect } from "react";
import { getFeaturedSellers } from "@/lib/api/storefront";
import { FeaturedSellersStrip } from "@/components/FeaturedSellersStrip";

export function FeaturedSellersStripWithLoading({
  title = "Featured Sellers",
  autoScroll = false,
  autoScrollInterval = 5000,
  showIndicators = true,
  limit = 12,
}: {
  title?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showIndicators?: boolean;
  limit?: number;
}) {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSellers() {
      try {
        const data = await getFeaturedSellers(limit);
        setSellers(data);
      } catch (err) {
        setError('Failed to load featured sellers');
        console.error('Error loading featured sellers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSellers();
  }, [limit]);

  if (loading) {
    // Render skeleton loading state
    const skeletonSellers = Array.from({ length: 6 }).map((_, i) => ({
      id: `skeleton-${i}`,
      sellerHandle: null,
      shopName: null,
      shopLogoUrl: null,
      city: null,
      country: null,
      ratingAvg: null,
      ratingCount: null,
    }));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {skeletonSellers.map((_, i) => (
            <div key={i} className="w-[260px] rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl border border-border bg-muted animate-pulse flex-shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              <div className="mt-3 h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <FeaturedSellersStrip
      sellers={sellers.map(s => ({
        id: s.id,
        sellerHandle: s.sellerHandle,
        shopName: s.shopName,
        shopLogoUrl: s.shopLogoUrl,
        city: s.city,
        country: s.country,
        ratingAvg: s.ratingAvg,
        ratingCount: s.ratingCount,
      }))}
      title={title}
      autoScroll={autoScroll}
      autoScrollInterval={autoScrollInterval}
      showIndicators={showIndicators}
    />
  );
}