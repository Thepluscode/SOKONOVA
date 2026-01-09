import { Module } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Module({
    imports: [
        PrometheusModule.register({
            path: '/metrics',
            defaultMetrics: {
                enabled: true,
            },
        }),
    ],
    providers: [
        // HTTP Request Counter
        makeCounterProvider({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'path', 'status'],
        }),
        // HTTP Request Duration Histogram
        makeHistogramProvider({
            name: 'http_request_duration_seconds',
            help: 'HTTP request duration in seconds',
            labelNames: ['method', 'path', 'status'],
            buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
        }),
        // Active Connections Gauge
        makeGaugeProvider({
            name: 'active_connections',
            help: 'Number of active connections',
        }),
        // Database Query Duration
        makeHistogramProvider({
            name: 'database_query_duration_seconds',
            help: 'Database query duration in seconds',
            labelNames: ['operation', 'table'],
            buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
        }),
        // Orders Processed Counter
        makeCounterProvider({
            name: 'orders_processed_total',
            help: 'Total orders processed',
            labelNames: ['status'],
        }),
        // Redis Operations
        makeCounterProvider({
            name: 'redis_operations_total',
            help: 'Total Redis operations',
            labelNames: ['operation', 'status'],
        }),
    ],
    exports: [PrometheusModule],
})
export class MetricsModule { }
