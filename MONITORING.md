# SokoNova Monitoring & Observability Guide

This document provides comprehensive guidance on monitoring, observability, and troubleshooting the SokoNova marketplace platform.

## Table of Contents

- [Overview](#overview)
- [Monitoring Stack](#monitoring-stack)
- [Quick Start](#quick-start)
- [Metrics](#metrics)
- [Error Tracking](#error-tracking)
- [Logging](#logging)
- [Health Checks](#health-checks)
- [Dashboards](#dashboards)
- [Alerts](#alerts)
- [Production Setup](#production-setup)
- [Troubleshooting](#troubleshooting)

## Overview

SokoNova uses a comprehensive observability stack for monitoring application health, performance, and errors:

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Sentry**: Error tracking and performance monitoring
- **Winston**: Structured logging
- **Loki** (optional): Log aggregation
- **Health Checks**: Kubernetes-style liveness/readiness probes

## Monitoring Stack

### Architecture

```
┌─────────────┐
│  SokoNova   │
│   Backend   │
│             │
│  /metrics   │──────► Prometheus ──────► Grafana
│  /health    │                           (Dashboards)
│             │
│  Winston    │──────► Loki ────────────► Grafana
│  Logs       │                           (Log Search)
│             │
│  Sentry     │──────► Sentry.io
│  Errors     │        (Error Tracking)
└─────────────┘
```

### Components

| Component | Purpose | Endpoint |
|-----------|---------|----------|
| Prometheus | Metrics scraping and storage | http://localhost:9090 |
| Grafana | Dashboards and visualization | http://localhost:3001 |
| Loki | Log aggregation | http://localhost:3100 |
| Sentry | Error tracking | https://sentry.io |
| Backend Metrics | Prometheus metrics endpoint | http://localhost:4000/metrics |
| Health Checks | Application health status | http://localhost:4000/health |

## Quick Start

### Local Development

1. **Start the monitoring stack:**

```bash
cd monitoring
docker-compose up -d
```

This starts:
- Prometheus (port 9090)
- Grafana (port 3001)
- Loki (port 3100)
- Promtail (log shipper)

2. **Access Grafana:**

Open http://localhost:3001
- Username: `admin`
- Password: `admin`

3. **Import Dashboards:**

The SokoNova dashboard is automatically provisioned from `monitoring/grafana/sokonova-dashboard.json`

4. **View Metrics:**

- Prometheus UI: http://localhost:9090
- Metrics endpoint: http://localhost:4000/metrics

### Production Setup

See [Production Setup](#production-setup) section below.

## Metrics

### Available Metrics

SokoNova exposes the following Prometheus metrics at `/metrics`:

#### HTTP Metrics

- **http_requests_total**: Total HTTP requests (counter)
  - Labels: `method`, `path`, `status`
  - Example: `http_requests_total{method="GET",path="/products",status="200"}`

- **http_request_duration_seconds**: HTTP request duration (histogram)
  - Labels: `method`, `path`, `status`
  - Percentiles: p50, p95, p99
  - Example: `http_request_duration_seconds_bucket{method="POST",path="/orders",status="201"}`

#### Database Metrics

- **database_query_duration_seconds**: Database query duration (histogram)
  - Labels: `operation`, `table`
  - Example: `database_query_duration_seconds{operation="findMany",table="Product"}`

#### Business Metrics

- **orders_processed_total**: Total orders processed (counter)
  - Labels: `status`
  - Example: `orders_processed_total{status="completed"}`

- **active_connections**: Current active connections (gauge)

#### Redis Metrics

- **redis_operations_total**: Total Redis operations (counter)
  - Labels: `operation`, `status`
  - Example: `redis_operations_total{operation="get",status="success"}`

#### System Metrics

- **process_cpu_seconds_total**: Process CPU usage
- **process_resident_memory_bytes**: Process memory usage
- **nodejs_heap_size_total_bytes**: Node.js heap size

### Querying Metrics

#### PromQL Examples

**Request rate (requests per second):**
```promql
rate(http_requests_total[5m])
```

**95th percentile response time:**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Error rate (5xx errors):**
```promql
rate(http_requests_total{status=~"5.."}[5m])
```

**Database query performance:**
```promql
histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m]))
```

**Orders per minute:**
```promql
rate(orders_processed_total[1m]) * 60
```

## Error Tracking

### Sentry Integration

SokoNova uses Sentry for real-time error tracking and performance monitoring.

#### Configuration

Set the `SENTRY_DSN` environment variable:

```bash
# Development
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Production
SENTRY_DSN=https://your-production-dsn@sentry.io/production-project-id
```

#### Features

- **Error Tracking**: Automatic capture of unhandled exceptions
- **Performance Monitoring**: Transaction tracing and performance insights
- **User Context**: User information attached to errors (id, email)
- **HTTP Context**: Request details (method, URL, headers)
- **Release Tracking**: Version information for each deployment
- **Source Maps**: Stack traces with original source code

#### Manual Error Reporting

```typescript
import * as Sentry from '@sentry/node';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    extra: {
      orderId: order.id,
      amount: order.total,
    },
  });
}
```

#### Breadcrumbs

```typescript
Sentry.addBreadcrumb({
  category: 'order',
  message: 'Order payment initiated',
  level: 'info',
  data: {
    orderId: order.id,
    paymentMethod: 'stripe',
  },
});
```

## Logging

### Winston Logger

SokoNova uses Winston for structured logging with different formats for development and production.

#### Log Levels

- **error**: Error events that might still allow the application to continue running
- **warn**: Warning events
- **info**: Informational messages that highlight the progress of the application
- **debug**: Fine-grained informational events for debugging

#### Configuration

Set the `LOG_LEVEL` environment variable:

```bash
# Development (verbose)
LOG_LEVEL=debug

# Production (less verbose)
LOG_LEVEL=info
```

#### Log Format

**Development**: Colorized, human-readable
```
2025-02-09 12:34:56 [ProductsService] info: Product created
{
  "productId": "123",
  "sellerId": "456"
}
```

**Production**: JSON for machine parsing
```json
{
  "timestamp": "2025-02-09T12:34:56.789Z",
  "level": "info",
  "message": "Product created",
  "context": "ProductsService",
  "productId": "123",
  "sellerId": "456"
}
```

#### Log Files

In production, logs are written to:
- `logs/error.log` - Error-level logs only
- `logs/combined.log` - All logs
- `logs/exceptions.log` - Unhandled exceptions
- `logs/rejections.log` - Unhandled promise rejections

**Log Rotation**: 5MB per file, max 5 error files, max 10 combined files

#### Using the Logger

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  async doSomething() {
    this.logger.log('Starting operation');
    this.logger.debug('Detailed debug info', { extra: 'data' });

    try {
      // Your code
    } catch (error) {
      this.logger.error('Operation failed', error.stack);
    }
  }
}
```

## Health Checks

### Endpoints

#### GET /health
Comprehensive health check with database connectivity.

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-02-09T12:34:56.789Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "latency": "5ms"
    }
  }
}
```

**Response (Unhealthy - 503):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-02-09T12:34:56.789Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "unhealthy",
      "error": "Connection timeout"
    }
  }
}
```

#### GET /health/ready
Kubernetes-style readiness probe. Returns 200 if ready to accept traffic.

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2025-02-09T12:34:56.789Z"
}
```

#### GET /health/live
Kubernetes-style liveness probe. Returns 200 if process is alive.

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2025-02-09T12:34:56.789Z"
}
```

#### GET /health/version
Version and deployment information.

**Response:**
```json
{
  "timestamp": "2025-02-09T12:34:56.789Z",
  "version": "1.0.0",
  "commit": "a1b2c3d4e5f6",
  "nodeEnv": "production"
}
```

### Kubernetes Configuration

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 4000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 4000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Dashboards

### Grafana Dashboards

The pre-configured SokoNova dashboard includes:

1. **HTTP Request Rate**: Requests per second by endpoint
2. **HTTP Request Duration (p95)**: 95th percentile response times
3. **HTTP Status Codes**: Distribution of status codes
4. **Database Query Duration**: Database performance metrics
5. **Orders Processed**: Business metrics - orders by status
6. **Memory Usage**: Application memory consumption
7. **CPU Usage**: Application CPU utilization
8. **Active Connections**: Current active connections
9. **Redis Operations**: Cache performance
10. **Error Rate**: 5xx errors over time

### Dashboard Import

1. Open Grafana (http://localhost:3001)
2. Go to **Dashboards** > **Import**
3. Upload `monitoring/grafana/sokonova-dashboard.json`
4. Select **Prometheus** as the data source

### Custom Dashboards

Create custom dashboards using PromQL queries. Example panels:

**Average Response Time:**
```promql
avg(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]))
```

**Success Rate:**
```promql
sum(rate(http_requests_total{status=~"2.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

## Alerts

### Prometheus Alerting Rules

Create alerting rules in `monitoring/prometheus/alerts/sokonova.yml`:

```yaml
groups:
  - name: sokonova_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/sec"

      # Slow response time
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow API response time"
          description: "95th percentile is {{ $value }}s"

      # Database connection issues
      - alert: DatabaseUnhealthy
        expr: up{job="sokonova-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection failed"
          description: "Health check failing"
```

### Sentry Alerts

Configure alerts in Sentry dashboard:
1. Go to **Alerts** > **Create Alert**
2. Choose conditions (e.g., "Error count > 10 in 5 minutes")
3. Configure notifications (email, Slack, PagerDuty)

## Production Setup

### 1. Set Up Sentry

1. Create account at https://sentry.io
2. Create new project for SokoNova
3. Copy DSN from project settings
4. Set environment variable:
   ```bash
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### 2. Configure Prometheus

#### Managed Options

- **Grafana Cloud**: Free tier includes Prometheus + Grafana
- **Datadog**: APM + Metrics + Logs
- **New Relic**: Full observability platform

#### Self-Hosted

1. Deploy Prometheus server
2. Configure scrape target:
   ```yaml
   scrape_configs:
     - job_name: 'sokonova-backend'
       static_configs:
         - targets: ['api.sokonova.com:4000']
       metrics_path: '/metrics'
   ```

### 3. Set Up Grafana

1. Deploy Grafana (or use Grafana Cloud)
2. Add Prometheus as data source
3. Import SokoNova dashboard
4. Configure authentication and users

### 4. Log Aggregation (Optional)

#### Option A: Grafana Loki

```bash
# Self-hosted
docker run -d -p 3100:3100 grafana/loki:latest

# Or use Grafana Cloud Logs
```

#### Option B: Elasticsearch + Kibana

Configure Winston to send logs to Elasticsearch.

#### Option C: Cloud Logging

- **Railway**: Built-in log viewing
- **AWS CloudWatch**: If deploying to AWS
- **Google Cloud Logging**: If deploying to GCP

## Troubleshooting

### Common Issues

#### 1. Metrics Not Appearing in Prometheus

**Check:**
- Is `/metrics` endpoint accessible? `curl http://localhost:4000/metrics`
- Is Prometheus scraping the target? Check Prometheus UI > Status > Targets
- Are there any errors in Prometheus logs?

**Solution:**
```bash
# Test metrics endpoint
curl http://localhost:4000/metrics

# Check Prometheus config
docker exec sokonova-prometheus cat /etc/prometheus/prometheus.yml

# Restart Prometheus
docker restart sokonova-prometheus
```

#### 2. Sentry Errors Not Appearing

**Check:**
- Is `SENTRY_DSN` environment variable set?
- Check application logs for "Sentry initialized" message
- Test Sentry manually:
  ```typescript
  Sentry.captureMessage('Test error from SokoNova');
  ```

#### 3. High Memory Usage

**Investigate:**
```promql
# Check memory growth
process_resident_memory_bytes

# Check heap usage
nodejs_heap_size_used_bytes / nodejs_heap_size_total_bytes
```

**Solutions:**
- Check for memory leaks using Node.js heap snapshots
- Increase container memory limits
- Optimize database queries (check slow query logs)

#### 4. Slow API Response Times

**Investigate:**
```promql
# Slowest endpoints
topk(10, histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])))

# Database query times
histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m]))
```

**Solutions:**
- Add database indexes (see `prisma/migrations/add_performance_indexes.sql`)
- Enable Redis caching
- Optimize N+1 queries
- Add query result caching

#### 5. Database Connection Timeouts

**Check:**
```bash
# Test database connectivity
curl http://localhost:4000/health

# Check PostgreSQL logs
# Check connection pool settings
```

**Solutions:**
- Increase connection pool size in Prisma
- Check database server health
- Verify network connectivity

### Debug Mode

Enable verbose logging:

```bash
# Set in .env
LOG_LEVEL=debug
NODE_ENV=development

# Restart application
npm run dev
```

### Performance Profiling

Use Sentry Performance Monitoring:

```typescript
import * as Sentry from '@sentry/node';

const transaction = Sentry.startTransaction({
  op: 'order-processing',
  name: 'Process Order',
});

try {
  // Your code
  const span = transaction.startChild({
    op: 'db-query',
    description: 'Fetch product details',
  });

  // Database operation
  span.finish();

} finally {
  transaction.finish();
}
```

## Best Practices

1. **Set Up Alerts**: Don't just collect metrics - alert on critical thresholds
2. **Regular Reviews**: Weekly review of error trends and performance
3. **Retention Policies**: Configure appropriate data retention (30 days recommended)
4. **Privacy**: Ensure logs don't contain PII (passwords, credit cards, etc.)
5. **Correlation**: Use trace IDs to correlate logs, metrics, and errors
6. **Documentation**: Update this document as monitoring evolves
7. **Testing**: Test monitoring setup in staging before production

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [NestJS Logging](https://docs.nestjs.com/techniques/logger)

## Support

For monitoring issues or questions:
- Check this documentation first
- Review application logs: `docker logs sokonova-backend`
- Check monitoring stack logs: `docker-compose logs -f`
- Open GitHub issue with monitoring label
