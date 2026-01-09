import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AnalyticsSellerService } from './analytics-seller.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics/seller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER, Role.ADMIN)
export class AnalyticsSellerController {
  constructor(private readonly analyticsService: AnalyticsSellerService) {}

  // GET /analytics/seller/:sellerId/profitability
  @Get(':sellerId/profitability')
  async getProfitability(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getProfitabilityMetrics(sellerId);
  }

  // GET /analytics/seller/:sellerId/orders
  @Get(':sellerId/orders')
  async getOrdersWithFees(
    @Param('sellerId') sellerId: string,
    @Query('limit') limit: string,
  ) {
    const limitNum = parseInt(limit) || 50;
    return this.analyticsService.getOrdersWithFeeBreakdown(sellerId, limitNum);
  }

  // POST /analytics/seller/:sellerId/simulate-pricing
  @Post(':sellerId/simulate-pricing')
  async simulatePricing(
    @Param('sellerId') sellerId: string,
    @Body() scenario: {
      feeChange?: number;
      bundleDiscount?: number;
      productId?: string;
    },
  ) {
    return this.analyticsService.simulatePricingScenario(sellerId, scenario);
  }

  // GET /analytics/seller/:sellerId/inventory-velocity
  @Get(':sellerId/inventory-velocity')
  async getInventoryVelocity(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getInventoryVelocityMetrics(sellerId);
  }

  // GET /analytics/seller/:sellerId/buyer-cohorts
  @Get(':sellerId/buyer-cohorts')
  async getBuyerCohorts(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getBuyerCohorts(sellerId);
  }

  // GET /analytics/seller/:sellerId/buyer-segments
  @Get(':sellerId/buyer-segments')
  async getBuyerSegments(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getBuyerSegments(sellerId);
  }

  // POST /analytics/seller/:sellerId/segments/:segmentId/discount-campaign
  @Post(':sellerId/segments/:segmentId/discount-campaign')
  async generateDiscountCampaign(
    @Param('sellerId') sellerId: string,
    @Param('segmentId') segmentId: string,
    @Body() discountData: {
      discountPercentage: number;
      durationDays: number;
      maxUses?: number;
    },
  ) {
    return this.analyticsService.generateDiscountCampaign(sellerId, segmentId, discountData);
  }

  // GET /analytics/seller/:sellerId/inventory-risk
  @Get(':sellerId/inventory-risk')
  async getInventoryRiskAnalysis(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getInventoryRiskAnalysis(sellerId);
  }

  // GET /analytics/seller/:sellerId/aging-inventory
  @Get(':sellerId/aging-inventory')
  async getAgingInventory(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getAgingInventory(sellerId);
  }

  // GET /analytics/seller/:sellerId/stockout-predictions
  @Get(':sellerId/stockout-predictions')
  async getStockoutPredictions(@Param('sellerId') sellerId: string) {
    return this.analyticsService.getStockoutPredictions(sellerId);
  }

  // POST /analytics/seller/:sellerId/inventory-recommendations
  @Post(':sellerId/inventory-recommendations')
  async generateInventoryRecommendations(
    @Param('sellerId') sellerId: string,
    @Body() data: { productId?: string },
  ) {
    return this.analyticsService.generateInventoryRecommendations(sellerId, data.productId);
  }
}