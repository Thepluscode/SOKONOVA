import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryPage } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCategoryPage(params.slug).catch(() => null);
  if (!data) return notFound();

  const { slug, sellers, products } = data;

  // human label from slug
  const prettyLabelMap: Record<string, string> = {
    fashion: "Fashion & Style",
    beauty: "Beauty & Personal Care",
    home: "Home & Living",
    electronics: "Electronics & Gadgets",
  };
  const label = prettyLabelMap[slug] || slug;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{label}</h1>
        <p className="text-muted-foreground text-sm">
          Top independent sellers for {label}.
        </p>
      </header>

      {/* Top Sellers */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Featured Sellers</h2>

        {sellers.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No sellers in this category yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellers.map((s: any) => (
              <Link
                key={s.id}
                href={`/store/${s.sellerHandle}`}
                className="rounded-2xl border border-border bg-card p-4 flex gap-4 hover:shadow-card transition-shadow"
              >
                <div className="relative w-14 h-14 rounded-xl border border-border bg-background overflow-hidden flex-shrink-0">
                  {s.shopLogoUrl ? (
                    <Image
                      src={s.shopLogoUrl}
                      alt={s.shopName || s.sellerHandle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                      {(s.shopName || s.sellerHandle || "S")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <div className="font-medium leading-tight">
                    {s.shopName || s.sellerHandle}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.city || s.country || "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="font-semibold text-foreground">
                      {(s.ratingAvg ?? 0).toFixed(1)}★
                    </span>
                    <span>({s.ratingCount ?? 0})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Products */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Latest Products</h2>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Nothing listed yet.
          </div>
        ) : (
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
                  description: p.seller?.shopName || p.seller?.sellerHandle,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
