import { Module } from '@nestjs/common';
import { ImpactInclusionService } from './impact-inclusion.service';
import { ImpactInclusionController } from './impact-inclusion.controller';

@Module({
  providers: [ImpactInclusionService],
  controllers: [ImpactInclusionController],
  exports: [ImpactInclusionService],
})
export class ImpactInclusionModule {}