import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsModule } from '../metrics/metrics.module';
import { MetricsMiddleware } from '../metrics/metrics.middleware';
import { MonitoringInterceptor } from '../common/interceptors/monitoring.interceptor';
import { HealthModule } from '../health/health.module';

/**
 * Monitoring Module
 *
 * Integrates all monitoring, observability, and telemetry features:
 * - Prometheus metrics (HTTP, database, business metrics)
 * - Sentry error tracking and performance monitoring
 * - Structured logging with Winston
 * - Health checks (liveness, readiness)
 * - Performance tracing
 *
 * Endpoints exposed:
 * - GET /metrics - Prometheus metrics endpoint
 * - GET /health - Application health check
 * - GET /health/ready - Readiness probe
 * - GET /health/live - Liveness probe
 * - GET /health/version - Version information
 */
@Global()
@Module({
  imports: [MetricsModule, HealthModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MonitoringInterceptor,
    },
  ],
  exports: [MetricsModule, HealthModule],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply metrics middleware to all routes
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
