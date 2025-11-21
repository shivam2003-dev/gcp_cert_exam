# Slow Query Analysis

## Identifying Slow Queries

### Using pg_stat_statements

**pg_stat_statements** is the most powerful tool for finding slow queries:

```sql
-- Enable extension (requires superuser)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slowest queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    stddev_exec_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Using pg_stat_activity

```sql
-- Find currently running slow queries
SELECT 
    pid,
    now() - query_start AS duration,
    state,
    query,
    wait_event_type,
    wait_event
FROM pg_stat_activity
WHERE state = 'active'
  AND now() - query_start > INTERVAL '5 seconds'
ORDER BY duration DESC;
```

## Analyzing Query Performance

### Step 1: Get the Query Plan

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT * FROM users WHERE email = 'user@example.com';
```

### Step 2: Identify Bottlenecks

Look for:
- **High actual time** - Operations taking too long
- **Many buffer reads** - Data not in cache
- **Large row estimates** - Inaccurate statistics
- **Sequential scans** - Missing indexes
- **Nested loops on large tables** - Wrong join method

### Step 3: Check Statistics

```sql
-- Verify statistics are current
SELECT 
    schemaname,
    tablename,
    last_analyze,
    n_live_tup,
    n_mod_since_analyze
FROM pg_stat_user_tables
WHERE tablename = 'users';
```

## Common Slow Query Patterns

### Pattern 1: Missing Index

**Symptom:**
```
Seq Scan on users
  Filter: (email = 'user@example.com')
  Rows Removed by Filter: 99999
  Actual Time: 500.234 ms
```

**Solution:**
```sql
CREATE INDEX idx_users_email ON users(email);
```

### Pattern 2: Stale Statistics

**Symptom:**
```
Estimated Rows: 100
Actual Rows: 10000
```

**Solution:**
```sql
ANALYZE users;
```

### Pattern 3: Large Result Set

**Symptom:**
```
Index Scan returning 1 million rows
Actual Time: 5000.123 ms
```

**Solution:**
- Add WHERE clause to filter more
- Use LIMIT if full result not needed
- Consider pagination

### Pattern 4: Inefficient Join

**Symptom:**
```
Nested Loop
  -> Seq Scan on large_table1
  -> Seq Scan on large_table2
```

**Solution:**
```sql
-- Add indexes on join columns
CREATE INDEX idx_table1_fkey ON table1(foreign_key);
CREATE INDEX idx_table2_fkey ON table2(foreign_key);

-- Or increase work_mem for hash join
SET work_mem = '256MB';
```

## Query Optimization Techniques

### 1. Add Appropriate Indexes

```sql
-- Index for WHERE clause
CREATE INDEX idx_users_email ON users(email);

-- Index for ORDER BY
CREATE INDEX idx_users_created ON users(created_at);

-- Composite index for multiple conditions
CREATE INDEX idx_users_status_created ON users(status, created_at);
```

### 2. Rewrite Queries

**Before:**
```sql
SELECT * FROM users 
WHERE EXTRACT(YEAR FROM created_at) = 2024;
```

**After:**
```sql
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
  AND created_at < '2025-01-01';
```

### 3. Use LIMIT When Appropriate

```sql
-- If you only need first N rows
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

### 4. Avoid SELECT *

```sql
-- Instead of
SELECT * FROM users WHERE id = 123;

-- Use
SELECT id, email, name FROM users WHERE id = 123;
```

### 5. Use EXISTS Instead of COUNT

**Before:**
```sql
SELECT * FROM users 
WHERE (SELECT COUNT(*) FROM orders WHERE user_id = users.id) > 0;
```

**After:**
```sql
SELECT * FROM users 
WHERE EXISTS (SELECT 1 FROM orders WHERE user_id = users.id);
```

## Monitoring Query Performance

### Set Up Query Logging

```conf
# postgresql.conf
log_min_duration_statement = 1000  # Log queries taking > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_statement = 'none'
```

### Analyze Logs

```bash
# Find slow queries in logs
grep "duration:" /var/log/postgresql/postgresql.log | \
  awk '{print $NF, $0}' | sort -rn | head -20
```

## Using pg_stat_statements Effectively

### Reset Statistics

```sql
-- Reset all statistics
SELECT pg_stat_statements_reset();

-- Reset for specific query
SELECT pg_stat_statements_reset(userid, dbid, queryid);
```

### Track Query Changes

```sql
-- Save current statistics
CREATE TABLE query_stats_snapshot AS 
SELECT * FROM pg_stat_statements;

-- Compare later
SELECT 
    a.query,
    b.calls - a.calls AS new_calls,
    b.total_exec_time - a.total_exec_time AS new_time
FROM query_stats_snapshot a
JOIN pg_stat_statements b USING (userid, dbid, queryid)
WHERE b.calls > a.calls;
```

## Best Practices

1. **Enable pg_stat_statements** - Essential for production
2. **Monitor regularly** - Check slow queries weekly
3. **Use EXPLAIN ANALYZE** - Always verify plan improvements
4. **Update statistics** - Keep ANALYZE current
5. **Index strategically** - Not too many, not too few
6. **Test changes** - Verify improvements before deploying

:::tip Production Insight
Most slow queries can be fixed with proper indexes and current statistics. pg_stat_statements is your best friend for finding them.
:::

## Next Steps

Continue to [Query Anti-Patterns](./anti-patterns) to learn common mistakes and how to avoid them.

