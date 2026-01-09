import Image from "next/image";
import Link from "next/link";
import { getDiscoveryHighlights } from "@/lib/api/discovery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import React from "react";

// Define proper types for the data
interface Seller {
  id: string;
  shopName?: string;
  sellerHandle?: string;
  city?: string;
  country?: string;
  shopLogoUrl?: string;
}

interface Category {
  slug: string;
  label: string;
  sellers: Seller[];
}

interface Region {
  slug: string;
  label: string;
  sellers: Seller[];
}

interface DiscoveryData {
  categories: Category[];
  regions: Region[];
}

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions);
  const data: DiscoveryData = await getDiscoveryHighlights();
  const { categories, regions } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Discover on SokoNova
            </h1>
            <p className="text-muted-foreground text-sm">
              Shop by category and by city. Support real local sellers.
            </p>
          </div>
          {session?.user && (
            <Link 
              href="/discover/personalized"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Personalized
            </Link>
          )}
        </div>
      </header>

      {/* Shop by category */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-medium">Shop by Category</h2>
          <div className="text-xs text-muted-foreground">
            Fashion • Home • Beauty • Electronics
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </section>

      {/* Shop by city / region */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-medium">Shop by City</h2>
          <div className="text-xs text-muted-foreground">
            Lagos • Nairobi • Accra
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((reg) => (
            <RegionCard key={reg.slug} reg={reg} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Card for category with mini seller list
function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/discover/category/${cat.slug}`}
      className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-4 hover:shadow-card transition-shadow"
    >
      <div>
        <div className="text-sm font-semibold">{cat.label}</div>
        <div className="text-[11px] text-muted-foreground">
          Top sellers in {cat.label}
        </div>
      </div>

      <div className="flex -space-x-3">
        {cat.sellers.slice(0, 4).map((s) => (
          <div
            key={s.id}
            className="relative w-10 h-10 rounded-full border border-border bg-background overflow-hidden flex-shrink-0"
            title={s.shopName || s.sellerHandle || ""}
          >
            {s.shopLogoUrl ? (
              <Image
                src={s.shopLogoUrl}
                alt={s.shopName || s.sellerHandle || ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                {(s.shopName || s.sellerHandle || "S")[0]?.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[11px] text-muted-foreground line-clamp-2">
        {cat.sellers.slice(0, 2).map((s, i) => (
          <span key={s.id}>
            {i > 0 ? " • " : ""}
            {s.shopName || s.sellerHandle} ({s.city || s.country})
          </span>
        ))}
      </div>
    </Link>
  );
}

// Card for region with featured sellers
function RegionCard({ reg }: { reg: Region }) {
  return (
    <Link
      href={`/discover/region/${reg.slug}`}
      className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-4 hover:shadow-card transition-shadow"
    >
      <div>
        <div className="text-sm font-semibold">{reg.label}</div>
        <div className="text-[11px] text-muted-foreground">
          Local sellers near you
        </div>
      </div>

      <div className="flex -space-x-3">
        {reg.sellers.slice(0, 4).map((s) => (
          <div
            key={s.id}
            className="relative w-10 h-10 rounded-full border border-border bg-background overflow-hidden flex-shrink-0"
            title={s.shopName || s.sellerHandle || ""}
          >
            {s.shopLogoUrl ? (
              <Image
                src={s.shopLogoUrl}
                alt={s.shopName || s.sellerHandle || ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                {(s.shopName || s.sellerHandle || "S")[0]?.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[11px] text-muted-foreground line-clamp-2">
        {reg.sellers.slice(0, 2).map((s, i) => (
          <span key={s.id}>
            {i > 0 ? " • " : ""}
            {s.shopName || s.sellerHandle} ({s.city || s.country})
          </span>
        ))}
      </div>
    </Link>
  );
}