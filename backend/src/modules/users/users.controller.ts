import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // /me endpoints - for current authenticated user
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser('id') userId: string) {
    return this.users.findOneById(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateCurrentUser(
    @CurrentUser('id') userId: string,
    @Body() body: { name?: string; city?: string; country?: string; phone?: string; bio?: string },
  ) {
    return this.users.updateUserProfile(userId, body);
  }

  @Post('me/password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    // TODO: Extract userId from JWT token and implement password change
    // TODO: Verify currentPassword and hash newPassword
    return { message: 'Password change endpoint - implementation pending' };
  }

  @Get('me/orders')
  @UseGuards(JwtAuthGuard)
  getCurrentUserOrders(@CurrentUser('id') userId: string) {
    return this.users.getBuyerProfile(userId).then(user => user?.orders || []);
  }

  @Get('me/wishlist')
  @UseGuards(JwtAuthGuard)
  getCurrentUserWishlist(@CurrentUser('id') userId: string) {
    return { message: 'Wishlist endpoint - use /wishlist/user/:userId directly' };
  }

  @Get('me/reviews')
  @UseGuards(JwtAuthGuard)
  getCurrentUserReviews(@CurrentUser('id') userId: string) {
    return { message: 'Reviews endpoint - use /reviews/user/:userId directly' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.users.findOneById(id);
  }

  @Get(':id/notification-preferences')
  @UseGuards(JwtAuthGuard)
  getNotificationPreferences(@Param('id') id: string) {
    return this.users.findOneById(id);
  }

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Param('id') id: string,
    @Body() body: { name?: string; city?: string; country?: string; phone?: string; bio?: string },
  ) {
    return this.users.updateUserProfile(id, body);
  }

  @Patch(':id/storefront')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  updateStorefrontProfile(
    @Param('id') id: string,
    @Body() body: { shopName?: string; shopLogoUrl?: string; shopBannerUrl?: string; shopBio?: string; sellerHandle?: string },
  ) {
    return this.users.updateSellerProfile(id, body);
  }

  @Patch(':id/notification-preferences')
  @UseGuards(JwtAuthGuard)
  updateNotificationPreferences(
    @Param('id') id: string,
    @Body() body: { notifyEmail?: boolean; notifySms?: boolean; notifyPush?: boolean },
  ) {
    return this.users.updateNotificationPreferences(id, body);
  }
}
