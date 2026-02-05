import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../modules/prisma.service';
import { RedisService } from '../modules/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    // Redis temporarily disabled for MVP deployment
    // private redis: RedisService,
  ) { }

  @Get()
  async check() {
    const startTime = Date.now();
    const result: any = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {},
    };

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const dbLatency = Date.now() - startTime;
      result.checks.database = {
        status: 'healthy',
        latency: `${dbLatency}ms`,
      };
    } catch (error) {
      result.status = 'unhealthy';
      result.checks.database = {
        status: 'unhealthy',
        error: error.message,
      };
    }

    // Check Redis connection (temporarily disabled for MVP)
    // try {
    //   const redisStart = Date.now();
    //   await this.redis.getClient().ping();
    //   const redisLatency = Date.now() - redisStart;
    //   result.checks.redis = {
    //     status: 'healthy',
    //     latency: `${redisLatency}ms`,
    //   };
    // } catch (error) {
    //   result.status = 'degraded';
    //   result.checks.redis = {
    //     status: 'unhealthy',
    //     error: error.message,
    //   };
    // }

    return result;
  }

  @Get('ready')
  async ready() {
    try {
      // Check if application is ready to accept traffic
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get('live')
  live() {
    // Simple liveness check - is the process running?
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('version')
  version() {
    return {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      commit:
        process.env.RAILWAY_GIT_COMMIT_SHA ||
        process.env.GIT_COMMIT_SHA ||
        process.env.GIT_SHA ||
        process.env.VERCEL_GIT_COMMIT_SHA ||
        process.env.SOURCE_VERSION ||
        null,
      nodeEnv: process.env.NODE_ENV || 'development',
    };
  }
}
