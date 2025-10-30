import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  // BUYER: leave a review
  @Post('create')
  async create(@Body() body: CreateReviewDto) {
    // TODO: enforce body.buyerId === session.user.id
    return this.reviews.createReview(body);
  }

  // PUBLIC: list storefront reviews
  // GET /reviews/seller/:handle
  @Get('seller/:handle')
  async listForSeller(@Param('handle') handle: string) {
    return this.reviews.listForSellerHandle(handle);
  }

  // ADMIN: hide abusive review
  @Patch(':id/hide')
  async hide(@Param('id') reviewId: string, @Body() body: ModerateReviewDto) {
    return this.reviews.hideReview(reviewId, body);
  }
}
