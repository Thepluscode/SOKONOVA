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

  constructor(private prisma: PrismaService) {}

  async createReview(data: {
    orderItemId: string;
    buyerId: string;
    sellerId?: string;
    productId?: string;
    rating: number;
    comment: string;
  }) {
    // Fetch orderItem to get sellerId and productId if not provided
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: data.orderItemId },
      include: { product: true },
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    const review = await this.prisma.review.create({
      data: {
        orderItemId: data.orderItemId,
        buyerId: data.buyerId,
        sellerId: data.sellerId || orderItem.sellerId,
        productId: data.productId || orderItem.productId,
        rating: data.rating,
        comment: data.comment,
        isVisible: true,
      },
    });

    return review;
  }

  async getSellerReviews(handle: string, limit = 10) {
    const reviews = await this.prisma.review.findMany({
      where: {
        seller: {
          sellerHandle: handle,
        },
        isVisible: true,
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
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return reviews;
  }

  // Alias for compatibility
  async listForSellerHandle(handle: string, limit = 10) {
    return this.getSellerReviews(handle, limit);
  }

  async hideReview(id: string, body?: ModerateReviewDto) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { isVisible: false },
    });

    return review;
  }

  async getProductReviews(productId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          productId,
          isVisible: true,
        },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
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
          productId,
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

  async getProductReviewsSummary(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        isVisible: true,
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    const ratingDistribution = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  }

  async updateReview(
    id: string,
    buyerId: string,
    data: { rating?: number; comment?: string },
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.buyerId !== buyerId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        rating: data.rating ?? review.rating,
        comment: data.comment ?? review.comment,
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
          },
        },
      },
    });

    return updated;
  }

  async deleteReview(id: string, buyerId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.buyerId !== buyerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Review deleted successfully' };
  }

  async getUserReviews(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          buyerId: userId,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              sellerHandle: true,
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
          buyerId: userId,
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

  async getPendingReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          isVisible: false,
        },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              sellerHandle: true,
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
          isVisible: false,
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
