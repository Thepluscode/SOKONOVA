// components/ProductGrid.tsx
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export async function ProductGrid() {
  const data = await getProducts();
  // backend returns an array of products
  const products = Array.isArray(data) ? data : data.products || data;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p: any) => (
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
