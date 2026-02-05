import { Module } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryExtraController } from './discovery.extra.controller';

@Module({
  providers: [DiscoveryService],
  controllers: [DiscoveryController, DiscoveryExtraController],
})
export class DiscoveryModule {}
