import { Module } from '@nestjs/common';
import { AdminControlTowerService } from './admin-control-tower.service';
import { AdminControlTowerController } from './admin-control-tower.controller';

@Module({
  providers: [AdminControlTowerService],
  controllers: [AdminControlTowerController],
  exports: [AdminControlTowerService],
})
export class AdminControlTowerModule {}