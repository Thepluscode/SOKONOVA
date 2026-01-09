import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from '../modules/prisma.service';
// import { RedisService } from '../modules/redis.service'; // Temporarily disabled for MVP

@Module({
  controllers: [HealthController],
  providers: [PrismaService], // RedisService removed for MVP deployment
})
export class HealthModule { }
