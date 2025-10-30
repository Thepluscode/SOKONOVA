import { getTrendingProducts, getFeaturedSellers } from "@/lib/api";
import { PageReveal, FadeUp, MotionCard, StaggerContainer, StaggerItem } from "@/components/ux/motion";
import { TrendingProductsStrip } from "@/components/TrendingProductsStrip";
import { CategoryStrip } from "@/components/CategoryStrip";
import { FeaturedSellersStrip } from "@/components/FeaturedSellersStrip";
import { FeaturedSellersSkeleton } from "@/components/FeaturedSellersSkeleton";
import Link from "next/link";
import { ShoppingBag, MapPin, Users } from "lucide-react";

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

  const categories = [
    { name: "Electronics", icon: "📱", count: 1240, href: "/products?category=electronics" },
    { name: "Fashion", icon: "👗", count: 2890, href: "/products?category=fashion" },
    { name: "Home & Living", icon: "🏠", count: 1567, href: "/products?category=home" },
    { name: "Beauty", icon: "💄", count: 892, href: "/products?category=beauty" },
    { name: "Sports", icon: "⚽", count: 743, href: "/products?category=sports" },
    { name: "Food & Drinks", icon: "🍕", count: 456, href: "/products?category=food" },
  ];

  const cities = [
    { name: "Lagos", country: "Nigeria", sellers: 342, href: "/sellers?city=lagos" },
    { name: "Nairobi", country: "Kenya", sellers: 278, href: "/sellers?city=nairobi" },
    { name: "Accra", country: "Ghana", sellers: 156, href: "/sellers?city=accra" },
    { name: "Johannesburg", country: "South Africa", sellers: 224, href: "/sellers?city=johannesburg" },
    { name: "Cairo", country: "Egypt", sellers: 198, href: "/sellers?city=cairo" },
    { name: "Addis Ababa", country: "Ethiopia", sellers: 134, href: "/sellers?city=addis-ababa" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <PageReveal>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          {/* Ambient decoration */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 md:py-20 z-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-4 sm:space-y-5">
                <FadeUp>
                  <span className="inline-block rounded-full border border-primary/20 px-3 py-1 text-[11px] sm:text-xs text-primary font-medium">
                    Africa&apos;s Premier Marketplace
                  </span>
                </FadeUp>

                <FadeUp delay={0.1}>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                    Shop local. <span className="text-primary">Shine global.</span>
                  </h1>
                </FadeUp>

                <FadeUp delay={0.2}>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                    Discover products from trusted sellers across Africa. Find unique items, support local businesses, and enjoy seamless transactions.
                  </p>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <div className="flex flex-col xs:flex-row gap-3 pt-2">
                    <Link
                      href="/products"
                      className="btn-primary w-full xs:w-auto active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
                      Start Shopping
                    </Link>
                    <Link
                      href="/register?role=seller"
                      className="btn-secondary w-full xs:w-auto active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
                      Become a Seller
                    </Link>
                  </div>
                </FadeUp>
              </div>

              {/* Hero visual */}
              <div className="hidden md:block rounded-[24px] border border-border bg-card/70 backdrop-blur-md h-80 lg:h-96 shadow-card" />
            </div>
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

        <TrendingProductsStrip
          products={trendingProducts}
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
            categories={categories}
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

        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <StaggerItem key={city.name}>
                <MotionCard>
                  <Link
                    href={city.href}
                    className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{city.country}</p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{city.sellers}</span> sellers
                        </div>
                      </div>
                    </div>
                  </Link>
                </MotionCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Featured Sellers */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Sellers</h2>
                <p className="text-muted-foreground mt-1">Verified vendors with excellent ratings</p>
              </div>
              <Link href="/sellers" className="text-primary font-semibold hover:underline hidden sm:inline-block">
                View all →
              </Link>
            </div>
          </FadeUp>

          {featuredSellers.length > 0 ? (
            <FeaturedSellersStrip
              sellers={featuredSellers}
              title=""
              autoScroll={true}
              showIndicators={true}
            />
          ) : (
            <FeaturedSellersSkeleton items={12} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SokoNova</h3>
              <p className="text-sm text-muted-foreground">
                Africa&apos;s premier marketplace connecting buyers and sellers across the continent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/products?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
                <li><Link href="/products?category=fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
                <li><Link href="/sellers" className="hover:text-primary transition-colors">Sellers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sell</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register?role=seller" className="hover:text-primary transition-colors">Become a Seller</Link></li>
                <li><Link href="/seller/dashboard" className="hover:text-primary transition-colors">Seller Dashboard</Link></li>
                <li><Link href="/help/selling" className="hover:text-primary transition-colors">Selling Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SokoNova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
