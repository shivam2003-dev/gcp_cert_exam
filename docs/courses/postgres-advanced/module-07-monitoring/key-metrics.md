# Key Metrics

## Overview

Monitoring the right metrics is essential for maintaining a healthy PostgreSQL database. This chapter covers critical metrics to monitor.

## Database-Level Metrics

### Connections

```sql
-- Current connections
SELECT count(*) FROM pg_stat_activity;

-- Connection usage
SELECT 
    count(*) as current_connections,
    setting::int as max_connections,
    round(100.0 * count(*) / setting::int, 2) as pct_used
FROM pg_stat_activity, pg_settings
WHERE pg_settings.name = 'max_connections'
GROUP BY setting;
```

**Alert if:** Connection usage greater than 80%

### Transactions

```sql
-- Transactions per second
SELECT 
    datname,
    xact_commit,
    xact_rollback,
    xact_commit + xact_rollback as total_xacts
FROM pg_stat_database
WHERE datname = current_database();
```

### Cache Hit Ratio

```sql
-- Overall cache hit ratio
SELECT 
    sum(heap_blks_hit) / 
    nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) as cache_hit_ratio
FROM pg_statio_user_tables;
```

**Alert if:** Less than 95%

## Table-Level Metrics

### Table Sizes

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Dead Tuples

```sql
SELECT 
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 2) as dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;
```

**Alert if:** Dead tuple percentage greater than 20%

## Replication Metrics

### Replication Lag

```sql
SELECT 
    application_name,
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(),
            sent_lsn
        )
    ) as lag
FROM pg_stat_replication;
```

**Alert if:** Lag greater than 1GB or 1 minute

### Replication Status

```sql
SELECT 
    application_name,
    state,
    sync_state
FROM pg_stat_replication;
```

## Query Performance Metrics

### Slow Queries

```sql
-- Using pg_stat_statements
SELECT 
    query,
    calls,
    mean_exec_time,
    max_exec_time,
    total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Long-Running Queries

```sql
SELECT 
    pid,
    now() - query_start as duration,
    state,
    query
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - query_start > INTERVAL '5 minutes'
ORDER BY duration DESC;
```

## Lock Metrics

### Lock Waits

```sql
SELECT 
    count(*) as waiting_queries
FROM pg_stat_activity
WHERE wait_event_type = 'Lock';
```

**Alert if:** Any queries waiting on locks for more than 1 minute

### Deadlocks

```sql
SELECT 
    datname,
    deadlocks
FROM pg_stat_database
WHERE datname = current_database();
```

**Alert if:** Deadlock count increases

## WAL Metrics

### WAL Generation Rate

```sql
SELECT 
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(),
            '0/0'
        )
    ) as total_wal_generated;
```

### WAL Archive Status

```sql
-- Check archive status
SELECT * FROM pg_stat_archiver;
```

## Best Practices

1. **Monitor continuously** - Use monitoring tools
2. **Set up alerts** - For critical metrics
3. **Track trends** - Historical data is valuable
4. **Document thresholds** - Know when to act
5. **Review regularly** - Weekly metric reviews

:::tip Production Insight
Good monitoring is the foundation of reliable operations. Monitor these metrics continuously and set up alerts for critical thresholds.
:::

## Next Steps

Continue to [pg_stat Views](./pg-stat-views) to learn about built-in statistics.
