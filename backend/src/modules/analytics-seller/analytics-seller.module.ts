import { Module } from '@nestjs/common';
import { AnalyticsSellerService } from './analytics-seller.service';
import { AnalyticsSellerController } from './analytics-seller.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsSellerService],
  controllers: [AnalyticsSellerController],
  exports: [AnalyticsSellerService],
})
export class AnalyticsSellerModule {}
