import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PayoutsService } from './payouts.service';
import { Response } from 'express';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { RequestPayoutDto } from './dto/request-payout.dto';
import { AdminPayoutRequestDto } from './dto/admin-payout-request.dto';
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
 * Authentication enforced:
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
   * Seller: Request payout
   *
   * POST /payouts/seller/:sellerId/request
   * { "amount": 100.0, "method": "Bank Transfer" }
   */
  @Post('seller/:sellerId/request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async requestPayout(
    @Param('sellerId') sellerId: string,
    @Body() dto: RequestPayoutDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (sellerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to request payout for another seller');
    }
    return this.payouts.requestPayout(sellerId, dto.amount, dto.method, dto.note);
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
   * Admin: List payout requests
   *
   * GET /payouts/admin/requests?status=REQUESTED&page=1&limit=20
   */
  @Get('admin/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async listRequests(
    @Query('status') status?: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'PAID',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.payouts.listPayoutRequests(status, pageNum, limitNum);
  }

  /**
   * Admin: Approve payout request
   *
   * PATCH /payouts/admin/requests/:id/approve
   */
  @Patch('admin/requests/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approveRequest(
    @Param('id') id: string,
    @Body() body: AdminPayoutRequestDto,
  ) {
    return this.payouts.approvePayoutRequest(id, body?.note);
  }

  /**
   * Admin: Reject payout request
   *
   * PATCH /payouts/admin/requests/:id/reject
   */
  @Patch('admin/requests/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async rejectRequest(
    @Param('id') id: string,
    @Body() body: AdminPayoutRequestDto,
  ) {
    return this.payouts.rejectPayoutRequest(id, body?.note);
  }

  /**
   * Admin: Mark payout request as paid
   *
   * PATCH /payouts/admin/requests/:id/mark-paid
   */
  @Patch('admin/requests/:id/mark-paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async markRequestPaid(
    @Param('id') id: string,
    @Body() body: AdminPayoutRequestDto,
  ) {
    return this.payouts.markPayoutRequestPaid(id, body?.note);
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
   */
  @Get('admin/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async adminSummary() {
    return this.payouts.getAdminSummary();
  }
}
