import { Module } from '@nestjs/common';
import { SellerApplicationsService } from './seller-applications.service';
import { SellerApplicationsController } from './seller-applications.controller';

@Module({
  providers: [SellerApplicationsService],
  controllers: [SellerApplicationsController],
  exports: [SellerApplicationsService],
})
export class SellerApplicationsModule {}
