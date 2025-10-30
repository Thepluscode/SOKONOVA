import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService) {}

  async getStorefrontByHandle(handle: string) {
    // 1. Find seller account by handle
    const seller = await this.prisma.user.findFirst({
      where: {
        sellerHandle: handle,
        role: { in: ['SELLER', 'ADMIN'] }, // prevent buyers with random handle
      },
      select: {
        id: true,
        name: true,
        shopName: true,
        sellerHandle: true,
        shopLogoUrl: true,
        shopBannerUrl: true,
        shopBio: true,
        country: true,
        city: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });

    if (!seller) {
      throw new NotFoundException('Storefront not found');
    }

    // 2. Fetch public products for this seller
    const products = await this.prisma.product.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        imageUrl: true,
        createdAt: true,
        inventory: {
          select: { quantity: true },
        },
      },
    });

    return {
      seller,
      products,
    };
  }
}
