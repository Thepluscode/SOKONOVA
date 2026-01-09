import { Module } from '@nestjs/common';
import { SellerServicesService } from './seller-services.service';
import { SellerServicesController } from './seller-services.controller';

@Module({
  providers: [SellerServicesService],
  controllers: [SellerServicesController],
  exports: [SellerServicesService],
})
export class SellerServicesModule {}