# Prometheus Monitoring

## Overview

Prometheus is a popular monitoring system. This chapter covers setting up Prometheus monitoring for PostgreSQL.

## postgres_exporter

PostgreSQL exporter for Prometheus metrics.

### Installation

```bash
# Download
wget https://github.com/prometheus-community/postgres_exporter/releases/download/v0.15.0/postgres_exporter-0.15.0.linux-amd64.tar.gz

# Extract and install
tar xzf postgres_exporter-0.15.0.linux-amd64.tar.gz
sudo mv postgres_exporter /usr/local/bin/
```

### Configuration

```bash
# Environment variables
export DATA_SOURCE_NAME="postgresql://user:password@localhost:5432/mydb?sslmode=disable"

# Or use .pgpass
export DATA_SOURCE_NAME="user=postgres host=localhost port=5432 dbname=mydb sslmode=disable"
```

### Running

```bash
# Start exporter
postgres_exporter

# Or as systemd service
systemctl start postgres_exporter
```

### Metrics Endpoint

```bash
# Expose metrics on port 9187
curl http://localhost:9187/metrics
```

## Prometheus Configuration

### prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']
```

### Key Metrics

- `pg_stat_database_xact_commit` - Committed transactions
- `pg_stat_database_xact_rollback` - Rolled back transactions
- `pg_stat_database_blks_hit` - Cache hits
- `pg_stat_database_blks_read` - Disk reads
- `pg_stat_activity_count` - Active connections
- `pg_replication_lag` - Replication lag

## Grafana Dashboards

### Import Dashboard

1. Go to Grafana
2. Import dashboard ID: 9628 (PostgreSQL Database)
3. Configure data source
4. View metrics

### Custom Queries

```promql
# Cache hit ratio
rate(pg_stat_database_blks_hit[5m]) / 
(rate(pg_stat_database_blks_hit[5m]) + rate(pg_stat_database_blks_read[5m]))

# Connections
pg_stat_activity_count

# Replication lag
pg_replication_lag_bytes
```

## Alerting Rules

### prometheus-alerts.yml

```yaml
groups:
  - name: postgres
    rules:
      - alert: HighConnectionCount
        expr: pg_stat_activity_count > 80
        for: 5m
        annotations:
          summary: "High connection count"
      
      - alert: LowCacheHitRatio
        expr: |
          rate(pg_stat_database_blks_hit[5m]) / 
          (rate(pg_stat_database_blks_hit[5m]) + rate(pg_stat_database_blks_read[5m])) < 0.95
        for: 5m
        annotations:
          summary: "Low cache hit ratio"
      
      - alert: ReplicationLag
        expr: pg_replication_lag_bytes > 1073741824  # 1GB
        for: 5m
        annotations:
          summary: "High replication lag"
```

## Best Practices

1. **Monitor key metrics** - Connections, cache hit, replication
2. **Set up alerts** - For critical thresholds
3. **Use dashboards** - Visualize metrics
4. **Retain history** - Keep metrics for analysis
5. **Test alerts** - Ensure they work

:::tip Production Insight
Prometheus + Grafana is the industry standard for PostgreSQL monitoring. Set it up early in your production deployment.
:::

## Next Steps

Continue to [Log Analysis](./log-analysis) to learn about reading PostgreSQL logs.
