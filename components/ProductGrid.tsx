// components/ProductGrid.tsx
'use client';

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCard";

// Define the product type based on what the API returns
interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: string | number; // API might return string or number
  currency: string;
  imageUrl?: string;
  createdAt: string;
  category?: string;
}

// Define possible response types
type ProductsResponse = ApiProduct[] | { products: ApiProduct[] } | ApiProduct | null | undefined;

export function ProductGrid() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await getAllProducts();
        
        // Handle the case where response might be void
        if (response === undefined || response === null) {
          setProducts([]);
          return;
        }
        
        // Type guard to ensure we're working with the right data structure
        let productsArray: ApiProduct[] = [];
        
        if (Array.isArray(response)) {
          productsArray = response;
        } else if (typeof response === 'object') {
          // Check if response has a products property that is an array
          if ('products' in response && Array.isArray((response as any).products)) {
            productsArray = (response as any).products;
          } else if ('id' in response) {
            // If it looks like a single product object
            productsArray = [response as ApiProduct];
          }
        }
        
        setProducts(productsArray);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          p={{
            id: p.id,
            name: p.title,
            price: Number(p.price),
            currency: p.currency,
            image: p.imageUrl || "/mock-product.png",
            description: p.description,
          }}
        />
      ))}
    </div>
  );
}