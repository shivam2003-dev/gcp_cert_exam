# Log & Metric Playbooks

## Overview

Effective log analysis is crucial for troubleshooting and understanding system behavior. This module covers advanced techniques for analyzing logs and correlating them with metrics.

## Centralized Logging Strategy

### Architecture

```
Applications → journald → Forwarding → Centralized Log Store
                                    ↓
                            ELK / Graylog / CloudWatch
```

### journald Forwarding

**Configure Forwarding:**
```bash
# /etc/systemd/journald.conf
[Journal]
ForwardToSyslog=yes
ForwardToKMsg=no
ForwardToConsole=no
ForwardToWall=no
```

**Syslog Configuration:**
```bash
# /etc/rsyslog.conf
# Forward to remote syslog
*.* @remote-syslog-server:514

# Or use RELP
*.* :omrelp:remote-syslog-server:2514
```

### Log Shipping

**Using rsyslog:**
```bash
# Install
apt-get install rsyslog

# Configure
vim /etc/rsyslog.conf

# Restart
systemctl restart rsyslog
```

**Using filebeat (ELK stack):**
```bash
# Install filebeat
apt-get install filebeat

# Configure /etc/filebeat/filebeat.yml
filebeat.inputs:
- type: log
  paths:
    - /var/log/*.log
    - /var/log/journal/*.journal

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

## Key Log Sources

### Kernel Logs

```bash
# All kernel messages
journalctl -k

# Errors only
journalctl -k -p err

# Previous boot
journalctl -k -b -1

# Search for specific
journalctl -k | grep -i "error\|panic\|oops"

# Time range
journalctl -k --since "1 hour ago"
```

### systemd Logs

```bash
# All systemd logs
journalctl

# By unit
journalctl -u myservice.service

# By priority
journalctl -p warning
journalctl -p err

# Multiple units
journalctl -u service1.service -u service2.service
```

### Application Logs

**Standard Locations:**
- `/var/log/messages` - General messages
- `/var/log/syslog` - System log
- `/var/log/auth.log` - Authentication
- `/var/log/application.log` - Application-specific

**Using journalctl:**
```bash
# By executable
journalctl /usr/bin/myservice

# By PID
journalctl _PID=1234

# By user
journalctl _UID=1000
```

### Audit Logs

```bash
# Search audit logs
ausearch -k process_creation

# Generate report
aureport

# Recent events
ausearch -ts recent

# By user
ausearch -ua 1000
```

## Log Analysis Techniques

### Time-Based Analysis

```bash
# Logs from last hour
journalctl --since "1 hour ago"

# Logs from specific time
journalctl --since "2024-01-15 10:00:00"

# Logs between times
journalctl --since "2024-01-15 10:00:00" --until "2024-01-15 11:00:00"

# Today's logs
journalctl --since today

# Yesterday's logs
journalctl --since yesterday --until today
```

### Pattern Matching

```bash
# Simple grep
journalctl | grep ERROR

# Case insensitive
journalctl | grep -i error

# Multiple patterns
journalctl | grep -E "ERROR|WARN|FATAL"

# Exclude patterns
journalctl | grep -v "DEBUG"

# Using journalctl grep
journalctl --grep="ERROR"
journalctl --grep="ERROR\|WARN"
```

### Structured Log Analysis

```bash
# JSON output
journalctl -o json

# Pretty JSON
journalctl -o json-pretty

# Parse with jq
journalctl -o json | jq 'select(.PRIORITY >= 3)'
journalctl -o json | jq 'select(.MESSAGE | contains("ERROR"))'

# Extract fields
journalctl -o json | jq -r '.MESSAGE'
journalctl -o json | jq -r '.[] | "\(.TIMESTAMP) \(.MESSAGE)"'
```

## Metric Correlation

### Aligning Logs with Metrics

**Example Workflow:**
1. CPU spike detected at 12:05
2. Check logs around 12:05 ± 5 minutes
3. Correlate log events with metric changes
4. Identify root cause

```bash
# CPU spike at 12:05
# Check logs around that time
journalctl --since "2024-01-15 12:00:00" --until "2024-01-15 12:10:00"

# Look for service restarts
journalctl --since "2024-01-15 12:00:00" --until "2024-01-15 12:10:00" | grep -i "started\|stopped"

# Check for errors
journalctl --since "2024-01-15 12:00:00" --until "2024-01-15 12:10:00" -p err
```

### Tools for Correlation

**Grafana:**
- Visualize metrics and logs together
- Create dashboards
- Set up alerts

**Prometheus + Alertmanager:**
- Metrics collection
- Alerting
- Integration with logging

**ELK Stack:**
- Elasticsearch for search
- Logstash for processing
- Kibana for visualization

## Log Sampling & Rate Limiting

### journald Rate Limiting

**Configuration:**
```bash
# /etc/systemd/journald.conf
[Journal]
RateLimitIntervalSec=30s
RateLimitBurst=1000
```

**Understanding:**
- `RateLimitIntervalSec`: Time window
- `RateLimitBurst`: Max messages per window
- Exceeding limit: Messages dropped

**Tuning:**
```bash
# For chatty daemons, increase burst
RateLimitBurst=10000

# Or disable for specific service
# Use systemd unit override
[Service]
LogRateLimitIntervalSec=0
LogRateLimitBurst=0
```

### Log Rotation

**journald Rotation:**
```bash
# Configuration
# /etc/systemd/journald.conf
[Journal]
SystemMaxUse=1G
SystemKeepFree=500M
SystemMaxFiles=100
MaxRetentionSec=1month
```

**Manual Rotation:**
```bash
# Rotate journal
journalctl --rotate

# Vacuum old logs
journalctl --vacuum-time=30d
journalctl --vacuum-size=500M
```

## Advanced Log Analysis

### Log Aggregation

```bash
# Aggregate by unit
journalctl -o json | jq -r '.[] | ._SYSTEMD_UNIT' | sort | uniq -c

# Aggregate by priority
journalctl -o json | jq -r '.[] | .PRIORITY' | sort | uniq -c

# Aggregate by time
journalctl -o json | jq -r '.[] | .TIMESTAMP' | cut -d'T' -f1 | sort | uniq -c
```

### Anomaly Detection

```bash
# Find unusual patterns
journalctl --since "1 week ago" | grep -i error | awk '{print $1, $2, $3}' | sort | uniq -c | sort -rn

# Compare with baseline
# Baseline: Normal error rate
# Current: Current error rate
# Alert if > 2x baseline
```

### Performance Analysis

```bash
# Find slow operations
journalctl -o json | jq 'select(.MESSAGE | contains("duration"))'

# Parse timing information
journalctl | grep -E "took|duration|elapsed" | awk '{print $NF}' | sort -n
```

## Log Retention Strategy

### Retention Policies

**Short-term (hot storage):**
- Last 7 days: Full logs
- Fast access
- journald default storage

**Medium-term (warm storage):**
- 7-30 days: Compressed logs
- Slower access
- Archived to separate storage

**Long-term (cold storage):**
- 30+ days: Archived logs
- Very slow access
- Object storage (S3, etc.)

### Implementation

```bash
# Archive old logs
journalctl --since "30 days ago" --until "7 days ago" > archive.log
gzip archive.log

# Upload to cold storage
aws s3 cp archive.log.gz s3://logs-bucket/

# Clean up local
journalctl --vacuum-time=7d
```

## Best Practices

1. **Centralize logs** - Single source of truth
2. **Structure logs** - Use JSON format
3. **Index properly** - Fast search
4. **Retain appropriately** - Balance cost and need
5. **Monitor log health** - Alert on log failures

:::tip Production Insight
Effective log analysis requires good structure and indexing. Use structured logging (JSON) and centralize logs for better correlation and analysis.
:::

## Next Steps

Continue to [Troubleshooting Playbooks](./troubleshooting-playbooks) for specific incident response procedures.
