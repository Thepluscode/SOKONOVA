import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PayoutsService } from './payouts.service';
import { Response } from 'express';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * PayoutsController
 *
 * Endpoints for seller earnings and payout management.
 *
 * Routes:
 * - /payouts/seller/*   -> Seller-facing endpoints
 * - /payouts/admin/*    -> Finance/admin endpoints
 *
 * TODO: In production, add authentication guards:
 * - Seller endpoints: require seller to own the data
 * - Admin endpoints: require ADMIN role
 */
@Controller('payouts')
export class PayoutsController {
  constructor(private payouts: PayoutsService) {}

  /**
   * Get pending (unpaid) earnings for a seller
   *
   * GET /payouts/seller/pending?sellerId=abc
   *
   * Returns:
   * {
   *   currency: "USD",
   *   totalGross: 412.50,
   *   totalFees: 41.25,
   *   totalNet: 371.25,
   *   count: 12,
   *   items: [...]
   * }
   *
   * TODO: Add auth guard
   * @UseGuards(JwtAuthGuard)
   * async sellerPending(@CurrentUser() user: User) {
   *   return this.payouts.getPendingForSeller(user.id);
   * }
   */
  @Get('seller/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async sellerPending(
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (sellerId && sellerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access other sellers');
    }
    return this.payouts.getPendingForSeller(
      user.role === Role.ADMIN && sellerId ? sellerId : user.id,
    );
  }

  /**
   * Get all earnings history for a seller
   *
   * GET /payouts/seller/all?sellerId=abc
   *
   * Returns all order items (pending and paid) for reconciliation.
   *
   * TODO: Add auth guard to ensure seller owns the data
   */
  @Get('seller/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async sellerAll(
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (sellerId && sellerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access other sellers');
    }
    return this.payouts.getAllForSeller(
      user.role === Role.ADMIN && sellerId ? sellerId : user.id,
    );
  }

  /**
   * Download CSV export of seller earnings
   *
   * GET /payouts/seller/csv?sellerId=abc
   *
   * Returns CSV file for:
   * - Bank transfer batch processing
   * - Mobile money upload (M-Pesa, MoMo)
   * - Accounting reconciliation
   *
   * TODO: Add auth guard
   */
  @Get('seller/csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async sellerCsv(
    @Query('sellerId') sellerId: string | undefined,
    @Res() res: Response,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (sellerId && sellerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access other sellers');
    }
    const targetSellerId =
      user.role === Role.ADMIN && sellerId ? sellerId : user.id;
    const csv = await this.payouts.getCsvForSeller(targetSellerId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="payouts-${targetSellerId}.csv"`,
    );
    res.send(csv);
  }

  /**
   * Admin: Mark order items as paid out
   *
   * POST /payouts/admin/mark-paid
   * {
   *   "orderItemIds": ["oi_123", "oi_456"],
   *   "batchId": "2025-10-28-run-1"
   * }
   *
   * Response:
   * {
   *   "batchId": "2025-10-28-run-1",
   *   "paidAt": "2025-10-28T15:30:00.000Z",
   *   "count": 2,
   *   "lines": [...]
   * }
   *
   * TODO: Add admin auth guard
   * @UseGuards(JwtAuthGuard, RolesGuard)
   * @Roles('ADMIN')
   */
  @Post('admin/mark-paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async markPaid(@Body() dto: MarkPaidDto) {
    return this.payouts.markPaidOut(dto.orderItemIds, dto.batchId);
  }

  /**
   * Admin: Get payout summary for all sellers
   *
   * GET /payouts/admin/summary
   *
   * Returns pending payout totals grouped by seller.
   * Useful for:
   * - Finance planning
   * - Batch payout creation
   * - Cash flow forecasting
   *
   * Response:
   * [
   *   {
   *     sellerId: "user_123",
   *     sellerName: "John Doe",
   *     sellerEmail: "john@example.com",
   *     totalNet: 371.25,
   *     currency: "USD",
   *     count: 12
   *   }
   * ]
   *
   * TODO: Add admin auth guard
   */
  @Get('admin/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async adminSummary() {
    return this.payouts.getAdminSummary();
  }
}
