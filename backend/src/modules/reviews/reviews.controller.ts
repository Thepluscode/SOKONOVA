import { Body, Controller, Get, Param, Patch, Post, Delete, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  // BUYER: leave a review
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateReviewDto) {
    // TODO: enforce body.buyerId === session.user.id
    return this.reviews.createReview(body);
  }

  // Alias for backward compatibility
  @Post()
  @UseGuards(JwtAuthGuard)
  async createAlias(@Body() body: CreateReviewDto) {
    return this.reviews.createReview(body);
  }

  // PUBLIC: list storefront reviews
  // GET /reviews/seller/:handle
  @Get('seller/:handle')
  async listForSeller(@Param('handle') handle: string) {
    return this.reviews.listForSellerHandle(handle);
  }

  // PUBLIC: get product reviews
  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.reviews.getProductReviews(productId, pageNum, limitNum);
  }

  // PUBLIC: get product reviews summary
  @Get('product/:productId/summary')
  async getProductReviewsSummary(@Param('productId') productId: string) {
    return this.reviews.getProductReviewsSummary(productId);
  }

  // BUYER: get user's own reviews
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserReviews(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.reviews.getUserReviews(userId, pageNum, limitNum);
  }

  // ADMIN: get pending/hidden reviews
  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.reviews.getPendingReviews(pageNum, limitNum);
  }

  // BUYER: update own review
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { buyerId: string; rating?: number; comment?: string },
  ) {
    return this.reviews.updateReview(id, body.buyerId, {
      rating: body.rating,
      comment: body.comment,
    });
  }

  // BUYER: delete own review
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Body() body: { buyerId: string }) {
    return this.reviews.deleteReview(id, body.buyerId);
  }

  // ADMIN: hide abusive review
  @Patch(':id/hide')
  @UseGuards(JwtAuthGuard)
  async hide(@Param('id') reviewId: string, @Body() body: ModerateReviewDto) {
    return this.reviews.hideReview(reviewId, body);
  }
}
