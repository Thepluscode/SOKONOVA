import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from '../modules/prisma.service';
import { RedisService } from '../modules/redis.service';

@Module({
  controllers: [HealthController],
  providers: [PrismaService, RedisService],
})
export class HealthModule { }
