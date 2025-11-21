# I/O Tuning

## Overview

I/O performance is often the bottleneck for database performance. This chapter covers tuning PostgreSQL and the operating system for optimal I/O.

## PostgreSQL I/O Settings

### random_page_cost

Cost of random page access.

```conf
# Default: 4.0 (for HDD)
random_page_cost = 1.1  # For SSD
random_page_cost = 1.0  # For NVMe
```

**Impact:** Affects query planner decisions (index vs sequential scan)

### seq_page_cost

Cost of sequential page access.

```conf
seq_page_cost = 1.0  # Default, usually fine
```

### effective_io_concurrency

Number of concurrent I/O operations.

```conf
# For SSD
effective_io_concurrency = 200

# For HDD
effective_io_concurrency = 2
```

## Storage Types

### HDD (Hard Disk Drive)

**Characteristics:**
- Slow random I/O
- Sequential I/O acceptable
- Low cost

**Settings:**
```conf
random_page_cost = 4.0
seq_page_cost = 1.0
effective_io_concurrency = 2
```

### SSD (Solid State Drive)

**Characteristics:**
- Fast random I/O
- Low latency
- Higher cost

**Settings:**
```conf
random_page_cost = 1.1
seq_page_cost = 1.0
effective_io_concurrency = 200
```

### NVMe

**Characteristics:**
- Very fast random I/O
- Very low latency
- Highest cost

**Settings:**
```conf
random_page_cost = 1.0
seq_page_cost = 1.0
effective_io_concurrency = 300
```

## OS-Level Tuning

### I/O Scheduler

```bash
# Check current scheduler
cat /sys/block/sda/queue/scheduler

# Set scheduler (for SSD)
echo noop > /sys/block/sda/queue/scheduler
# or
echo deadline > /sys/block/sda/queue/scheduler
```

### Read-Ahead

```bash
# Check read-ahead
blockdev --getra /dev/sda

# Set read-ahead (for SSD, lower is better)
blockdev --setra 256 /dev/sda
```

### File System Options

**ext4:**
```bash
# Mount options
noatime,nodiratime,data=writeback
```

**XFS:**
```bash
# Good default for databases
noatime
```

## Separate WAL and Data

Place WAL on separate, faster storage:

```bash
# WAL on fast SSD
/data/postgresql/wal

# Data on slower, larger storage
/data/postgresql/data
```

**Benefits:**
- WAL writes are sequential and frequent
- Faster WAL improves overall performance
- Can use smaller, faster drive for WAL

## Monitoring I/O

### iostat

```bash
# Monitor I/O
iostat -x 1

# Key metrics:
# - %util: Utilization
# - await: Average wait time
# - r/s, w/s: Reads/writes per second
```

### PostgreSQL I/O Stats

```sql
-- Check I/O by table
SELECT 
    schemaname,
    tablename,
    heap_blks_read,
    heap_blks_hit,
    idx_blks_read,
    idx_blks_hit
FROM pg_statio_user_tables
ORDER BY heap_blks_read DESC;
```

## Best Practices

1. **Use SSD for production** - Worth the cost
2. **Separate WAL and data** - If possible
3. **Tune cost parameters** - Match your storage
4. **Monitor I/O** - Identify bottlenecks
5. **Optimize queries** - Reduce I/O needs

:::tip Production Insight
I/O is often the bottleneck. Using SSD and proper tuning can provide significant performance improvements.
:::

## Next Steps

Continue to [CPU Optimization](./cpu-tuning) to learn about parallel queries and CPU settings.
