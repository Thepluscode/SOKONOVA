import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    const startTime = Date.now();

    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      const dbLatency = Date.now() - startTime;

      // Check Redis if available
      let redisStatus = 'not_configured';
      // TODO: Add Redis health check when implemented

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        checks: {
          database: {
            status: 'healthy',
            latency: `${dbLatency}ms`,
          },
          redis: {
            status: redisStatus,
          },
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        checks: {
          database: {
            status: 'unhealthy',
            error: error.message,
          },
        },
      };
    }
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
}
