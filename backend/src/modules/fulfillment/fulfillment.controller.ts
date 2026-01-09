import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  // GET /fulfillment/products/:productId/delivery-estimate
  @Get('products/:productId/delivery-estimate')
  async getDeliveryEstimate(
    @Param('productId') productId: string,
    @Query('location') location?: string,
  ) {
    return this.fulfillmentService.calculateDeliveryEstimate(productId, location);
  }

  // POST /fulfillment/shipping-options
  @Post('shipping-options')
  async getShippingOptions(
    @Body() data: {
      items: Array<{ productId: string; quantity: number }>;
      location?: string;
    },
  ) {
    return this.fulfillmentService.getShippingOptions(data.items, data.location);
  }

  // GET /fulfillment/track/:trackingNumber
  @Get('track/:trackingNumber')
  async trackShipment(@Param('trackingNumber') trackingNumber: string) {
    return this.fulfillmentService.trackShipment(trackingNumber);
  }

  // GET /fulfillment/sellers/:sellerId/delivery-performance
  @Get('sellers/:sellerId/delivery-performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getDeliveryPerformance(@Param('sellerId') sellerId: string) {
    return this.fulfillmentService.getDeliveryPerformanceMetrics(sellerId);
  }

  // GET /fulfillment/tracking/:orderId
  @Get('tracking/:orderId')
  @UseGuards(JwtAuthGuard)
  async getOrderTracking(
    @Param('orderId') orderId: string,
    @Query('userId') userId: string,
  ) {
    return this.fulfillmentService.getOrderTracking(orderId, userId);
  }

  // GET /fulfillment/seller/open
  @Get('seller/open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async getSellerOpenFulfillment(@Query('sellerId') sellerId: string) {
    return this.fulfillmentService.getSellerOpenFulfillment(sellerId);
  }

  // GET /fulfillment/seller/stats
  @Get('seller/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async getSellerStats(@Query('sellerId') sellerId: string) {
    return this.fulfillmentService.getSellerStats(sellerId);
  }

  // PATCH /fulfillment/seller/ship/:orderItemId
  @Patch('seller/ship/:orderItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async markShipped(
    @Param('orderItemId') orderItemId: string,
    @Query('sellerId') sellerId: string,
    @Body() data: { carrier?: string; trackingCode?: string; note?: string },
  ) {
    return this.fulfillmentService.markShipped(
      orderItemId,
      sellerId,
      data.carrier,
      data.trackingCode,
      data.note,
    );
  }

  // PATCH /fulfillment/seller/deliver/:orderItemId
  @Patch('seller/deliver/:orderItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async markDelivered(
    @Param('orderItemId') orderItemId: string,
    @Query('sellerId') sellerId: string,
    @Body() data: { proofUrl?: string; note?: string },
  ) {
    return this.fulfillmentService.markDelivered(
      orderItemId,
      sellerId,
      data.proofUrl,
      data.note,
    );
  }

  // PATCH /fulfillment/seller/issue/:orderItemId
  @Patch('seller/issue/:orderItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async markIssue(
    @Param('orderItemId') orderItemId: string,
    @Query('sellerId') sellerId: string,
    @Body() data: { note: string },
  ) {
    return this.fulfillmentService.markIssue(orderItemId, sellerId, data.note);
  }

  // NEW ENDPOINTS FOR LOGISTICS & FULFILLMENT EXCELLENCE

  // GET /fulfillment/delivery-promise/:productId
  @Get('delivery-promise/:productId')
  async getDeliveryPromise(
    @Param('productId') productId: string,
    @Query('location') location?: string,
  ) {
    return this.fulfillmentService.calculateDeliveryPromise(productId, location);
  }

  // GET /fulfillment/exceptions/:orderItemId
  @Get('exceptions/:orderItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getExceptionStatus(@Param('orderItemId') orderItemId: string) {
    return this.fulfillmentService.getExceptionStatus(orderItemId);
  }

  // GET /fulfillment/micro-fulfillment/:sellerId/metrics
  @Get('micro-fulfillment/:sellerId/metrics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getMicroFulfillmentMetrics(@Param('sellerId') sellerId: string) {
    return this.fulfillmentService.getMicroFulfillmentMetrics(sellerId);
  }

  // POST /fulfillment/micro-fulfillment/:sellerId/opt-in
  @Post('micro-fulfillment/:sellerId/opt-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async optInToMicroFulfillment(
    @Param('sellerId') sellerId: string,
    @Body() data: { partnerId: string },
  ) {
    return this.fulfillmentService.optInToMicroFulfillment(sellerId, data.partnerId);
  }

  // GET /fulfillment/micro-fulfillment/:sellerId/partners
  @Get('micro-fulfillment/:sellerId/partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async getFulfillmentPartners(@Param('sellerId') sellerId: string) {
    return this.fulfillmentService.getFulfillmentPartners(sellerId);
  }
}