import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  // 1. Buyer leaves a review for an item they've received
  async createReview(dto: CreateReviewDto) {
    // Get order item
    const oi = await this.prisma.orderItem.findUnique({
      where: { id: dto.orderItemId },
      include: {
        order: true,
      },
    });
    if (!oi) throw new NotFoundException('Order item not found');

    // Buyer must be the owner of the order
    if (oi.order.userId !== dto.buyerId) {
      throw new ForbiddenException('Not your order item');
    }

    // Only allow review if delivered
    if (oi.fulfillmentStatus !== 'DELIVERED') {
      throw new BadRequestException('Item not delivered yet');
    }

    // Disallow duplicate review for same item/buyer
    const existing = await this.prisma.review.findFirst({
      where: {
        orderItemId: dto.orderItemId,
        buyerId: dto.buyerId,
      },
    });
    if (existing) {
      throw new BadRequestException('Already reviewed');
    }

    // Create review with related data for notifications
    const review = await this.prisma.review.create({
      data: {
        orderItemId: dto.orderItemId,
        buyerId: dto.buyerId,
        sellerId: oi.sellerId, // stored on OrderItem
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        orderItem: {
          include: {
            product: {
              select: {
                title: true,
              },
            },
          },
        },
        buyer: {
          select: {
            name: true,
          },
        },
      },
    });

    // Recompute seller rating summary (avg, count)
    await this.recomputeSellerRating(oi.sellerId);

    // Notify seller: new review received
    try {
      await this.notifications.notifyNewReview(
        oi.sellerId,
        review.id,
        review.orderItem.product.title,
        review.rating,
        review.buyer.name || 'A customer',
      );
    } catch (error) {
      this.logger.error(`Failed to send review notification: ${error.message}`);
    }

    return review;
  }

  // 2. Public storefront reviews
  //    load by sellerHandle
  async listForSellerHandle(handle: string, limit = 20) {
    // get seller by handle
    const seller = await this.prisma.user.findFirst({
      where: {
        sellerHandle: handle,
        role: { in: ['SELLER', 'ADMIN'] },
      },
      select: {
        id: true,
        sellerHandle: true,
        shopName: true,
        name: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });
    if (!seller) throw new NotFoundException('Seller not found');

    const reviews = await this.prisma.review.findMany({
      where: {
        sellerId: seller.id,
        isVisible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      seller: {
        id: seller.id,
        handle: seller.sellerHandle,
        displayName: seller.shopName || seller.name,
        ratingAvg: seller.ratingAvg || 0,
        ratingCount: seller.ratingCount || 0,
      },
      reviews,
    };
  }

  // 3. Admin hide review
  async hideReview(reviewId: string, dto: ModerateReviewDto) {
    const admin = await this.prisma.user.findUnique({
      where: { id: dto.adminId },
    });
    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    const rev = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!rev) throw new NotFoundException('Review not found');

    // Hide the review
    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        isVisible: false,
      },
    });

    // Update rating summary (if you want to exclude hidden reviews)
    await this.recomputeSellerRating(updated.sellerId);

    return updated;
  }

  // Helper: recompute seller.ratingAvg / ratingCount
  private async recomputeSellerRating(sellerId: string) {
    // use only visible reviews
    const agg = await this.prisma.review.groupBy({
      by: ['sellerId'],
      where: {
        sellerId,
        isVisible: true,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const avg = agg[0]?._avg.rating ?? 0;
    const count = agg[0]?._count.rating ?? 0;

    await this.prisma.user.update({
      where: { id: sellerId },
      data: {
        ratingAvg: avg,
        ratingCount: count,
      },
    });
  }
}
