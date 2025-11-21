# Memory Tuning

## Overview

Memory configuration is critical for PostgreSQL performance. This chapter covers key memory settings.

## Key Memory Settings

### shared_buffers

Memory used for caching data pages.

```conf
# Recommended: 25% of RAM for dedicated server
shared_buffers = 4GB  # For 16GB RAM server
```

**Guidelines:**
- **Too small:** Low cache hit ratio, high disk I/O
- **Too large:** Less memory for OS cache, may cause swapping
- **Sweet spot:** 25% of total RAM

### work_mem

Memory used per sort/hash operation.

```conf
# Per operation (can be used multiple times per query)
work_mem = 64MB
```

**Calculation:**
```
Total work_mem = work_mem × max_connections × avg_operations_per_query
```

**Example:**
- work_mem = 64MB
- max_connections = 100
- avg_operations = 2
- Total = 64MB × 100 × 2 = 12.8GB

:::warning Memory Exhaustion
If work_mem × max_connections is too high, you'll run out of memory. Calculate carefully!
:::

### effective_cache_size

Hint for query planner about available cache.

```conf
# Total memory available for caching (OS + shared_buffers)
effective_cache_size = 12GB  # For 16GB RAM server
```

**Guidelines:**
- 50-75% of total RAM
- Doesn't allocate memory
- Just a hint for planner

### maintenance_work_mem

Memory for maintenance operations.

```conf
# Can be larger than work_mem
maintenance_work_mem = 1GB
```

**Used for:**
- VACUUM
- CREATE INDEX
- ALTER TABLE
- REINDEX

## Memory Architecture

```
Total RAM (16GB)
├── OS & Other (4GB)
├── PostgreSQL Shared Memory (4GB)
│   ├── shared_buffers (4GB)
│   ├── WAL buffers
│   └── Other shared structures
└── Per-Connection Memory (8GB)
    ├── work_mem × connections
    └── Other per-connection memory
```

## Tuning Guidelines

### For Dedicated Server

```conf
# 16GB RAM example
shared_buffers = 4GB              # 25%
effective_cache_size = 12GB       # 75%
work_mem = 64MB                   # Adjust based on connections
maintenance_work_mem = 1GB        # For maintenance
max_connections = 100             # Adjust based on needs
```

### For Shared Server

```conf
# Less aggressive settings
shared_buffers = 2GB              # 25% of available
effective_cache_size = 6GB        # 75% of available
work_mem = 32MB                   # Lower to prevent exhaustion
max_connections = 50              # Fewer connections
```

## Monitoring Memory Usage

```sql
-- Check shared_buffers
SHOW shared_buffers;

-- Check cache hit ratio
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    round(100.0 * sum(heap_blks_hit) / 
        (sum(heap_blks_hit) + sum(heap_blks_read)), 2) as cache_hit_ratio
FROM pg_statio_user_tables;

-- Check work_mem usage
SELECT 
    count(*) as active_queries,
    sum(work_mem) as total_work_mem
FROM pg_stat_activity
WHERE state = 'active';
```

## Common Issues

### Low Cache Hit Ratio

**Symptom:** Cache hit ratio less than 95%

**Solution:**
- Increase shared_buffers
- Add indexes to reduce full table scans
- Optimize queries

### Memory Exhaustion

**Symptom:** Out of memory errors, swapping

**Solution:**
- Reduce work_mem
- Reduce max_connections
- Use connection pooling

### Swapping

**Symptom:** Slow performance, high I/O wait

**Solution:**
- Reduce PostgreSQL memory usage
- Add more RAM
- Tune OS swappiness

## Best Practices

1. **Start with defaults** - Tune based on actual needs
2. **Monitor cache hit ratio** - Aim for greater than 99%
3. **Calculate work_mem carefully** - Prevent exhaustion
4. **Test changes** - Measure impact
5. **Document settings** - Know why each setting is configured

:::tip Production Insight
Memory tuning can provide 10-100x performance improvements. It's one of the highest-impact optimizations.
:::

## Next Steps

Continue to [I/O Tuning](./io-tuning) to learn about disk and storage optimization.
