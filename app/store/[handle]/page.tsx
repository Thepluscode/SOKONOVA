import Image from "next/image";
import { notFound } from "next/navigation";
import { getStorefrontByHandle } from "@/lib/api/storefront";
import { getSellerReviews } from "@/lib/api/reviews";
import { ProductCard } from "@/components/ProductCard";

export default async function StorefrontPage({
  params,
}: {
  params: { handle: string };
}) {
  const data = await getStorefrontByHandle(params.handle).catch(() => null);
  if (!data) return notFound();

  const { seller, products } = data;

  const reviewData = await getSellerReviews(params.handle).catch(() => ({
    reviews: [],
  }));
  const reviews = reviewData.reviews || [];

  return (
    <div className="mx-auto max-w-7xl w-full">
      {/* Banner / header */}
      <div className="relative w-full h-48 md:h-64 bg-muted">
        {seller.shopBannerUrl && (
          <Image
            src={seller.shopBannerUrl}
            alt={`${seller.shopName || seller.name} banner`}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      </div>

      {/* Seller info card overlaps banner */}
      <section className="-mt-12 md:-mt-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 shadow-card">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl bg-background border border-border relative overflow-hidden flex-shrink-0">
              {seller.shopLogoUrl ? (
                <Image
                  src={seller.shopLogoUrl}
                  alt={`${seller.shopName || seller.name} logo`}
                  fill
                  className="object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  {seller.shopName?.[0]?.toUpperCase() ||
                    seller.name?.[0]?.toUpperCase() ||
                    "S"}
                </div>
              )}
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <div className="text-xl font-semibold leading-tight break-words">
                {seller.shopName || seller.name}
              </div>

              {seller.city || seller.country ? (
                <div className="text-sm text-muted-foreground">
                  {seller.city ? `${seller.city}, ` : ""}
                  {seller.country || ""}
                </div>
              ) : null}

              {seller.shopBio && (
                <div className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {seller.shopBio}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-3">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {Number(seller.ratingAvg || 0).toFixed(1)}
                  </span>
                  <span>★</span>
                  <span>({seller.ratingCount || 0} reviews)</span>
                </div>
                <div className="text-muted-foreground">
                  @{seller.sellerHandle}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-xs text-muted-foreground sm:text-right">
              <div>Joined SokoNova</div>
              {/* could show seller.createdAt if you want to expose tenure */}
              <div className="text-[11px]">
                Trusted Seller • {seller.ratingCount || 0} sales+
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold tracking-tight mb-6">
            Products from {seller.shopName || seller.name}
          </h2>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              {"This shop hasn't listed any products yet."}
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
                    description: p.description,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews / social proof */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Recent Reviews
          </h2>

          {(!reviews || reviews.length === 0) ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No reviews yet. Be the first to order.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.slice(0, 4).map((r: any) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-border bg-card p-4 text-sm"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <div className="font-medium text-foreground">
                      {r.buyer?.name || r.buyer?.email || "Buyer"}
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-foreground font-semibold">
                        {r.rating}★
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm leading-relaxed text-foreground">
                    {r.comment}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
