# pg_stat Views

## Overview

PostgreSQL provides built-in statistics views for monitoring. This chapter covers the most useful pg_stat views.

## pg_stat_database

Database-level statistics.

```sql
SELECT 
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted,
    conflicts,
    deadlocks
FROM pg_stat_database
WHERE datname = current_database();
```

## pg_stat_user_tables

Table-level statistics.

```sql
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

## pg_stat_user_indexes

Index usage statistics.

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

**Find unused indexes:**
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

## pg_statio_user_tables

I/O statistics for tables.

```sql
SELECT 
    schemaname,
    tablename,
    heap_blks_read,
    heap_blks_hit,
    idx_blks_read,
    idx_blks_hit,
    toast_blks_read,
    toast_blks_hit
FROM pg_statio_user_tables;
```

## pg_stat_activity

Current activity.

```sql
SELECT 
    pid,
    usename,
    datname,
    state,
    query,
    query_start,
    state_change,
    wait_event_type,
    wait_event
FROM pg_stat_activity
WHERE state != 'idle';
```

## pg_stat_replication

Replication statistics.

```sql
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    sync_state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn
FROM pg_stat_replication;
```

## pg_stat_statements

Query performance statistics (requires extension).

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View statistics
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Useful Queries

### Find Tables Needing Vacuum

```sql
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
  AND (last_autovacuum IS NULL 
       OR last_autovacuum < NOW() - INTERVAL '1 day')
ORDER BY n_dead_tup DESC;
```

### Find Slow Queries

```sql
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- More than 1 second
ORDER BY mean_exec_time DESC;
```

### Check Index Usage

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan < 10
ORDER BY pg_relation_size(indexrelid) DESC;
```

## Best Practices

1. **Query regularly** - Monitor trends
2. **Reset periodically** - Use pg_stat_reset() carefully
3. **Combine views** - Join for comprehensive insights
4. **Document queries** - Save useful queries
5. **Automate monitoring** - Use monitoring tools

:::tip Production Insight
pg_stat views are your first line of defense. Learn them well - they reveal most performance issues.
:::

## Next Steps

Continue to [Prometheus Monitoring](./prometheus) to learn about external monitoring setup.
