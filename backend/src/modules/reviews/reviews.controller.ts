import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  // BUYER: leave a review
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateReviewDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.reviews.createReview({ ...body, buyerId: user.id });
  }

  // Alias for backward compatibility
  @Post()
  @UseGuards(JwtAuthGuard)
  async createAlias(
    @Body() body: CreateReviewDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.reviews.createReview({ ...body, buyerId: user.id });
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
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access other users');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.reviews.getUserReviews(userId, pageNum, limitNum);
  }

  // ADMIN: get pending/hidden reviews
  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
    @Body() body: { buyerId?: string; rating?: number; comment?: string },
    @CurrentUser() user: { id: string },
  ) {
    return this.reviews.updateReview(id, user.id, {
      rating: body.rating,
      comment: body.comment,
    });
  }

  // BUYER: delete own review
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Body() body: { buyerId?: string },
    @CurrentUser() user: { id: string },
  ) {
    return this.reviews.deleteReview(id, user.id);
  }

  // ADMIN: hide abusive review
  @Patch(':id/hide')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async hide(@Param('id') reviewId: string, @Body() body: ModerateReviewDto) {
    return this.reviews.hideReview(reviewId, body);
  }
}
