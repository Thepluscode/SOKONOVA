import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AnalyticsSellerService } from './analytics-seller.service';

@Controller('analytics/seller')
export class AnalyticsSellerController {
  constructor(private analytics: AnalyticsSellerService) {}

  // GET /analytics/seller/summary?sellerId=abc
  @Get('summary')
  async summary(@Query('sellerId') sellerId: string) {
    // TODO: auth: ensure sellerId === session.user.id OR role === ADMIN
    if (!sellerId) {
      throw new BadRequestException('sellerId query param is required');
    }
    return this.analytics.getSellerSummary(sellerId);
  }
}
