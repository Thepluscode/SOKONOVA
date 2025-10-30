import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsRollupService } from './analytics-rollup.service';

@Controller('admin/ops')
export class AnalyticsRollupController {
  constructor(private rollup: AnalyticsRollupService) {}

  // GET /admin/ops/summary?adminId=ADMIN_USER_ID
  @Get('summary')
  async summary(@Query('adminId') adminId: string) {
    return this.rollup.getOpsSummary(adminId);
  }
}
