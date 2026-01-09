import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService) {}

  async getSellerByHandle(handle: string) {
    const seller = await this.prisma.user.findFirst({
      where: {
        sellerHandle: handle,
        role: 'SELLER',
      },
      select: {
        id: true,
        shopName: true,
        shopLogoUrl: true,
        shopBannerUrl: true,
        bio: true, // Changed from shopBio to bio
        ratingAvg: true,
        ratingCount: true,
        country: true,
        city: true,
        products: {
          take: 12,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: {
              select: {
                views: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return seller;
  }

  async getFeaturedSellers(limit = 10) {
    const sellers = await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
        products: {
          some: {},
        },
      },
      select: {
        id: true,
        shopName: true,
        shopLogoUrl: true,
        ratingAvg: true,
        ratingCount: true,
        country: true,
        products: {
          take: 3,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: {
              select: {
                views: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: {
        ratingAvg: 'desc',
      },
    });

    return sellers;
  }

  async getAllSellers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [sellers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          role: 'SELLER',
        },
        select: {
          id: true,
          sellerHandle: true,
          shopName: true,
          shopLogoUrl: true,
          ratingAvg: true,
          ratingCount: true,
          country: true,
          city: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: {
          role: 'SELLER',
        },
      }),
    ]);

    return {
      sellers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSellerById(id: string) {
    const seller = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'SELLER',
      },
      select: {
        id: true,
        sellerHandle: true,
        shopName: true,
        shopLogoUrl: true,
        shopBannerUrl: true,
        bio: true,
        ratingAvg: true,
        ratingCount: true,
        country: true,
        city: true,
        products: {
          take: 12,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: {
              select: {
                views: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return seller;
  }

  async getSellerProducts(handle: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const seller = await this.prisma.user.findFirst({
      where: {
        sellerHandle: handle,
        role: 'SELLER',
      },
      select: {
        id: true,
      },
    });

    if (!seller) {
      return null;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          sellerId: seller.id,
        },
        include: {
          _count: {
            select: {
              views: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({
        where: {
          sellerId: seller.id,
        },
      }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSellerReviews(handle: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const seller = await this.prisma.user.findFirst({
      where: {
        sellerHandle: handle,
        role: 'SELLER',
      },
      select: {
        id: true,
      },
    });

    if (!seller) {
      return null;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          sellerId: seller.id,
          isVisible: true,
        },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.review.count({
        where: {
          sellerId: seller.id,
          isVisible: true,
        },
      }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}