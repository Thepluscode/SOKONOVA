import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * PayoutsService
 *
 * Powers seller dashboards and finance operations for marketplace payouts.
 * Tracks seller earnings, commission fees, and payout status.
 *
 * Key Features:
 * - Seller earnings view (pending and paid)
 * - Admin payout marking and batch processing
 * - CSV export for bank transfer / mobile money reconciliation
 */
@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Get pending (unpaid) earnings for a seller
   *
   * Shows all order items awaiting payout with:
   * - Total gross sales
   * - Total marketplace fees
   * - Total net amount owed to seller
   * - Line item breakdown
   *
   * @param sellerId - The seller's user ID
   */
  async getPendingForSeller(sellerId: string) {
    // Get all order items that are still PENDING payout
    const items = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        payoutStatus: 'PENDING',
      },
      select: {
        id: true,
        orderId: true,
        productId: true,
        qty: true,
        price: true,
        grossAmount: true,
        feeAmount: true,
        netAmount: true,
        currency: true,
        createdAt: true,
        product: {
          select: {
            title: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Compute totals across all pending items
    const totalGross = items.reduce(
      (acc, it) => acc + Number(it.grossAmount),
      0,
    );
    const totalFees = items.reduce(
      (acc, it) => acc + Number(it.feeAmount),
      0,
    );
    const totalNet = items.reduce(
      (acc, it) => acc + Number(it.netAmount),
      0,
    );

    return {
      currency: items[0]?.currency || 'USD',
      totalGross,
      totalFees,
      totalNet,
      count: items.length,
      items,
    };
  }

  /**
   * Get all earnings for a seller (pending and paid)
   * Used for historical view and reconciliation
   *
   * @param sellerId - The seller's user ID
   */
  async getAllForSeller(sellerId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderId: true,
        productId: true,
        qty: true,
        price: true,
        grossAmount: true,
        feeAmount: true,
        netAmount: true,
        currency: true,
        payoutStatus: true,
        payoutBatchId: true,
        paidAt: true,
        createdAt: true,
        product: {
          select: {
            title: true,
          },
        },
      },
    });

    return items;
  }

  /**
   * Mark specific order items as paid out
   *
   * Admin/finance operation to record that sellers have been paid.
   * Updates payout status, stamps paidAt timestamp, and groups into batch.
   *
   * @param orderItemIds - Array of order item IDs to mark as paid
   * @param batchId - Batch identifier for reconciliation (e.g. "2025-10-28-run-1")
   */
  async markPaidOut(orderItemIds: string[], batchId: string) {
    const now = new Date();

    // Update all selected order items to PAID_OUT status
    await this.prisma.orderItem.updateMany({
      where: {
        id: { in: orderItemIds },
      },
      data: {
        payoutStatus: 'PAID_OUT',
        payoutBatchId: batchId,
        paidAt: now,
      },
    });

    // Return summary for audit and export
    const updated = await this.prisma.orderItem.findMany({
      where: { id: { in: orderItemIds } },
      select: {
        id: true,
        sellerId: true,
        netAmount: true,
        currency: true,
        payoutBatchId: true,
        paidAt: true,
        product: {
          select: {
            title: true,
          },
        },
      },
    });

    // Group payouts by seller and notify each seller
    const sellerPayouts = new Map<string, { amount: number; count: number; currency: string }>();

    for (const item of updated) {
      if (!sellerPayouts.has(item.sellerId)) {
        sellerPayouts.set(item.sellerId, {
          amount: 0,
          count: 0,
          currency: item.currency,
        });
      }
      const payout = sellerPayouts.get(item.sellerId)!;
      payout.amount += Number(item.netAmount);
      payout.count++;
    }

    // Notify each seller about their payout
    try {
      for (const [sellerId, payout] of sellerPayouts) {
        await this.notifications.notifyPayoutReleased(
          sellerId,
          payout.amount,
          payout.currency,
          batchId,
          payout.count,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send payout notifications: ${error.message}`);
    }

    return {
      batchId,
      paidAt: now,
      count: updated.length,
      lines: updated,
    };
  }

  /**
   * Generate CSV export for seller earnings
   *
   * Creates a CSV file for:
   * - Manual bank transfer processing
   * - Mobile money batch upload
   * - Accounting reconciliation
   * - Tax reporting
   *
   * @param sellerId - The seller's user ID
   * @returns CSV string with earnings data
   */
  async getCsvForSeller(sellerId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        orderId: true,
        productId: true,
        qty: true,
        price: true,
        grossAmount: true,
        feeAmount: true,
        netAmount: true,
        currency: true,
        payoutStatus: true,
        payoutBatchId: true,
        paidAt: true,
        createdAt: true,
        product: {
          select: {
            title: true,
          },
        },
      },
    });

    // Build CSV header
    const header = [
      'orderItemId',
      'orderId',
      'productTitle',
      'qty',
      'unitPrice',
      'gross',
      'fee',
      'net',
      'currency',
      'payoutStatus',
      'payoutBatchId',
      'paidAt',
      'createdAt',
    ].join(',');

    // Build CSV rows
    const rows = items.map((it) =>
      [
        it.id,
        it.orderId,
        `"${it.product.title}"`, // Quoted in case of commas in title
        it.qty,
        Number(it.price).toFixed(2),
        Number(it.grossAmount).toFixed(2),
        Number(it.feeAmount).toFixed(2),
        Number(it.netAmount).toFixed(2),
        it.currency,
        it.payoutStatus,
        it.payoutBatchId ?? '',
        it.paidAt?.toISOString() ?? '',
        it.createdAt.toISOString(),
      ].join(','),
    );

    const csv = [header, ...rows].join('\n');
    return csv;
  }

  /**
   * Get payout summary for all sellers (admin view)
   *
   * Returns pending payout totals grouped by seller.
   * Useful for finance planning and batch payout creation.
   */
  async getAdminSummary() {
    const items = await this.prisma.orderItem.findMany({
      where: {
        payoutStatus: 'PENDING',
      },
      select: {
        sellerId: true,
        netAmount: true,
        currency: true,
        product: {
          select: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Group by seller
    const grouped = items.reduce((acc, item) => {
      const seller = item.product.seller;
      if (!acc[seller.id]) {
        acc[seller.id] = {
          sellerId: seller.id,
          sellerName: seller.name || 'Unknown',
          sellerEmail: seller.email,
          totalNet: 0,
          currency: item.currency,
          count: 0,
        };
      }
      acc[seller.id].totalNet += Number(item.netAmount);
      acc[seller.id].count += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }
}
