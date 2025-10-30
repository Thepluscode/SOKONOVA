import { Module } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * PayoutsModule
 *
 * Handles marketplace commission tracking and seller payouts.
 *
 * Features:
 * - Seller earnings dashboard
 * - Admin payout management
 * - CSV export for batch processing
 * - Payout reconciliation
 */
@Module({
  imports: [NotificationsModule],
  providers: [PayoutsService],
  controllers: [PayoutsController],
  exports: [PayoutsService],
})
export class PayoutsModule {}
