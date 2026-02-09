import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_requests_total') private requestCounter: Counter,
    @InjectMetric('http_request_duration_seconds')
    private requestDuration: Histogram,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Capture response finish event
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000; // Convert to seconds

      // Normalize path to avoid high cardinality (remove IDs, UUIDs, etc)
      const path = this.normalizePath(req.path);

      const labels = {
        method: req.method,
        path,
        status: res.statusCode.toString(),
      };

      // Increment request counter
      this.requestCounter.inc(labels);

      // Record request duration
      this.requestDuration.observe(labels, duration);
    });

    next();
  }

  /**
   * Normalize path to reduce cardinality
   * Replaces IDs and UUIDs with placeholders
   */
  private normalizePath(path: string): string {
    return path
      .replace(/\/\d+/g, '/:id') // Replace numeric IDs
      .replace(
        /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        '/:uuid',
      ) // Replace UUIDs
      .replace(/\/[0-9a-f]{24}/gi, '/:objectId'); // Replace MongoDB ObjectIDs
  }
}
