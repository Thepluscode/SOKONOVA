import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // GET /subscriptions/plans
  @Get('plans')
  async getSubscriptionPlans() {
    return this.subscriptionsService.getSubscriptionPlans();
  }

  // POST /subscriptions
  @Post()
  @UseGuards(JwtAuthGuard)
  async createSubscription(
    @Body() data: {
      userId: string;
      planId: string;
      paymentMethod: string;
    },
  ) {
    return this.subscriptionsService.createSubscription(data);
  }

  // GET /subscriptions/user/:userId
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getMySubscription(@Param('userId') userId: string) {
    return this.subscriptionsService.getMySubscription(userId);
  }

  // PUT /subscriptions/:id/cancel
  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(
    @Param('id') id: string,
    @Body() data: { userId: string },
  ) {
    return this.subscriptionsService.cancelSubscription(id, data.userId);
  }

  // GET /subscriptions/admin/all
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllSubscriptions(@Query('adminId') adminId: string) {
    return this.subscriptionsService.getAllSubscriptions(adminId);
  }

  // GET /subscriptions/admin/stats
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getSubscriptionStats(@Query('adminId') adminId: string) {
    return this.subscriptionsService.getSubscriptionStats(adminId);
  }
}