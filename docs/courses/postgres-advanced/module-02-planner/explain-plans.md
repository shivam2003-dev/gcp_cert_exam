# EXPLAIN and Query Plans

## Understanding EXPLAIN

`EXPLAIN` shows you how PostgreSQL plans to execute a query without actually running it. `EXPLAIN ANALYZE` actually executes the query and shows real execution statistics.

## Basic EXPLAIN

```sql
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
```

Output:
```
Index Scan using users_email_idx on users
  Index Cond: (email = 'user@example.com')
  Cost: 0.29..8.30
  Rows: 1
```

## EXPLAIN Options

### ANALYZE

Actually executes the query and shows real statistics:

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
```

Shows:
- Actual execution time
- Actual rows returned
- Actual loops
- Comparison with estimates

### BUFFERS

Shows buffer (cache) usage:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE email = 'user@example.com';
```

Shows:
- Shared blocks hit (from cache)
- Shared blocks read (from disk)
- Local blocks hit/read
- Temp blocks read/written

### VERBOSE

Shows additional details:

```sql
EXPLAIN (ANALYZE, VERBOSE, BUFFERS) SELECT * FROM users WHERE email = 'user@example.com';
```

Shows:
- Output column names
- Schema-qualified table names
- More detailed information

### FORMAT

Output in different formats:

```sql
EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM users;
EXPLAIN (ANALYZE, FORMAT YAML) SELECT * FROM users;
EXPLAIN (ANALYZE, FORMAT XML) SELECT * FROM users;
EXPLAIN (ANALYZE, FORMAT TEXT) SELECT * FROM users;  -- Default
```

## Reading Query Plans

### Plan Structure

Plans are tree-structured, read from inner to outer:

```
Nested Loop
  -> Index Scan using users_pkey on users
        Index Cond: (id = 123)
        Rows: 1
  -> Index Scan using orders_user_id_idx on orders
        Index Cond: (user_id = users.id)
        Rows: 5
```

Execution order:
1. Scan users table (inner)
2. For each user row, scan orders (outer)
3. Join results

### Cost Estimates

Cost format: `startup_cost..total_cost`

- **Startup cost**: Cost before first row returned
- **Total cost**: Cost to return all rows
- Units: Arbitrary (based on cost parameters)

```sql
EXPLAIN SELECT * FROM users;
```

```
Seq Scan on users
  Cost: 0.00..1000.00
  Rows: 10000
```

- `0.00` - No startup cost (can return rows immediately)
- `1000.00` - Total cost to scan all rows
- `10000` - Estimated rows

### Row Estimates

Planner estimates how many rows each operation will return:
- Based on statistics
- May be inaccurate if statistics are stale
- Compare with actual rows in EXPLAIN ANALYZE

## Common Plan Nodes

### Sequential Scan

```
Seq Scan on users
  Filter: (status = 'active')
  Rows Removed by Filter: 5000
```

- Scans entire table
- Filters rows in memory
- Used when: No useful index, large portion of table needed

### Index Scan

```
Index Scan using users_email_idx on users
  Index Cond: (email = 'user@example.com')
```

- Uses index to find rows
- Then fetches data from table
- Used when: Selective query, index available

### Index Only Scan

```
Index Only Scan using users_email_idx on users
  Index Cond: (email = 'user@example.com')
  Heap Fetches: 0
```

- Reads only from index
- No table access needed
- Fastest when all columns in index

### Bitmap Index Scan

```
Bitmap Heap Scan on users
  Recheck Cond: (status = 'active')
  -> Bitmap Index Scan on users_status_idx
```

- Builds bitmap of matching rows
- Then fetches those rows
- Used when: Multiple conditions, moderate selectivity

### Nested Loop Join

```
Nested Loop
  -> Seq Scan on orders
        Rows: 1000
  -> Index Scan using users_pkey on users
        Index Cond: (id = orders.user_id)
        Rows: 1
```

- For each row in outer, scan inner
- Used when: Small outer table, indexed inner table

### Hash Join

```
Hash Join
  Hash Cond: (orders.user_id = users.id)
  -> Seq Scan on orders
  -> Hash
      -> Seq Scan on users
```

- Builds hash table from one table
- Probes with other table
- Used when: Larger tables, no useful indexes

### Merge Join

```
Merge Join
  Merge Cond: (orders.user_id = users.id)
  -> Index Scan using orders_user_id_idx on orders
  -> Index Scan using users_pkey on users
```

- Sorts both inputs
- Merges sorted streams
- Used when: Both inputs sorted, large datasets

## Interpreting EXPLAIN ANALYZE

### Good Plan Indicators

- **Actual rows close to estimated rows** - Statistics are accurate
- **High cache hit ratio** - Data in shared buffers
- **Fast execution time** - Meets performance requirements
- **Appropriate join method** - Matches data size

### Bad Plan Indicators

- **Large difference between estimated and actual rows** - Stale statistics
- **High "Rows Removed by Filter"** - Inefficient filtering
- **Many buffer reads** - Data not in cache
- **Slow execution time** - Plan not optimal

### Example: Good vs Bad Plan

**Bad Plan:**
```
Seq Scan on users
  Filter: (email = 'user@example.com')
  Rows Removed by Filter: 99999
  Actual Rows: 1
  Actual Time: 150.234 ms
```

**Good Plan:**
```
Index Scan using users_email_idx on users
  Index Cond: (email = 'user@example.com')
  Actual Rows: 1
  Actual Time: 0.123 ms
```

## Debugging Slow Queries

### Step 1: Get the Plan

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT * FROM users WHERE email = 'user@example.com';
```

### Step 2: Identify Bottlenecks

Look for:
- **High actual time** - Slow operations
- **Many buffer reads** - Disk I/O bottleneck
- **Large row estimates** - Inaccurate statistics
- **Sequential scans** - Missing indexes
- **Nested loops on large tables** - Wrong join method

### Step 3: Check Statistics

```sql
-- Check when statistics were last updated
SELECT 
    schemaname,
    tablename,
    last_analyze,
    n_live_tup
FROM pg_stat_user_tables
WHERE tablename = 'users';
```

### Step 4: Compare Plans

Run EXPLAIN with different configurations:

```sql
-- With index
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Without index (temporarily disable)
SET enable_indexscan = off;
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
RESET enable_indexscan;
```

## Common Plan Issues

### Issue 1: Planner Choosing Sequential Scan

**Symptom:**
```
Seq Scan on large_table
  Filter: (id = 12345)
  Rows Removed by Filter: 999999
```

**Cause:** Planner thinks sequential scan is cheaper
**Solution:** 
- Update statistics: `ANALYZE large_table;`
- Check if index exists and is being used
- Consider partial indexes

### Issue 2: Inaccurate Row Estimates

**Symptom:**
```
Estimated Rows: 100
Actual Rows: 10000
```

**Cause:** Stale or missing statistics
**Solution:**
```sql
ANALYZE table_name;
-- Or for specific columns
ANALYZE table_name (column1, column2);
```

### Issue 3: Nested Loop on Large Tables

**Symptom:**
```
Nested Loop
  -> Seq Scan on large_table1
  -> Seq Scan on large_table2
```

**Cause:** No useful indexes, small work_mem
**Solution:**
- Add indexes on join columns
- Increase work_mem
- Consider hash join instead

## Best Practices

1. **Always use EXPLAIN ANALYZE** - See actual performance
2. **Include BUFFERS** - Understand cache usage
3. **Compare estimated vs actual** - Check statistics accuracy
4. **Look for sequential scans** - May need indexes
5. **Check join methods** - Ensure appropriate for data size
6. **Monitor plan changes** - After schema or data changes

:::tip Production Insight
Understanding query plans is the first step to fixing slow queries. Most performance issues are visible in the plan - you just need to know what to look for.
:::

## Next Steps

Continue to [Index Types Deep Dive](./index-types) to understand different index types and when to use them.

