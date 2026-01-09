import { Module } from '@nestjs/common';
import { ApiPartnerPlatformService } from './api-partner-platform.service';
import { ApiPartnerPlatformController } from './api-partner-platform.controller';

@Module({
  providers: [ApiPartnerPlatformService],
  controllers: [ApiPartnerPlatformController],
  exports: [ApiPartnerPlatformService],
})
export class ApiPartnerPlatformModule {}