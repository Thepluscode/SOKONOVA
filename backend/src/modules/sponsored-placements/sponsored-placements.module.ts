import { Module } from '@nestjs/common';
import { SponsoredPlacementsService } from './sponsored-placements.service';
import { SponsoredPlacementsController } from './sponsored-placements.controller';

@Module({
  providers: [SponsoredPlacementsService],
  controllers: [SponsoredPlacementsController],
})
export class SponsoredPlacementsModule {}