# Log & Metric Playbooks

## Centralized Logging Strategy

- Use journald forwarding (`ForwardToSyslog=yes`)
- Ship to ELK/Graylog/CloudWatch
- Tag logs with environment, cluster, service

## Key Log Sources

| Component | Command |
|-----------|---------|
| Kernel | `journalctl -k` |
| systemd | `journalctl -u <unit>` |
| Audit | `ausearch` / `aureport` |
| Application | `journalctl -t app` or `/var/log/app.log` |

## Metric Correlation

- Align logs with metrics timeline
- Example: CPU spike at 12:05 → check logs around 12:05 ± 5min

### Tools

- `grafana-cli` dashboards
- `promtool` for alert verification

## Log Sampling & Rate Limiting

```bash
# journald rate limits
cat /etc/systemd/journald.conf | grep RateLimit
```

Tune `RateLimitIntervalSec` and `RateLimitBurst` for chatty daemons.

Next: [Troubleshooting Playbooks](./troubleshooting-playbooks).
