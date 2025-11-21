# Bloat Management

## Overview

Table and index bloat occurs when dead tuples accumulate. At scale, bloat can significantly impact performance.

## Understanding Bloat

### What is Bloat?

**Bloat** is space occupied by dead tuples that haven't been vacuumed yet.

```sql
-- Check bloat
SELECT 
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 2) as dead_pct,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;
```

## Causes of Bloat

1. **High update rate** - Many updates create dead tuples
2. **Long transactions** - Prevent vacuum
3. **Autovacuum not keeping up** - Too slow or disabled
4. **Large tables** - Vacuum takes longer

## Monitoring Bloat

### Table Bloat

```sql
-- Estimate table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    n_dead_tup,
    round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 2) as dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY n_dead_tup DESC;
```

### Index Bloat

```sql
-- Check index bloat
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- Unused indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

## Managing Bloat

### Regular VACUUM

```sql
-- Vacuum specific table
VACUUM VERBOSE large_table;

-- Vacuum all tables
VACUUM;
```

### VACUUM FULL

```sql
-- Reclaim space (requires exclusive lock)
VACUUM FULL large_table;
```

:::warning Production Warning
VACUUM FULL locks the table exclusively. Only use during maintenance windows!
:::

### REINDEX

```sql
-- Rebuild index to remove bloat
REINDEX INDEX idx_large_table_column;

-- Rebuild all indexes on table
REINDEX TABLE large_table;
```

## Preventing Bloat

### Tune Autovacuum

```sql
-- For high-churn tables
ALTER TABLE high_churn_table SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 1000
);
```

### Keep Transactions Short

```sql
-- Bad: Long transaction
BEGIN;
-- ... hours of processing ...
COMMIT;

-- Good: Short transactions
BEGIN;
-- ... quick operation ...
COMMIT;
```

### Use Partitioning

```sql
-- Partitioning makes bloat management easier
-- Can VACUUM individual partitions
VACUUM orders_2024_01;
```

## Best Practices

1. **Monitor bloat regularly** - Set up alerts
2. **Tune autovacuum** - Per-table settings
3. **Keep transactions short** - Prevent vacuum blocking
4. **Use partitioning** - Easier bloat management
5. **Plan VACUUM FULL** - During maintenance windows

:::tip Production Insight
Bloat is inevitable with high update rates. The key is managing it proactively with proper autovacuum tuning.
:::

## Next Steps

Continue to [Partition Management](./partition-management) to learn about managing partitions at scale.
