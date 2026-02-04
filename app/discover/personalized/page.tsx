import Image from "next/image";
import Link from "next/link";
import { getPersonalizedDiscovery } from "@/lib/api/discovery";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PersonalizedDiscoveryPage() {
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/discover/personalized");
  }
  
  const userId = session.user.id;
  const data = await getPersonalizedDiscovery(userId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Recommended for You
        </h1>
        <p className="text-muted-foreground text-sm">
          Personalized recommendations based on your interests and shopping behavior
        </p>
      </header>

      {/* Recommended for You */}
      {data.recommendedForYou && data.recommendedForYou.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">Recommended for You</h2>
          <div className="grid gap-8">
            {data.recommendedForYou.map((categoryData: any) => (
              <div key={categoryData.category} className="space-y-4">
                <h3 className="text-xl font-medium capitalize">
                  {categoryData.category} Recommendations
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryData.products.slice(0, 6).map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending in Your City */}
      {data.trendingInYourCity && data.trendingInYourCity.categories.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">
            Trending in {data.trendingInYourCity.city}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.trendingInYourCity.categories.map((category: string) => (
              <Link
                key={category}
                href={`/discover/category/${category}`}
                className="px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Because You Viewed */}
      {data.becauseYouViewed && data.becauseYouViewed.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Because You Viewed</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.becauseYouViewed.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Popular in Your Area */}
      {data.popularInYourArea && data.popularInYourArea.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Popular in Your Area</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.popularInYourArea.slice(0, 6).map((seller: any) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 hover:shadow-card transition-shadow"
    >
      <div className="relative aspect-square rounded-xl bg-muted overflow-hidden">
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
      <div className="space-y-1">
        <h3 className="font-medium line-clamp-2">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {product.currency} {product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{product.seller.shopName || product.seller.sellerHandle}</span>
          </div>
        </div>
        {product.seller.ratingAvg && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-yellow-500">★</span>
            <span>{product.seller.ratingAvg.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({product.seller.ratingCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function SellerCard({ seller }: { seller: any }) {
  return (
    <Link
      href={`/store/${seller.sellerHandle}`}
      className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 hover:shadow-card transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full border border-border bg-background overflow-hidden flex-shrink-0">
          {seller.shopLogoUrl ? (
            <Image
              src={seller.shopLogoUrl}
              alt={seller.shopName || seller.sellerHandle}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
              {(seller.shopName || seller.sellerHandle || "S")[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{seller.shopName || seller.sellerHandle}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {seller.city}, {seller.country}
          </p>
        </div>
      </div>
      {seller.ratingAvg && (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{seller.ratingAvg.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({seller.ratingCount} reviews)
          </span>
        </div>
      )}
    </Link>
  );
}
