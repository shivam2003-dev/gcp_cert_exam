# Query Planner Basics

## What is the Query Planner?

The **query planner** (also called optimizer) decides how to execute SQL queries. Given a query, it:
1. Generates multiple execution plans
2. Estimates cost for each plan
3. Chooses the lowest-cost plan
4. Executes that plan

## Why Planning Matters

The same query can be executed in many ways:
- Sequential scan vs index scan
- Nested loop vs hash join vs merge join
- Different join orders
- Different index choices

The planner's choice can mean the difference between milliseconds and minutes.

## Planning Process

```
SQL Query
    ↓
Parse & Rewrite
    ↓
Generate Plans
    ↓
Estimate Costs
    ↓
Choose Best Plan
    ↓
Execute
```

## Cost-Based Optimization

PostgreSQL uses **cost-based optimization**:
- Each operation has a cost
- Costs are estimated based on:
  - Number of rows (cardinality)
  - Data distribution (statistics)
  - I/O cost (disk vs memory)
  - CPU cost (processing)

### Cost Units

Costs are in arbitrary units:
- **seq_page_cost** = 1.0 (sequential page read)
- **random_page_cost** = 4.0 (random page read)
- **cpu_tuple_cost** = 0.01 (process one row)
- **cpu_index_tuple_cost** = 0.005 (process index entry)

These can be tuned based on your hardware.

## Statistics

The planner uses **statistics** to estimate costs:
- **pg_statistic** - Column statistics (distribution, nulls, etc.)
- **pg_class** - Table size, row count
- **pg_stats** - Human-readable statistics view

Statistics are updated by **ANALYZE**.

## Common Plan Types

### Sequential Scan

Reads entire table:
```
Seq Scan on users
  Cost: 0.00..1000.00
  Rows: 10000
```

**When used**: Small tables, no useful index, large portion of table

### Index Scan

Uses index to find rows:
```
Index Scan using users_email_idx on users
  Index Cond: (email = 'user@example.com')
  Cost: 0.29..8.30
  Rows: 1
```

**When used**: Selective queries, indexed columns

### Index Only Scan

Reads only from index:
```
Index Only Scan using users_email_idx on users
  Index Cond: (email = 'user@example.com')
  Heap Fetches: 0
```

**When used**: All needed columns are in index

### Bitmap Index Scan

Builds bitmap of matching rows:
```
Bitmap Heap Scan on users
  Recheck Cond: (status = 'active')
  -> Bitmap Index Scan on users_status_idx
```

**When used**: Multiple index conditions, moderate selectivity

## Join Methods

### Nested Loop Join

For each row in outer table, scan inner:
```
Nested Loop
  -> Seq Scan on orders
  -> Index Scan using users_pkey on users
```

**When used**: Small tables, indexed inner table

### Hash Join

Build hash table from one table, probe with other:
```
Hash Join
  Hash Cond: (orders.user_id = users.id)
  -> Seq Scan on orders
  -> Hash
      -> Seq Scan on users
```

**When used**: Larger tables, no useful indexes

### Merge Join

Sort both tables, then merge:
```
Merge Join
  Merge Cond: (orders.user_id = users.id)
  -> Index Scan using orders_user_id_idx on orders
  -> Index Scan using users_pkey on users
```

**When used**: Both inputs sorted, large datasets

## Factors Affecting Planning

1. **Table size** - Larger tables favor indexes
2. **Selectivity** - How many rows match
3. **Indexes available** - What indexes exist
4. **Statistics freshness** - When ANALYZE last ran
5. **Configuration** - Cost parameters, work_mem, etc.

## Viewing Plans

```sql
-- Basic plan
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

-- Plan with execution stats
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Detailed plan
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT * FROM users WHERE email = 'user@example.com';
```

## Common Planning Issues

### 1. Outdated Statistics

```sql
-- Check when statistics were last updated
SELECT 
    schemaname,
    tablename,
    last_analyze,
    n_live_tup
FROM pg_stat_user_tables
WHERE last_analyze IS NULL OR last_analyze < NOW() - INTERVAL '1 day';
```

**Problem**: Planner uses stale statistics
**Solution**: Run ANALYZE regularly

### 2. Missing Indexes

```sql
-- Find sequential scans
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 1000
ORDER BY seq_tup_read DESC;
```

**Problem**: Planner chooses sequential scan
**Solution**: Add appropriate indexes

### 3. Poor Selectivity Estimates

```sql
-- Compare estimated vs actual rows
EXPLAIN ANALYZE SELECT * FROM users WHERE created_at > '2024-01-01';
```

**Problem**: Planner underestimates/overestimates rows
**Solution**: Update statistics, consider extended statistics

## Best Practices

1. **Keep statistics fresh** - Run ANALYZE regularly
2. **Add appropriate indexes** - Match query patterns
3. **Monitor query plans** - Watch for plan changes
4. **Tune cost parameters** - Match your hardware
5. **Use EXPLAIN ANALYZE** - See actual vs estimated

:::tip Production Insight
The planner is usually right, but when it's wrong, it can cause severe performance issues. Understanding how it works helps you fix bad plans.
:::

## Next Steps

Continue to [EXPLAIN and Query Plans](./explain-plans) to learn how to read and interpret query plans.

