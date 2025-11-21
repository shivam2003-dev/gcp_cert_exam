# Statistics and ANALYZE

## Why Statistics Matter

PostgreSQL's query planner relies on **statistics** to estimate how many rows each operation will return. Accurate statistics lead to better query plans.

## What Statistics Are Collected

The `ANALYZE` command collects:

- **Row count** - Number of rows in table
- **Column statistics**:
  - Number of distinct values
  - Most common values and frequencies
  - Histogram of value distribution
  - NULL fraction
  - Average width
- **Correlation** - Physical vs logical order correlation

## Running ANALYZE

### Basic Usage

```sql
-- Analyze a specific table
ANALYZE users;

-- Analyze all tables in current database
ANALYZE;

-- Analyze specific columns
ANALYZE users (email, created_at);

-- Verbose output
ANALYZE VERBOSE users;
```

### When ANALYZE Runs Automatically

**Autovacuum** automatically runs ANALYZE when:
- Table has significant changes (inserts/updates)
- Statistics become stale
- Based on `autovacuum_analyze_scale_factor` and `autovacuum_analyze_threshold`

## Viewing Statistics

### pg_stats View

```sql
-- View statistics for a column
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    most_common_vals,
    most_common_freqs,
    histogram_bounds,
    null_frac,
    avg_width
FROM pg_stats
WHERE tablename = 'users' AND attname = 'email';
```

### Understanding Statistics

**n_distinct**: Number of distinct values
- Positive number: Actual distinct count
- Negative number: Estimated as `-n_distinct * total_rows`
- `-1`: All values are distinct

**most_common_vals**: Most frequent values
**most_common_freqs**: Frequencies of most common values

**histogram_bounds**: Value distribution histogram
- Used for range queries
- Planner estimates selectivity based on histogram

**null_frac**: Fraction of NULL values

**avg_width**: Average column width in bytes

## How Planner Uses Statistics

### Example: Equality Query

```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

Planner checks:
1. Is `'user@example.com'` in `most_common_vals`?
   - If yes: Use frequency from `most_common_freqs`
   - If no: Estimate based on `n_distinct`
2. Estimate rows: `total_rows / n_distinct` (if not in MCV)

### Example: Range Query

```sql
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
```

Planner uses:
- `histogram_bounds` to estimate how many values fall in range
- `correlation` to estimate if index scan is beneficial

## Stale Statistics Problems

### Symptom: Poor Query Plans

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE status = 'active';
```

**Bad Plan:**
```
Seq Scan on users
  Filter: (status = 'active')
  Rows: 100        -- Estimated (wrong!)
  Actual Rows: 50000
  Actual Time: 5000.234 ms
```

**Problem**: Statistics show only 100 active users, but there are 50,000.

### Solution: Update Statistics

```sql
ANALYZE users;

-- Verify plan improved
EXPLAIN ANALYZE SELECT * FROM users WHERE status = 'active';
```

**Good Plan:**
```
Index Scan using users_status_idx on users
  Index Cond: (status = 'active')
  Rows: 50000     -- Estimated (correct!)
  Actual Rows: 50000
  Actual Time: 50.123 ms
```

## Monitoring Statistics Freshness

### Check Last ANALYZE Time

```sql
SELECT 
    schemaname,
    tablename,
    last_analyze,
    last_autoanalyze,
    n_live_tup,
    n_mod_since_analyze
FROM pg_stat_user_tables
WHERE last_analyze IS NULL 
   OR last_analyze < NOW() - INTERVAL '1 day'
ORDER BY n_mod_since_analyze DESC;
```

### Check Statistics Age

```sql
-- Find tables with stale statistics
SELECT 
    schemaname,
    tablename,
    last_analyze,
    n_live_tup,
    n_mod_since_analyze,
    round(100.0 * n_mod_since_analyze / NULLIF(n_live_tup, 0), 2) as pct_changed
FROM pg_stat_user_tables
WHERE n_mod_since_analyze > 1000
ORDER BY n_mod_since_analyze DESC;
```

## Tuning Autovacuum for Statistics

### Per-Table Settings

```sql
-- For high-churn tables, analyze more frequently
ALTER TABLE high_churn_table SET (
    autovacuum_analyze_scale_factor = 0.05,  -- Analyze at 5% changes
    autovacuum_analyze_threshold = 1000
);

-- For large, stable tables, analyze less frequently
ALTER TABLE large_stable_table SET (
    autovacuum_analyze_scale_factor = 0.2,  -- Analyze at 20% changes
    autovacuum_analyze_threshold = 10000
);
```

## Extended Statistics

PostgreSQL supports **extended statistics** for:
- **Expression statistics** - Statistics on expressions
- **Multivariate statistics** - Correlations between columns
- **Most common value lists** - For arrays and other types

### Creating Extended Statistics

```sql
-- Expression statistics
CREATE STATISTICS users_email_lower_stats ON LOWER(email) FROM users;
ANALYZE users;

-- Multivariate statistics (column correlations)
CREATE STATISTICS users_status_created_stats ON status, created_at FROM users;
ANALYZE users;
```

### When to Use Extended Statistics

- Queries use expressions (LOWER, UPPER, etc.)
- Columns are correlated (status and created_at)
- Planner makes poor estimates for complex queries

## Statistics Target

**statistics_target** controls how much detail is collected:

```sql
-- Default is 100
SHOW default_statistics_target;

-- Increase for more accurate statistics (slower ANALYZE)
ALTER TABLE users ALTER COLUMN email SET STATISTICS 500;
ANALYZE users;

-- Or set globally
SET default_statistics_target = 500;
```

### Trade-offs

- **Higher target**: More accurate, slower ANALYZE, more storage
- **Lower target**: Faster ANALYZE, less accurate, less storage

## Common Statistics Issues

### Issue 1: Planner Overestimates Rows

**Symptom:**
```
Estimated Rows: 100000
Actual Rows: 100
```

**Cause**: Statistics show low selectivity, but query is actually very selective
**Solution**: 
- Update statistics: `ANALYZE table_name;`
- Increase statistics target for the column
- Consider partial index if pattern is consistent

### Issue 2: Planner Underestimates Rows

**Symptom:**
```
Estimated Rows: 100
Actual Rows: 100000
```

**Cause**: Statistics are stale or inaccurate
**Solution**: 
- Run ANALYZE
- Check if data distribution changed significantly
- Consider extended statistics for correlated columns

### Issue 3: Expression Queries Not Using Index

**Symptom:**
```sql
-- Has index on LOWER(email)
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- Query doesn't use index
EXPLAIN SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

**Cause**: No statistics on the expression
**Solution**:
```sql
CREATE STATISTICS users_email_lower_stats ON LOWER(email) FROM users;
ANALYZE users;
```

## Best Practices

1. **Let autovacuum run ANALYZE** - Usually sufficient
2. **Run ANALYZE after bulk loads** - Always after large data changes
3. **Monitor statistics freshness** - Check last_analyze regularly
4. **Tune per-table** - High-churn tables need more frequent ANALYZE
5. **Use extended statistics** - For complex query patterns
6. **Increase statistics_target** - For columns with poor estimates
7. **Don't disable autovacuum** - Statistics will become stale

:::tip Production Insight
Stale statistics are a common cause of poor query plans. A simple `ANALYZE` can fix many performance issues. Monitor statistics freshness as part of your routine maintenance.
:::

## Next Steps

Continue to [Slow Query Analysis](./slow-queries) to learn how to identify and fix slow queries.

