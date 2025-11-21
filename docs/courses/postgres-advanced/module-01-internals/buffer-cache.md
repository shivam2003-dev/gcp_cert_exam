# Buffer Cache & Shared Buffers

## Overview

PostgreSQL uses a **shared buffer cache** to keep frequently accessed data pages in memory. Understanding how this works is critical for performance tuning.

## The Problem: Disk I/O is Slow

Reading from disk is **orders of magnitude slower** than memory:
- **Memory access**: ~100 nanoseconds
- **SSD access**: ~100 microseconds (1000x slower)
- **HDD access**: ~10 milliseconds (100,000x slower)

PostgreSQL minimizes disk I/O by caching pages in memory.

## Shared Buffers

**Shared buffers** is a fixed-size memory area shared by all PostgreSQL processes:
- Stores copies of disk pages (8KB each)
- Managed by the buffer manager
- Uses clock-sweep algorithm for eviction
- Size controlled by `shared_buffers` setting

### Configuration

```conf
# postgresql.conf
shared_buffers = 4GB  # Typically 25% of RAM for dedicated server
```

:::warning Common Mistake
Setting `shared_buffers` too high can hurt performance. The OS page cache also caches files, so you need both. Typical recommendation: 25% of RAM for shared_buffers, leave rest for OS cache.
:::

## How Buffer Cache Works

### Reading Pages

When PostgreSQL needs a page:

1. **Check shared buffers** - Is page already in memory?
2. **If found (cache hit)**: Return page from memory
3. **If not found (cache miss)**: 
   - Read page from disk
   - Load into shared buffers
   - Return page to requester

### Writing Pages

When a page is modified:

1. **Page marked dirty** in shared buffers
2. **WAL record written** (for durability)
3. **Page remains in memory** (not immediately written to disk)
4. **Checkpoint writes dirty pages** to disk later

This is the **write-back cache** strategy.

## Buffer Management

### Clock-Sweep Algorithm

PostgreSQL uses **clock-sweep** to evict pages:
- Each buffer has a usage counter
- Sweep through buffers, decrementing counters
- Evict buffers with counter = 0
- Reset counters for accessed buffers

This approximates LRU (Least Recently Used) with lower overhead.

### Buffer States

Buffers can be in different states:
- **Unused** - Empty slot, available for new page
- **Pinned** - Currently in use, cannot be evicted
- **Dirty** - Modified but not yet written to disk
- **Clean** - Matches disk, can be evicted

## Buffer Statistics

```sql
-- Check buffer cache hit ratio
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    round(100.0 * sum(heap_blks_hit) / 
        (sum(heap_blks_hit) + sum(heap_blks_read)), 2) as cache_hit_ratio
FROM pg_statio_user_tables;

-- Check overall cache hit ratio
SELECT 
    'index hit rate' as name,
    (sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read), 0) as ratio
FROM pg_statio_user_indexes
UNION ALL
SELECT 
    'table hit rate' as name,
    sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) as ratio
FROM pg_statio_user_tables;
```

:::tip Production Metric
A cache hit ratio below 99% indicates insufficient shared_buffers or poor access patterns. Aim for greater than 99% for OLTP workloads.
:::

## Effective Cache Size

**effective_cache_size** tells the planner how much memory is available for caching:

```conf
# postgresql.conf
effective_cache_size = 12GB  # Total memory available for caching (OS + shared_buffers)
```

This affects query planning:
- Planner assumes data might be in cache
- Chooses plans that benefit from cached data
- Important for index vs sequential scan decisions

:::note Important
`effective_cache_size` doesn't allocate memory - it's just a hint for the planner. Set it to total RAM minus other uses (typically 50-75% of RAM).
:::

## OS Page Cache

The operating system also caches file pages:
- PostgreSQL reads/writes through OS
- OS caches frequently accessed files
- Works alongside shared_buffers

**Double buffering**:
- Page in shared_buffers (PostgreSQL cache)
- Same page in OS page cache
- Some redundancy, but both serve different purposes

## Tuning Shared Buffers

### Too Small

**Symptoms**:
- Low cache hit ratio (less than 95%)
- High disk I/O
- Slow queries

**Solution**: Increase `shared_buffers`

### Too Large

**Symptoms**:
- OS has less memory for page cache
- May cause swapping
- Diminishing returns

**Solution**: Reduce `shared_buffers` (typically max 25-40% of RAM)

### Guidelines

| Total RAM | shared_buffers | effective_cache_size |
|-----------|----------------|---------------------|
| 4GB | 1GB | 3GB |
| 8GB | 2GB | 6GB |
| 16GB | 4GB | 12GB |
| 32GB | 8GB | 24GB |
| 64GB | 16GB | 48GB |

## Work Memory

**work_mem** is memory used for:
- Sort operations
- Hash joins
- Merge joins

```conf
# postgresql.conf
work_mem = 64MB  # Per operation, can be used multiple times per query
```

:::warning What Breaks in Production
If `work_mem` is too high and many concurrent queries run, total memory usage can exceed available RAM, causing swapping. Calculate: `work_mem * max_connections * avg_operations_per_query`
:::

## Maintenance Work Memory

**maintenance_work_mem** is used for:
- VACUUM
- CREATE INDEX
- ALTER TABLE
- Other maintenance operations

```conf
# postgresql.conf
maintenance_work_mem = 1GB  # Can be larger than work_mem
```

## Memory Architecture

```
Total RAM
├── OS (kernel, other processes)
├── PostgreSQL shared memory
│   ├── shared_buffers (25% of RAM)
│   ├── WAL buffers
│   ├── Lock space
│   └── Other shared structures
└── Per-connection memory
    ├── work_mem (per operation)
    ├── temp buffers
    └── Other per-connection memory
```

## Monitoring Memory Usage

```sql
-- Check shared_buffers usage
SELECT 
    setting as shared_buffers,
    pg_size_pretty(setting::bigint * 8192) as size
FROM pg_settings 
WHERE name = 'shared_buffers';

-- Check work_mem usage
SELECT 
    count(*) as active_queries,
    sum(work_mem) as total_work_mem
FROM pg_stat_activity
WHERE state = 'active';
```

## Common Issues

### 1. Low Cache Hit Ratio

```sql
-- Find tables with poor cache hit ratio
SELECT 
    schemaname,
    tablename,
    heap_blks_read,
    heap_blks_hit,
    round(100.0 * heap_blks_hit / (heap_blks_hit + heap_blks_read), 2) as hit_ratio
FROM pg_statio_user_tables
WHERE heap_blks_read > 0
ORDER BY heap_blks_read DESC
LIMIT 10;
```

**Problem**: Tables not fitting in cache
**Solution**: Increase `shared_buffers`, optimize queries, add indexes

### 2. Memory Exhaustion

```sql
-- Check for memory pressure
SELECT 
    setting as max_connections,
    setting::int * 
        (SELECT setting::int FROM pg_settings WHERE name = 'work_mem') 
    as max_work_mem
FROM pg_settings 
WHERE name = 'max_connections';
```

**Problem**: Too much memory allocated
**Solution**: Reduce `work_mem`, reduce `max_connections`, use connection pooling

### 3. Swapping

```bash
# Check for swapping (Linux)
free -h
vmstat 1
```

**Problem**: OS swapping to disk (very slow)
**Solution**: Reduce PostgreSQL memory usage, add RAM, tune OS swappiness

## Best Practices

1. **Set shared_buffers to 25% of RAM** for dedicated servers
2. **Set effective_cache_size to 50-75% of RAM**
3. **Monitor cache hit ratio** - aim for greater than 99%
4. **Tune work_mem carefully** - consider concurrent queries
5. **Use connection pooling** to reduce per-connection memory
6. **Monitor for swapping** - it kills performance

:::tip Production Insight
Memory tuning is one of the highest-impact optimizations. A well-tuned buffer cache can make queries 10-100x faster by avoiding disk I/O.
:::

## Next Steps

Continue to [Background Processes](./background-processes) to understand what PostgreSQL does behind the scenes.

