import { getTrendingProducts } from "@/lib/api/landing";
import { getFeaturedSellers } from "@/lib/api/storefront";
import { PageReveal, FadeUp, MotionCard, StaggerContainer, StaggerItem } from "@/components/ux/motion";
import { TrendingProductsStripWithLoading } from "@/components/TrendingProductsStripWithLoading";
import { FeaturedSellersStripWithLoading } from "@/components/FeaturedSellersStripWithLoading";
import { CategoryStrip } from "@/components/CategoryStrip";
import { FeaturedSellersSkeleton } from "@/components/FeaturedSellersSkeleton";
import Link from "next/link";
import { ShoppingBag, MapPin, Users, Sparkles } from "lucide-react";
import { CATEGORIES, CITIES } from "@/lib/config";

export const metadata = {
  title: "SokoNova - Africa's Premier Marketplace",
  description: "Discover trending products, local sellers, and shop from trusted vendors across Africa. Join the revolution in online shopping.",
};

export default async function Home() {
  // Fetch data in parallel
  const [trendingProducts, featuredSellers] = await Promise.all([
    getTrendingProducts(8),
    getFeaturedSellers(12),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <PageReveal>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          {/* Ambient decoration */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
            <StaggerContainer>
              <div className="max-w-3xl">
                <StaggerItem>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    {"Africa's Premier Marketplace"}
                  </span>
                </StaggerItem>

                <StaggerItem>
                  <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    Discover <span className="text-primary">Unique</span> Products from Local Sellers
                  </h1>
                </StaggerItem>

                <StaggerItem>
                  <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
                    Connect with trusted vendors across Africa. Shop trending items, support local businesses, and enjoy fast, reliable delivery.
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/discover"
                      className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                      Start Shopping
                    </Link>
                    <Link
                      href="/sell/apply"
                      className="px-8 py-3.5 bg-background text-foreground border border-border rounded-xl font-semibold hover:bg-muted transition-colors"
                    >
                      Become a Seller
                    </Link>
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>
      </PageReveal>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <FadeUp>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Trending Products</h2>
              <p className="text-muted-foreground mt-1">Popular items our community loves</p>
            </div>
            <Link href="/products" className="text-primary font-semibold hover:underline hidden sm:inline-block">
              View all →
            </Link>
          </div>
        </FadeUp>

        <TrendingProductsStripWithLoading
          limit={8}
          title=""
          autoScroll={true}
          showIndicators={true}
        />
      </section>

      {/* Shop by Category */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Explore thousands of products across popular categories</p>
            </div>
          </FadeUp>

          <CategoryStrip
            categories={CATEGORIES}
            title=""
            autoScroll={true}
            showIndicators={true}
          />
        </div>
      </section>

      {/* Shop by City */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Shop by City</h2>
            <p className="text-muted-foreground mt-2">Connect with local sellers in major African cities</p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CITIES.slice(0, 12).map((city, i) => (
            <FadeUp key={city.name}>
              <Link
                href={city.href}
                className="group flex flex-col items-center p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-semibold text-center group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {city.sellers.toLocaleString()} sellers
                </p>
              </Link>
            </FadeUp>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Explore all regions →
          </Link>
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <FadeUp>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Sellers</h2>
              <p className="text-muted-foreground mt-1">Trusted vendors with top ratings</p>
            </div>
            <Link href="/discover" className="text-primary font-semibold hover:underline hidden sm:inline-block">
              View all →
            </Link>
          </div>
        </FadeUp>

        <FeaturedSellersStripWithLoading
          limit={12}
          title=""
          autoScroll={true}
          showIndicators={true}
        />
      </section>

      {/* Trust Indicators */}
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">10,000+ Products</h3>
                <p className="text-sm text-muted-foreground mt-1">From local sellers across Africa</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">500+ Sellers</h3>
                <p className="text-sm text-muted-foreground mt-1">Verified and rated by customers</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">100% Secure</h3>
                <p className="text-sm text-muted-foreground mt-1">Safe payments and fast delivery</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}