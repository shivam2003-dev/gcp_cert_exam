# Performance Tuning Techniques

## Overview

Performance tuning is both art and science. This chapter covers proven techniques for optimizing PostgreSQL performance.

## Query Rewriting

### Rewrite Subqueries as JOINs

**Before:**
```sql
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total > 1000);
```

**After:**
```sql
SELECT DISTINCT u.* 
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.total > 1000;
```

### Use EXISTS Instead of IN for Large Sets

**Before:**
```sql
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);
```

**After:**
```sql
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## Index Optimization

### Covering Indexes

Create indexes that contain all columns needed by query:

```sql
-- Query needs id, email, status
SELECT id, email, status FROM users WHERE email = 'user@example.com';

-- Create covering index
CREATE INDEX idx_users_email_covering ON users(email) INCLUDE (id, status);
```

### Partial Indexes for Filtered Queries

```sql
-- If you only query active users
CREATE INDEX idx_users_active_email ON users(email) 
WHERE status = 'active';
```

### Expression Indexes for Functions

```sql
-- For case-insensitive searches
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

## Join Optimization

### Ensure Join Columns Are Indexed

```sql
-- Index foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Index both sides of join if needed
CREATE INDEX idx_users_id ON users(id);  -- Usually primary key, already indexed
```

### Choose Right Join Order

PostgreSQL usually chooses correctly, but you can influence:

```sql
-- Use JOIN instead of WHERE for clarity
SELECT * FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active';
```

### Use Hash Joins for Large Tables

```sql
-- Increase work_mem to allow hash joins
SET work_mem = '256MB';

-- Planner will choose hash join for large tables
SELECT * FROM large_table1 t1
JOIN large_table2 t2 ON t1.id = t2.id;
```

## Materialized Views

For expensive queries that don't need real-time data:

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW user_order_stats AS
SELECT 
    u.id,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email;

-- Create index on materialized view
CREATE INDEX idx_user_order_stats_id ON user_order_stats(id);

-- Refresh periodically
REFRESH MATERIALIZED VIEW user_order_stats;
```

## Partitioning for Large Tables

```sql
-- Partition by date
CREATE TABLE orders (
    id SERIAL,
    user_id INT,
    created_at TIMESTAMP,
    total DECIMAL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_01 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Query automatically uses partition pruning
SELECT * FROM orders WHERE created_at >= '2024-01-15' AND created_at < '2024-01-20';
```

## Connection Pooling

Use PgBouncer or similar to reduce connection overhead:

```conf
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

## Parallel Queries

Enable parallel execution for large queries:

```sql
-- Enable parallel queries
SET max_parallel_workers_per_gather = 4;
SET parallel_setup_cost = 1000;
SET parallel_tuple_cost = 0.01;

-- Query will use parallel workers
EXPLAIN ANALYZE 
SELECT COUNT(*) FROM large_table WHERE status = 'active';
```

## Query Plan Hints (Limited)

PostgreSQL doesn't have query hints, but you can influence:

```sql
-- Disable specific plan types (for testing)
SET enable_seqscan = off;
SET enable_indexscan = on;
SET enable_hashjoin = on;
SET enable_mergejoin = off;

-- Run query
EXPLAIN ANALYZE SELECT ...;

-- Reset
RESET enable_seqscan;
```

## Statistics and Planning

### Update Statistics Regularly

```sql
-- After bulk loads
ANALYZE large_table;

-- For specific columns
ANALYZE large_table (status, created_at);
```

### Increase Statistics Target

```sql
-- For columns with poor estimates
ALTER TABLE users ALTER COLUMN email SET STATISTICS 500;
ANALYZE users;
```

### Use Extended Statistics

```sql
-- For correlated columns
CREATE STATISTICS users_status_created_stats ON status, created_at FROM users;
ANALYZE users;
```

## Configuration Tuning

### Memory Settings

```conf
# postgresql.conf
shared_buffers = 4GB              # 25% of RAM
effective_cache_size = 12GB       # 50-75% of RAM
work_mem = 64MB                   # Per operation
maintenance_work_mem = 1GB        # For VACUUM, CREATE INDEX
```

### Query Planner Settings

```conf
random_page_cost = 1.1            # For SSD
seq_page_cost = 1.0
cpu_tuple_cost = 0.01
cpu_index_tuple_cost = 0.005
cpu_operator_cost = 0.0025
```

## Monitoring and Iteration

### Track Query Performance

```sql
-- Use pg_stat_statements
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Compare Before/After

```sql
-- Before optimization
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;

-- Make changes

-- After optimization
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

## Best Practices

1. **Measure first** - Profile before optimizing
2. **Index strategically** - Not too many, not too few
3. **Keep statistics current** - Run ANALYZE regularly
4. **Test with real data** - Small datasets hide issues
5. **Monitor continuously** - Performance degrades over time
6. **Document changes** - Know what you changed and why

:::tip Production Insight
Performance tuning is iterative. Make one change at a time, measure the impact, and iterate. Small improvements compound.
:::

## Next Steps

You've completed Module 2! Move to [Module 3: Concurrency, Locks & Transactions](../module-03-transactions/intro).

