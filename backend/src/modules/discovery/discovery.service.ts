import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Helper: Simple featured categories we care about right now:
const FEATURED_CATEGORIES = [
  { slug: "fashion", label: "Fashion & Style" },
  { slug: "beauty", label: "Beauty & Personal Care" },
  { slug: "home", label: "Home & Living" },
  { slug: "electronics", label: "Electronics & Gadgets" },
];

// Helper: Regions we want to highlight. We'll use seller city first.
const FEATURED_REGIONS = [
  { slug: "lagos", label: "Lagos, Nigeria", city: "Lagos" },
  { slug: "nairobi", label: "Nairobi, Kenya", city: "Nairobi" },
  { slug: "accra", label: "Accra, Ghana", city: "Accra" },
];

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService) {}

  // Called by /discovery/highlights
  // Returns featured categories (with hero sellers) and featured regions (with hero sellers)
  async getHighlights() {
    // For each category, get top sellers with products in that category
    const categoriesWithSellers = await Promise.all(
      FEATURED_CATEGORIES.map(async (cat) => {
        const sellers = await this.topSellersForCategory(cat.slug, 4);
        return {
          ...cat,
          sellers,
        };
      })
    );

    // For each region, get top sellers in that region
    const regionsWithSellers = await Promise.all(
      FEATURED_REGIONS.map(async (reg) => {
        const sellers = await this.topSellersForRegion(reg.city, 4);
        return {
          ...reg,
          sellers,
        };
      })
    );

    return {
      categories: categoriesWithSellers,
      regions: regionsWithSellers,
    };
  }

  // Page data for /discover/category/:slug
  async getCategoryPage(slug: string) {
    // 1. Sellers active in this category
    const sellers = await this.topSellersForCategory(slug, 12);

    // 2. Some hero products in that category
    const products = await this.prisma.product.findMany({
      where: { category: slug },
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        imageUrl: true,
        seller: {
          select: {
            sellerHandle: true,
            shopName: true,
            city: true,
            country: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
    });

    return {
      slug,
      sellers,
      products,
    };
  }

  // Page data for /discover/region/:regionSlug
  // We'll map regionSlug ('lagos') -> city:'Lagos'
  async getRegionPage(regionSlug: string) {
    const regionDef = FEATURED_REGIONS.find(
      (r) => r.slug.toLowerCase() === regionSlug.toLowerCase()
    );
    if (!regionDef) {
      return {
        region: {
          slug: regionSlug,
          label: regionSlug,
        },
        sellers: [],
        products: [],
      };
    }

    const city = regionDef.city;

    // Sellers in that city
    const sellers = await this.topSellersForRegion(city, 12);

    // Products from sellers in that city
    const products = await this.prisma.product.findMany({
      where: {
        seller: {
          city: city,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        imageUrl: true,
        category: true,
        seller: {
          select: {
            sellerHandle: true,
            shopName: true,
            city: true,
            country: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
    });

    return {
      region: regionDef,
      sellers,
      products,
    };
  }

  // --- helper methods ---

  // Pick "top sellers" for category:
  // Sellers who have products in that category, ordered by ratingAvg / ratingCount
  private async topSellersForCategory(categorySlug: string, limit: number) {
    // find distinct sellerIds with products in that category
    const rows = await this.prisma.product.findMany({
      where: { category: categorySlug },
      select: {
        sellerId: true,
        seller: {
          select: {
            id: true,
            sellerHandle: true,
            shopName: true,
            shopLogoUrl: true,
            city: true,
            country: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
      take: 200,
    });

    // dedupe sellers
    const bySeller: Record<string, any> = {};
    for (const row of rows) {
      if (!bySeller[row.sellerId]) {
        bySeller[row.sellerId] = row.seller;
      }
    }

    // rank: higher ratingAvg first, then ratingCount
    const sellers = Object.values(bySeller)
      .sort((a: any, b: any) => {
        const ar = a.ratingAvg ?? 0;
        const br = b.ratingAvg ?? 0;
        if (br !== ar) return br - ar;
        const ac = a.ratingCount ?? 0;
        const bc = b.ratingCount ?? 0;
        return bc - ac;
      })
      .slice(0, limit);

    return sellers;
  }

  // Pick "top sellers" for region:
  // Sellers with matching city, sorted by rating
  private async topSellersForRegion(city: string, limit: number) {
    const sellers = await this.prisma.user.findMany({
      where: {
        role: { in: ['SELLER', 'ADMIN'] },
        city: city,
      },
      select: {
        id: true,
        sellerHandle: true,
        shopName: true,
        shopLogoUrl: true,
        city: true,
        country: true,
        ratingAvg: true,
        ratingCount: true,
      },
      orderBy: [
        { ratingAvg: 'desc' },
        { ratingCount: 'desc' },
        { createdAt: 'asc' }, // older sellers first if tie
      ],
      take: limit,
    });

    return sellers;
  }
}
