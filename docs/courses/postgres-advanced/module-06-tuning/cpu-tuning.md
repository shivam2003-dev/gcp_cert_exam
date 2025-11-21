# CPU Optimization

## Overview

PostgreSQL can use multiple CPU cores through parallel queries. This chapter covers CPU-related settings and optimization.

## Parallel Query Settings

### max_parallel_workers_per_gather

Maximum parallel workers per query.

```conf
# Allow 4 parallel workers
max_parallel_workers_per_gather = 4
```

**Guidelines:**
- Set to number of CPU cores / 2
- Too many workers can hurt performance
- Planner decides when to use parallel

### max_parallel_workers

Total parallel workers across all queries.

```conf
max_parallel_workers = 8
```

### parallel_setup_cost

Cost threshold for parallel query setup.

```conf
# Lower = more likely to use parallel
parallel_setup_cost = 1000.0
```

### parallel_tuple_cost

Cost per tuple in parallel query.

```conf
parallel_tuple_cost = 0.01
```

## When Parallel Queries Are Used

PostgreSQL uses parallel queries when:
- Table is large enough
- Query benefits from parallelization
- Workers available
- Cost estimate favors parallel

### Example

```sql
-- Large table scan
EXPLAIN ANALYZE
SELECT COUNT(*) FROM large_table WHERE status = 'active';
```

**Plan:**
```
Finalize Aggregate
  -> Gather
      Workers Planned: 4
      -> Partial Aggregate
          -> Parallel Seq Scan on large_table
```

## Monitoring Parallel Queries

```sql
-- Check parallel query usage
SELECT 
    query,
    plan,
    execution_time
FROM pg_stat_statements
WHERE query LIKE '%Gather%'
ORDER BY execution_time DESC;
```

## CPU-Related Settings

### cpu_tuple_cost

Cost of processing one tuple.

```conf
cpu_tuple_cost = 0.01
```

### cpu_index_tuple_cost

Cost of processing one index tuple.

```conf
cpu_index_tuple_cost = 0.005
```

### cpu_operator_cost

Cost of processing one operator.

```conf
cpu_operator_cost = 0.0025
```

## NUMA Considerations

### Check NUMA

```bash
numactl --hardware
```

### NUMA-Aware Configuration

```bash
# Bind PostgreSQL to specific NUMA node
numactl --cpunodebind=0 --membind=0 postgres
```

## Best Practices

1. **Enable parallel queries** - For large tables
2. **Tune worker count** - Based on CPU cores
3. **Monitor usage** - Ensure parallel queries help
4. **Consider NUMA** - On multi-socket systems
5. **Balance workers** - Don't over-allocate

:::tip Production Insight
Parallel queries can significantly speed up large table scans and aggregations. Enable and tune based on your workload.
:::

## Next Steps

Continue to [OS Tuning](./os-tuning) to learn about kernel and filesystem tuning.
