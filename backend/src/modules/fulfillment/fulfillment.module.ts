import { Module } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { FulfillmentController } from './fulfillment.controller';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * FulfillmentModule
 *
 * Handles order fulfillment and shipping tracking.
 *
 * Features:
 * - Buyer order tracking with timeline
 * - Seller fulfillment queue management
 * - Shipping status updates (PACKED → SHIPPED → DELIVERED)
 * - Issue tracking for disputes
 * - Per-item fulfillment (supports multi-seller orders)
 */
@Module({
  imports: [NotificationsModule],
  providers: [FulfillmentService],
  controllers: [FulfillmentController],
  exports: [FulfillmentService],
})
export class FulfillmentModule {}
