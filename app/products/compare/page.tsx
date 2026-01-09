"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { compareProducts } from "@/lib/api/chat";
import { getProductsByIds } from "@/lib/api/products";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProductComparisonPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get product IDs from URL params
  const productIds = searchParams.get("ids")?.split(",") || [];

  // Fetch products
  useEffect(() => {
    if (productIds.length > 0) {
      fetchProducts();
    }
  }, [productIds]);

  const fetchProducts = async () => {
    try {
      const productsData = await getProductsByIds(productIds);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    }
  };

  const handleCompare = async () => {
    if (!session?.user?.id || productIds.length === 0) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await compareProducts(
        session.user.id, 
        productIds, 
        question || "Compare these products"
      );
      setComparison(response);
    } catch (err) {
      setError("Failed to compare products");
      console.error("Error comparing products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (productIds.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">No products to compare</h1>
        <p className="text-muted-foreground mt-2">
          {'Add products to compare using the "Compare" button on product pages.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Product Comparison</h1>
          <p className="text-muted-foreground mt-2">
            Comparing {productIds.length} products
          </p>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="border border-border rounded-lg p-4 bg-card"
            >
              <div className="relative aspect-square rounded-lg bg-muted overflow-hidden mb-3">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <h3 className="font-semibold line-clamp-2">{product.title}</h3>
              <p className="text-lg font-bold mt-1">
                {product.currency} {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Sold by {product.seller?.shopName || product.seller?.sellerHandle}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">AI Comparison</h2>
            <button
              onClick={handleCompare}
              disabled={isLoading || !session?.user?.id}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Comparing..." : "Compare Products"}
            </button>
          </div>
          
          {!session?.user?.id && (
            <div className="p-4 bg-warning/10 text-warning rounded-lg mb-4">
              <p>Please sign in to use the comparison assistant</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {comparison ? (
            <div className="p-6 bg-secondary rounded-lg">
              <p className="text-lg">{comparison.comparison}</p>
            </div>
          ) : (
            <div className="p-6 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">
                {'Click "Compare Products" to get an AI-powered comparison of these items'}
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a specific question about these products..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {'Examples: "Which is the best deal?", "Which has the highest quality?", "Which ships fastest?"'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
