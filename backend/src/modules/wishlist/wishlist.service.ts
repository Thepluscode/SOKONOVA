import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all wishlist items for a user
   * GET /wishlist/user/:userId
   */
  async getUserWishlist(userId: string) {
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                sellerHandle: true,
                shopLogoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    return wishlistItems;
  }

  /**
   * Add item to wishlist
   * POST /wishlist
   * Body: { userId, productId }
   */
  async addToWishlist(userId: string, productId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    // Add to wishlist
    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                sellerHandle: true,
                shopLogoUrl: true,
              },
            },
          },
        },
      },
    });

    return wishlistItem;
  }

  /**
   * Remove wishlist item by ID
   * DELETE /wishlist/:itemId
   */
  async removeById(itemId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from wishlist' };
  }

  /**
   * Remove specific product from user's wishlist
   * DELETE /wishlist/user/:userId/product/:productId
   */
  async removeByUserAndProduct(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not in wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    });

    return { message: 'Product removed from wishlist' };
  }

  /**
   * Clear all wishlist items for a user
   * DELETE /wishlist/user/:userId/clear
   */
  async clearWishlist(userId: string) {
    const result = await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });

    return {
      message: 'Wishlist cleared',
      deletedCount: result.count,
    };
  }

  /**
   * Check if product is in user's wishlist
   * GET /wishlist/user/:userId/check/:productId
   */
  async checkInWishlist(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return {
      inWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem?.id || null,
    };
  }
}
