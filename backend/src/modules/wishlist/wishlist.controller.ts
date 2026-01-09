import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

interface AddToWishlistDto {
  userId: string;
  productId: string;
}

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /**
   * Get all wishlist items for a user
   * GET /wishlist/user/:userId
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getUserWishlist(userId);
  }

  /**
   * Add item to wishlist
   * POST /wishlist
   * Body: { userId, productId }
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async addToWishlist(@Body() body: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(body.userId, body.productId);
  }

  /**
   * Remove wishlist item by ID
   * DELETE /wishlist/:itemId
   */
  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  async removeById(@Param('itemId') itemId: string) {
    return this.wishlistService.removeById(itemId);
  }

  /**
   * Remove specific product from user's wishlist
   * DELETE /wishlist/user/:userId/product/:productId
   */
  @Delete('user/:userId/product/:productId')
  @UseGuards(JwtAuthGuard)
  async removeByUserAndProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeByUserAndProduct(userId, productId);
  }

  /**
   * Clear all wishlist items for a user
   * DELETE /wishlist/user/:userId/clear
   */
  @Delete('user/:userId/clear')
  @UseGuards(JwtAuthGuard)
  async clearWishlist(@Param('userId') userId: string) {
    return this.wishlistService.clearWishlist(userId);
  }

  /**
   * Check if product is in user's wishlist
   * GET /wishlist/user/:userId/check/:productId
   */
  @Get('user/:userId/check/:productId')
  @UseGuards(JwtAuthGuard)
  async checkInWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.checkInWishlist(userId, productId);
  }
}
