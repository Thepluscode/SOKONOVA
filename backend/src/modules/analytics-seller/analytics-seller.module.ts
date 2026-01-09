import { Module } from '@nestjs/common';
import { AnalyticsSellerController } from './analytics-seller.controller';
import { AnalyticsSellerService } from './analytics-seller.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsSellerController],
  providers: [AnalyticsSellerService],
  exports: [AnalyticsSellerService],
})
export class AnalyticsSellerModule {}