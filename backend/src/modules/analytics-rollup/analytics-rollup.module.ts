import { Module } from '@nestjs/common';
import { AnalyticsRollupService } from './analytics-rollup.service';
import { AnalyticsRollupController } from './analytics-rollup.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsRollupService],
  controllers: [AnalyticsRollupController],
  exports: [AnalyticsRollupService],
})
export class AnalyticsRollupModule {}
