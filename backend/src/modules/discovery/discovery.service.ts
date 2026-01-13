import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService) { }

  async getDiscoveryHighlights() {
    // Get trending products based on views
    const trendingProducts = await this.prisma.product.findMany({
      take: 10,
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });

    // Get featured sellers
    const featuredSellers = await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
        products: {
          some: {},
        },
      },
      take: 5,
      orderBy: {
        ratingAvg: 'desc',
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // Get new arrivals
    const newArrivals = await this.prisma.product.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        seller: {
          select: {
            shopName: true,
          },
        },
      },
    });

    // Get community stories
    const communityStories = await this.prisma.communityStory.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            shopName: true,
          },
        },
        product: {
          select: {
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      trendingProducts,
      featuredSellers,
      newArrivals,
      communityStories,
    };
  }

  async getProductsByCategory(slug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: slug,
      },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
    });

    return products;
  }

  async getProductsByRegion(regionSlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        seller: {
          country: regionSlug,
        },
      },
      include: {
        seller: {
          select: {
            shopName: true,
            country: true,
            ratingAvg: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
    });

    return products;
  }

  async searchProducts(filters: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    country?: string;
    sellerId?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }) {
    const page = filters.page ? Math.max(parseInt(filters.page, 10), 1) : 1;
    const limit = filters.limit ? Math.min(parseInt(filters.limit, 10), 50) : 20;
    const skip = (page - 1) * limit;

    const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;
    const rating = filters.rating ? Number(filters.rating) : undefined;
    const inStock = filters.inStock === 'true';

    const where: any = {
      ...(filters.category
        ? { category: { contains: filters.category, mode: 'insensitive' } }
        : {}),
      ...(filters.sellerId ? { sellerId: filters.sellerId } : {}),
      ...(filters.country
        ? { seller: { country: { equals: filters.country, mode: 'insensitive' } } }
        : {}),
      ...(rating ? { ratingAvg: { gte: rating } } : {}),
      ...(inStock ? { inventory: { quantity: { gt: 0 } } } : {}),
      ...(minPrice || maxPrice
        ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
        : {}),
    };

    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { category: { contains: filters.q, mode: 'insensitive' } },
        { seller: { shopName: { contains: filters.q, mode: 'insensitive' } } },
      ];
    }

    const orderBy = (() => {
      switch (filters.sort) {
        case 'newest':
          return { createdAt: 'desc' as const };
        case 'price_asc':
          return { price: 'asc' as const };
        case 'price_desc':
          return { price: 'desc' as const };
        case 'rating':
          return { ratingAvg: 'desc' as const };
        case 'popular':
          return { ratingCount: 'desc' as const };
        case 'trending':
        default:
          return { views: { _count: 'desc' as const } };
      }
    })();

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              shopName: true,
              ratingAvg: true,
              ratingCount: true,
              country: true,
            },
          },
          inventory: {
            select: {
              quantity: true,
            },
          },
          _count: {
            select: {
              views: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // PUBLIC: Get category page data (sellers + products for a category)
  async getCategoryPage(slug: string) {
    // Get top-rated sellers in this category
    const topSellers = await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
        products: {
          some: {
            category: slug,
          },
        },
      },
      orderBy: [
        { ratingAvg: 'desc' },
        { ratingCount: 'desc' },
      ],
      include: {
        _count: {
          select: {
            products: {
              where: {
                category: slug,
              },
            },
          },
        },
      },
      take: 12,
    });

    // Get latest products in this category
    const products = await this.prisma.product.findMany({
      where: {
        category: slug,
      },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 24,
    });

    return {
      sellers: topSellers,
      products,
    };
  }

  // PUBLIC: Get region page data (sellers + products for a region)
  async getRegionPage(regionSlug: string) {
    // Get top-rated sellers in this region
    const topSellers = await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
        country: regionSlug,
        products: {
          some: {},
        },
      },
      orderBy: [
        { ratingAvg: 'desc' },
        { ratingCount: 'desc' },
      ],
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: 12,
    });

    // Get latest products in this region
    const products = await this.prisma.product.findMany({
      where: {
        seller: {
          country: regionSlug,
        },
      },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
            ratingCount: true,
            country: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 24,
    });

    return {
      sellers: topSellers,
      products,
    };
  }

  // AUTHENTICATED: Get personalized discovery for logged-in users
  async getPersonalizedDiscovery(userId: string) {
    // Get user's city for location-based recommendations
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        city: true,
        country: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 1. Recommended for You - Based on browsing history and purchase history
    const userProductViews = await this.prisma.productView.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    // Extract category preferences from viewed products
    const viewedProductIds = userProductViews.map(view => view.productId);
    const viewedProducts = await this.prisma.product.findMany({
      where: { id: { in: viewedProductIds } },
      select: { category: true },
    });

    // Count category frequencies
    const categoryCount: Record<string, number> = {};
    viewedProducts.forEach(product => {
      if (product.category) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      }
    });

    // Get top 3 categories
    const topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    // Get recommended products for each category
    const recommendedForYou = await Promise.all(
      topCategories.map(async (category) => {
        const products = await this.prisma.product.findMany({
          where: {
            category,
            id: { notIn: viewedProductIds }, // Exclude already viewed products
          },
          include: {
            seller: {
              select: {
                shopName: true,
                ratingAvg: true,
                ratingCount: true,
              },
            },
            _count: {
              select: {
                views: true,
              },
            },
          },
          orderBy: [
            { seller: { ratingAvg: 'desc' } },
            { seller: { ratingCount: 'desc' } },
            { views: { _count: 'desc' } },
          ],
          take: 10,
        });

        return { category, products };
      })
    );

    // 2. Trending in Your City - Based on recent product views in user's city
    const recentCityViews = await this.prisma.productView.findMany({
      where: {
        product: {
          seller: {
            city: user.city,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    // Get trending categories in user's city
    const cityViewedProductIds = recentCityViews.map(view => view.productId);
    const cityViewedProducts = await this.prisma.product.findMany({
      where: { id: { in: cityViewedProductIds } },
      select: { category: true },
    });

    const cityCategoryCount: Record<string, number> = {};
    cityViewedProducts.forEach(product => {
      if (product.category) {
        cityCategoryCount[product.category] = (cityCategoryCount[product.category] || 0) + 1;
      }
    });

    const trendingInYourCity = {
      city: user.city,
      categories: Object.entries(cityCategoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category]) => category),
    };

    // 3. Because You Viewed - Collaborative filtering based on similar users
    const becauseYouViewed = await this.getCollaborativeRecommendations(userId, viewedProductIds);

    // 4. Popular in Your Area - Top-rated sellers in user's city
    const popularInYourArea = await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
        city: user.city,
        products: {
          some: {},
        },
      },
      orderBy: [
        { ratingAvg: 'desc' },
        { ratingCount: 'desc' },
      ],
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: 10,
    });

    return {
      recommendedForYou,
      trendingInYourCity,
      becauseYouViewed,
      popularInYourArea,
    };
  }

  // Helper method for collaborative filtering recommendations
  private async getCollaborativeRecommendations(userId: string, viewedProductIds: string[]) {
    // Find users who viewed similar products
    const similarUserViews = await this.prisma.productView.findMany({
      where: {
        productId: { in: viewedProductIds },
        userId: { not: userId }, // Exclude current user
      },
    });

    // Count how many similar products each user viewed
    const userSimilarity: Record<string, number> = {};
    similarUserViews.forEach(view => {
      userSimilarity[view.userId] = (userSimilarity[view.userId] || 0) + 1;
    });

    // Get top 5 similar users
    const similarUsers = Object.entries(userSimilarity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId]) => userId);

    if (similarUsers.length === 0) {
      // If no similar users, return trending products
      return this.getTrendingProducts(10);
    }

    // Get products viewed by similar users but not by current user
    const similarUserProductViews = await this.prisma.productView.findMany({
      where: {
        userId: { in: similarUsers },
        productId: { notIn: viewedProductIds },
      },
    });

    // Count product frequencies
    const productCount: Record<string, number> = {};
    similarUserProductViews.forEach(view => {
      productCount[view.productId] = (productCount[view.productId] || 0) + 1;
    });

    // Get top products
    const recommendedProductIds = Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([productId]) => productId);

    // Fetch product details
    const products = await this.prisma.product.findMany({
      where: { id: { in: recommendedProductIds } },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: [
        { seller: { ratingAvg: 'desc' } },
        { seller: { ratingCount: 'desc' } },
        { views: { _count: 'desc' } },
      ],
    });

    return products;
  }

  // Helper method to get trending products
  private async getTrendingProducts(limit: number) {
    return this.prisma.product.findMany({
      take: limit,
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });
  }
}
