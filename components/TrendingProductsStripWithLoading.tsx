"use client";

import { useState, useEffect } from "react";
import { getTrendingProducts } from "@/lib/api/landing";
import { TrendingProductsStrip } from "@/components/TrendingProductsStrip";
import { ProductCardSkeleton } from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image: string;
};

export function TrendingProductsStripWithLoading({
  title = "Trending Products",
  autoScroll = false,
  autoScrollInterval = 6000,
  showIndicators = true,
  limit = 8,
}: {
  title?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showIndicators?: boolean;
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getTrendingProducts(limit);
        setProducts(data);
      } catch (err) {
        setError('Failed to load trending products');
        console.error('Error loading trending products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [limit]);

  if (loading) {
    // Render skeleton loading state
    const skeletonProducts: Product[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `skeleton-${i}`,
      name: "",
      price: 0,
      image: "",
    }));

    return (
      <TrendingProductsStrip
        products={skeletonProducts}
        title={title}
        autoScroll={false}
        showIndicators={false}
        renderSkeleton={true}
      />
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
    <TrendingProductsStrip
      products={products.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        currency: p.currency,
        image: p.image || "/mock-product.png",
      }))}
      title={title}
      autoScroll={autoScroll}
      autoScrollInterval={autoScrollInterval}
      showIndicators={showIndicators}
    />
  );
}
