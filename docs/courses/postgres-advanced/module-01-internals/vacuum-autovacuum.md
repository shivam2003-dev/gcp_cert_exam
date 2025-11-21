# Vacuum & Autovacuum

## Why Vacuum Exists

PostgreSQL's MVCC creates multiple versions of rows. Old versions (dead tuples) accumulate and must be cleaned up. **Vacuum** is the process that removes dead tuples and reclaims space.

## What Vacuum Does

Vacuum performs several critical tasks:

1. **Removes dead tuples** - Deletes old row versions
2. **Updates visibility map** - Marks pages as all-visible
3. **Freezes old transactions** - Prevents XID wraparound
4. **Updates statistics** - Refreshes table statistics for planner
5. **Reclaims space** - Makes space available for reuse (VACUUM FULL)

## Types of Vacuum

### Regular VACUUM

```sql
VACUUM;
VACUUM table_name;
VACUUM VERBOSE table_name;
```

**What it does**:
- Removes dead tuples
- Updates visibility map
- Updates statistics
- **Does NOT reclaim space to OS** (space stays in table)

**When to use**: Regular maintenance, after heavy updates/deletes

### VACUUM FULL

```sql
VACUUM FULL table_name;
```

**What it does**:
- Removes dead tuples
- Reclaims space to OS
- **Rewrites entire table** (exclusive lock!)
- **Very slow** on large tables

**When to use**: When table has significant bloat, during maintenance windows

:::danger Production Warning
VACUUM FULL locks the table exclusively and can take hours on large tables. Never run it during business hours without planning!
:::

### VACUUM ANALYZE

```sql
VACUUM ANALYZE table_name;
```

**What it does**:
- Everything VACUUM does
- Plus updates statistics (like ANALYZE)

**When to use**: After bulk data changes, before query planning

## Autovacuum

**Autovacuum** automatically runs VACUUM and ANALYZE based on:
- Number of dead tuples
- Number of updates/deletes
- Transaction age
- Statistics staleness

### Autovacuum Configuration

```conf
# postgresql.conf
autovacuum = on                    # Enable autovacuum
autovacuum_max_workers = 3         # Number of autovacuum workers
autovacuum_naptime = 1min          # Time between autovacuum runs
autovacuum_vacuum_threshold = 50  # Min dead tuples to trigger vacuum
autovacuum_analyze_threshold = 50  # Min inserts/updates to trigger analyze
autovacuum_vacuum_scale_factor = 0.2  # 20% of table must be dead tuples
autovacuum_analyze_scale_factor = 0.1  # 10% changes to trigger analyze
```

### Per-Table Autovacuum Settings

```sql
-- Disable autovacuum for a table (usually bad idea)
ALTER TABLE large_table SET (autovacuum_enabled = false);

-- Tune autovacuum for a specific table
ALTER TABLE high_churn_table SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 1000
);
```

## Vacuum Process

### What Happens During Vacuum

1. **Scans table** - Reads pages looking for dead tuples
2. **Checks visibility** - Determines which tuples are dead
3. **Removes dead tuples** - Marks space as free
4. **Updates indexes** - Removes index entries for dead tuples
5. **Updates visibility map** - Marks all-visible pages
6. **Updates statistics** - If ANALYZE is included

### Vacuum Phases

```
Vacuum Start
    ↓
Scan heap pages
    ↓
Remove dead tuples
    ↓
Truncate empty pages at end
    ↓
Update indexes
    ↓
Update visibility map
    ↓
Update statistics (if ANALYZE)
    ↓
Vacuum Complete
```

## Monitoring Vacuum

### Check Autovacuum Status

```sql
-- See running autovacuum processes
SELECT 
    pid,
    datname,
    usename,
    state,
    query,
    query_start
FROM pg_stat_activity
WHERE query LIKE '%autovacuum%' OR query LIKE '%VACUUM%';

-- Check vacuum statistics
SELECT 
    schemaname,
    tablename,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze,
    vacuum_count,
    autovacuum_count,
    n_dead_tup,
    n_live_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

### Check Table Bloat

```sql
-- Estimate table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size,
    n_dead_tup,
    n_live_tup,
    round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;
```

## Common Vacuum Issues

### 1. Autovacuum Not Running

```sql
-- Check if autovacuum is enabled
SHOW autovacuum;

-- Check for blocking queries
SELECT 
    pid,
    state,
    query,
    query_start
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

**Problem**: Long-running transactions prevent vacuum
**Solution**: Kill blocking queries, keep transactions short

### 2. Vacuum Taking Too Long

```sql
-- Find tables that need vacuum
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    last_autovacuum,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY n_dead_tup DESC;
```

**Problem**: Large tables with many dead tuples
**Solution**: Tune autovacuum settings, run VACUUM during maintenance windows

### 3. Transaction ID Wraparound

```sql
-- Check XID age (critical!)
SELECT 
    datname,
    age(datfrozenxid) as xid_age,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
ORDER BY age(datfrozenxid) DESC;

-- Check table XID age
SELECT 
    schemaname,
    tablename,
    age(relfrozenxid) as xid_age
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE relkind = 'r'
ORDER BY age(relfrozenxid) DESC
LIMIT 10;
```

**Problem**: XID age approaching 2 billion
**Solution**: Ensure autovacuum runs, may need to run VACUUM FREEZE manually

:::danger Critical Production Issue
If XID age exceeds 2 billion, PostgreSQL will refuse writes and the database becomes read-only. This is a critical failure that requires immediate action!
:::

### 4. Index Bloat

```sql
-- Check index bloat
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- Unused indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

**Problem**: Indexes grow but never shrink
**Solution**: REINDEX to rebuild indexes, remove unused indexes

## Vacuum Tuning

### For High-Update Tables

```sql
-- Tune autovacuum for tables with high churn
ALTER TABLE high_churn_table SET (
    autovacuum_vacuum_scale_factor = 0.05,  -- Trigger earlier
    autovacuum_vacuum_threshold = 1000,
    autovacuum_vacuum_cost_delay = 10ms,    -- Run faster
    autovacuum_vacuum_cost_limit = 1000
);
```

### For Large Tables

```sql
-- Tune for large, slow-to-vacuum tables
ALTER TABLE large_table SET (
    autovacuum_vacuum_scale_factor = 0.1,   -- Trigger less frequently
    autovacuum_vacuum_threshold = 10000,
    autovacuum_vacuum_cost_delay = 20ms    -- Be less aggressive
);
```

## Best Practices

1. **Let autovacuum run** - Don't disable it
2. **Monitor dead tuple counts** - Watch for bloat
3. **Tune per-table** - Different tables need different settings
4. **Keep transactions short** - Prevents vacuum blocking
5. **Monitor XID age** - Prevent wraparound
6. **Use VACUUM FULL sparingly** - Only when necessary, during maintenance

:::tip Production Insight
Vacuum is not optional - it's essential for PostgreSQL health. A database without vacuum will eventually stop working. Understanding vacuum is critical for production operations.
:::

## Next Steps

Continue to [Background Processes](./background-processes) to see how vacuum fits into PostgreSQL's architecture.

