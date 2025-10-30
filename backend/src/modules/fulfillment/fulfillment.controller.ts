import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import {
  MarkShippedDto,
  MarkDeliveredDto,
  MarkIssueDto,
} from './dto/fulfillment.dto';

/**
 * FulfillmentController
 *
 * Endpoints for order fulfillment and shipping tracking.
 *
 * Routes:
 * - /fulfillment/tracking/*     -> Buyer tracking endpoints
 * - /fulfillment/seller/*       -> Seller fulfillment management
 *
 * TODO: In production, add authentication guards:
 * - Buyer endpoints: verify userId matches session
 * - Seller endpoints: verify sellerId matches session + SELLER role
 */
@Controller('fulfillment')
export class FulfillmentController {
  constructor(private fulfillment: FulfillmentService) {}

  /**
   * Get order tracking for a buyer
   *
   * GET /fulfillment/tracking/:orderId?userId=buyer123
   *
   * Returns complete shipping timeline for all items in the order.
   *
   * TODO: Replace ?userId= with session-based auth:
   * @UseGuards(JwtAuthGuard)
   * async getTracking(@Param('orderId') orderId: string, @CurrentUser() user: User) {
   *   return this.fulfillment.getOrderTracking(orderId, user.id);
   * }
   */
  @Get('tracking/:orderId')
  async getTracking(
    @Param('orderId') orderId: string,
    @Query('userId') userId: string,
  ) {
    return this.fulfillment.getOrderTracking(orderId, userId);
  }

  /**
   * Get seller's open fulfillment queue
   *
   * GET /fulfillment/seller/open?sellerId=seller123
   *
   * Returns all items that need shipping or are in transit.
   *
   * Response:
   * [
   *   {
   *     id: "oi_123",
   *     orderId: "order_456",
   *     product: { title: "...", imageUrl: "..." },
   *     qty: 2,
   *     fulfillmentStatus: "PACKED",
   *     order: {
   *       shippingAddress: "123 Main St",
   *       buyerName: "John Doe",
   *       buyerEmail: "john@example.com"
   *     }
   *   }
   * ]
   *
   * TODO: Add auth guard to ensure sellerId === session.user.id
   */
  @Get('seller/open')
  async getSellerOpen(@Query('sellerId') sellerId: string) {
    return this.fulfillment.getSellerOpenFulfillment(sellerId);
  }

  /**
   * Get seller's fulfillment statistics
   *
   * GET /fulfillment/seller/stats?sellerId=seller123
   *
   * Returns counts for each fulfillment status:
   * {
   *   PACKED: 5,
   *   SHIPPED: 12,
   *   DELIVERED: 143,
   *   ISSUE: 2,
   *   total: 162
   * }
   */
  @Get('seller/stats')
  async getSellerStats(@Query('sellerId') sellerId: string) {
    return this.fulfillment.getSellerStats(sellerId);
  }

  /**
   * Mark item as shipped
   *
   * PATCH /fulfillment/seller/ship/:orderItemId?sellerId=seller123
   * {
   *   "carrier": "DHL",
   *   "trackingCode": "1234567890",
   *   "note": "Expected delivery in 2-3 days"
   * }
   *
   * Response:
   * {
   *   id: "oi_123",
   *   fulfillmentStatus: "SHIPPED",
   *   shippedAt: "2025-10-28T15:30:00.000Z",
   *   trackingCode: "1234567890",
   *   carrier: "DHL"
   * }
   *
   * TODO: Add auth guard and ownership verification
   */
  @Patch('seller/ship/:orderItemId')
  async markShipped(
    @Param('orderItemId') orderItemId: string,
    @Query('sellerId') sellerId: string,
    @Body() dto: MarkShippedDto,
  ) {
    return this.fulfillment.markShipped(
      orderItemId,
      sellerId,
      dto.carrier,
      dto.trackingCode,
      dto.note,
    );
  }

  /**
   * Mark item as delivered
   *
   * PATCH /fulfillment/seller/deliver/:orderItemId?sellerId=seller123
   * {
   *   "proofUrl": "https://cdn.example.com/delivery-photo.jpg",
   *   "note": "Left with receptionist"
   * }
   *
   * Response:
   * {
   *   id: "oi_123",
   *   fulfillmentStatus: "DELIVERED",
   *   deliveredAt: "2025-10-30T10:15:00.000Z",
   *   deliveryProofUrl: "https://..."
   * }
   *
   * TODO: Add auth guard and ownership verification
   * TODO: Consider requiring buyer confirmation for final delivery status
   */
  @Patch('seller/deliver/:orderItemId')
  async markDelivered(
    @Param('orderItemId') orderItemId: string,
    @Query('sellerId') sellerId: string,
    @Body() dto: MarkDeliveredDto,
  ) {
    return this.fulfillment.markDelivered(
      orderItemId,
      sellerId,
      dto.proofUrl,
      dto.note,
    );
  }

  /**
   * Mark item as having an issue
   *
   * PATCH /fulfillment/seller/issue/:orderItemId?sellerId=seller123
   * {
   *   "note": "Package lost by carrier, initiating claim"
   * }
   *
   * Response:
   * {
   *   id: "oi_123",
   *   fulfillmentStatus: "ISSUE",
   *   notes: "Package lost by carrier, initiating claim"
   * }
   *
   * TODO: Add auth guard
   * TODO: Trigger admin notification for issue queue
   */
  @Patch('seller/issue/:orderItemId')
  async markIssue(
    @Param('orderItemId') orderItemId: string,
    @Query('sellerId') sellerId: string,
    @Body() dto: MarkIssueDto,
  ) {
    return this.fulfillment.markIssue(orderItemId, sellerId, dto.note);
  }
}
