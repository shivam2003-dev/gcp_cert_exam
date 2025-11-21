# Log Analysis

## Overview

PostgreSQL logs contain valuable information for troubleshooting. This chapter covers log configuration and analysis.

## Log Configuration

### postgresql.conf

```conf
# Logging destination
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'

# When to log
log_min_messages = warning  # debug5, debug4, debug3, debug2, debug1, info, notice, warning, error, log, fatal, panic

# What to log
log_min_duration_statement = 1000  # Log queries taking > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_statement = 'none'  # 'none', 'ddl', 'mod', 'all'
log_connections = on
log_disconnections = on
log_lock_waits = on
log_checkpoints = on
log_autovacuum_min_duration = 0
```

## Log Locations

### Finding Logs

```bash
# Check log directory
SHOW log_directory;

# Common locations
/var/log/postgresql/
/var/lib/postgresql/data/log/
$PGDATA/log/
```

## Analyzing Logs

### Slow Queries

```bash
# Find slow queries
grep "duration:" /var/log/postgresql/postgresql.log | \
  awk '{print $NF, $0}' | sort -rn | head -20
```

### Errors

```bash
# Find errors
grep -i error /var/log/postgresql/postgresql.log | tail -20
```

### Connections

```bash
# Find connection issues
grep "connection" /var/log/postgresql/postgresql.log | grep -i "failed\|rejected"
```

### Deadlocks

```bash
# Find deadlocks
grep "deadlock" /var/log/postgresql/postgresql.log
```

## Log Rotation

### Automatic Rotation

```conf
# postgresql.conf
log_rotation_age = 1d
log_rotation_size = 100MB
```

### Manual Rotation

```bash
# Reload to rotate
SELECT pg_reload_conf();
```

## Best Practices

1. **Enable appropriate logging** - Balance detail vs performance
2. **Monitor log size** - Set up rotation
3. **Parse logs regularly** - Find issues early
4. **Archive logs** - Keep for analysis
5. **Use log aggregation** - ELK, Splunk, etc.

## Next Steps

Continue to [Troubleshooting](./troubleshooting) to learn debugging techniques.
