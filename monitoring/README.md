# SokoNova Monitoring Stack

Local development monitoring stack with Prometheus, Grafana, Loki, and Promtail.

## Quick Start

```bash
# Start all monitoring services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## Services

| Service | URL | Purpose | Credentials |
|---------|-----|---------|-------------|
| Grafana | http://localhost:3001 | Dashboards & visualization | admin / admin |
| Prometheus | http://localhost:9090 | Metrics storage | - |
| Loki | http://localhost:3100 | Log aggregation | - |

## Configuration Files

```
monitoring/
├── docker-compose.yml              # Docker services definition
├── prometheus/
│   └── prometheus.yml              # Prometheus scrape config
├── grafana/
│   ├── sokonova-dashboard.json     # Pre-built dashboard
│   └── provisioning/
│       ├── datasources/            # Auto-configured data sources
│       └── dashboards/             # Dashboard provisioning
├── loki/
│   └── loki-config.yml             # Loki configuration
└── promtail/
    └── promtail-config.yml         # Log shipping config
```

## Usage

### 1. Start Monitoring Stack

```bash
cd monitoring
docker-compose up -d
```

Wait ~30 seconds for services to initialize.

### 2. Access Grafana

1. Open http://localhost:3001
2. Login with `admin` / `admin`
3. Change password when prompted (optional for local dev)
4. Navigate to **Dashboards** > **SokoNova**

### 3. View Metrics

**Prometheus UI**: http://localhost:9090/graph

Example queries:
```promql
# HTTP request rate
rate(http_requests_total[5m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Memory usage
process_resident_memory_bytes
```

### 4. View Logs (Loki)

In Grafana:
1. Go to **Explore**
2. Select **Loki** data source
3. Use LogQL queries:
   ```logql
   {job="sokonova-backend"} |= "error"
   {job="sokonova-backend",level="error"}
   ```

## Dashboards

### Pre-configured: SokoNova Application Metrics

Includes panels for:
- HTTP request rate & duration
- HTTP status codes distribution
- Database query performance
- Orders processed
- Memory & CPU usage
- Active connections
- Redis operations
- Error rates

### Creating Custom Dashboards

1. Click **+** > **Dashboard**
2. Add Panel
3. Select metric from Prometheus
4. Configure visualization
5. Save dashboard

## Data Sources

Automatically provisioned:

- **Prometheus**: http://prometheus:9090
- **Loki**: http://loki:3100

No manual configuration needed.

## Connecting to Backend

The stack is configured to scrape metrics from:
- **Development**: `host.docker.internal:4000/metrics`
- **Production**: Update `prometheus/prometheus.yml` with your domain

### Verify Connection

1. Open Prometheus UI: http://localhost:9090
2. Go to **Status** > **Targets**
3. Check that `sokonova-backend` is **UP**

If DOWN:
```bash
# Test metrics endpoint
curl http://localhost:4000/metrics

# Check if backend is running
docker ps | grep sokonova

# Check Prometheus logs
docker logs sokonova-prometheus
```

## Logs Location

Backend logs are mapped from `../backend/logs/` to Promtail.

Ensure your backend creates logs in:
```
backend/
├── logs/
│   ├── combined.log
│   ├── error.log
│   ├── exceptions.log
│   └── rejections.log
```

## Retention

Default retention periods:

- **Prometheus**: 15 days (configure with `--storage.tsdb.retention.time`)
- **Loki**: 30 days (configure in `loki/loki-config.yml`)
- **Log files**: Rotated at 5MB, 5 files kept

## Troubleshooting

### Services Won't Start

```bash
# Check if ports are in use
lsof -i :3001  # Grafana
lsof -i :9090  # Prometheus
lsof -i :3100  # Loki

# View service logs
docker-compose logs prometheus
docker-compose logs grafana
docker-compose logs loki

# Restart services
docker-compose restart
```

### No Metrics in Grafana

1. **Check Prometheus Target**:
   - Open http://localhost:9090/targets
   - Verify `sokonova-backend` status

2. **Test Backend Metrics**:
   ```bash
   curl http://localhost:4000/metrics
   ```

3. **Check Data Source**:
   - Grafana > Configuration > Data Sources
   - Test connection to Prometheus

### Dashboard Shows "No Data"

1. Verify time range (top right in Grafana)
2. Check if metrics exist in Prometheus
3. Ensure backend is generating traffic
4. Refresh dashboard

### Logs Not Appearing in Loki

1. **Check backend logs directory**:
   ```bash
   ls -la ../backend/logs/
   ```

2. **Verify Promtail is running**:
   ```bash
   docker logs sokonova-promtail
   ```

3. **Test Loki**:
   ```bash
   curl http://localhost:3100/ready
   ```

## Production Deployment

For production, use managed services:

### Option 1: Grafana Cloud (Recommended)
- Free tier: 50GB logs, 10K metrics
- Managed Prometheus + Loki + Grafana
- No infrastructure to maintain

### Option 2: Self-Hosted
Deploy to your infrastructure:

```bash
# Update Prometheus config
# monitoring/prometheus/prometheus.yml
scrape_configs:
  - job_name: 'sokonova-backend'
    static_configs:
      - targets: ['api.sokonova.com:4000']

# Deploy with Docker Compose or Kubernetes
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Option 3: Cloud Provider
- **AWS**: CloudWatch + X-Ray
- **GCP**: Cloud Monitoring + Logging
- **Azure**: Application Insights

## Cleanup

```bash
# Stop services
docker-compose down

# Remove volumes (deletes all metrics/logs)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Resources

- Full monitoring documentation: [../MONITORING.md](../MONITORING.md)
- Prometheus: https://prometheus.io/docs/
- Grafana: https://grafana.com/docs/
- Loki: https://grafana.com/docs/loki/

## Support

For issues with the monitoring stack:
1. Check logs: `docker-compose logs [service]`
2. Verify configuration files
3. Consult [../MONITORING.md](../MONITORING.md)
4. Open GitHub issue with `monitoring` label
