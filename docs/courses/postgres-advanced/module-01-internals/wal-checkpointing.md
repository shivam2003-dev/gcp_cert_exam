# Write-Ahead Log (WAL) & Checkpointing

## What is WAL?

The **Write-Ahead Log (WAL)** is PostgreSQL's mechanism for ensuring durability. Every change to the database is first written to WAL before being applied to data files.

## Why WAL Exists

### The Durability Problem

Without WAL, PostgreSQL would need to:
1. Write data pages to disk immediately on every change
2. Wait for disk I/O to complete (slow!)
3. Handle partial writes if crash occurs

This is too slow for production systems.

### The WAL Solution

WAL provides:
- **Durability** - Changes are logged before commit
- **Performance** - Sequential writes are faster than random writes
- **Crash recovery** - Can replay WAL to restore state
- **Point-in-time recovery** - Restore to any point in time

## How WAL Works

### WAL Segments

WAL is divided into **segments** (typically 16MB each):
- Named like `000000010000000000000001`
- Stored in `pg_wal/` directory
- Written sequentially
- Recycled when no longer needed

### WAL Records

Each change creates a **WAL record** containing:
- **Transaction ID** - Which transaction made the change
- **Resource Manager** - Type of change (heap, index, etc.)
- **Data** - The actual change (row data, index entry, etc.)
- **Location** - Where the change should be applied

### LSN (Log Sequence Number)

Every WAL record has a unique **LSN (Log Sequence Number)**:
- Sequential identifier for WAL position
- Format: `X/YYYYYYYY` (segment number / offset)
- Used to track replication lag
- Used for point-in-time recovery

```sql
-- Check current WAL position
SELECT pg_current_wal_lsn();

-- Check WAL position on replica
SELECT pg_last_wal_replay_lsn();
```

## The Write Path

When you execute `INSERT`, `UPDATE`, or `DELETE`:

1. **Transaction modifies data** in shared buffers (memory)
2. **WAL record created** describing the change
3. **WAL record written** to WAL file (fsync to disk)
4. **Transaction commits** (returns to client)
5. **Data pages remain in memory** (not yet written to disk)

Later, checkpoint writes dirty pages to disk.

:::tip Performance Insight
WAL writes are sequential and fast. Data page writes are random and slow. By writing WAL first, PostgreSQL can return quickly while safely deferring data page writes.
:::

## Checkpointing

**Checkpoints** are points where PostgreSQL:
1. Writes all dirty pages to disk
2. Updates control file with checkpoint location
3. Recycles old WAL segments

### Checkpoint Process

```sql
-- Force a checkpoint
CHECKPOINT;

-- Check checkpoint settings
SHOW checkpoint_timeout;
SHOW max_wal_size;
SHOW min_wal_size;
```

### Checkpoint Configuration

```conf
# postgresql.conf
checkpoint_timeout = 5min          # Time between checkpoints
max_wal_size = 1GB                 # Trigger checkpoint if WAL exceeds this
min_wal_size = 80MB                # Minimum WAL to keep
checkpoint_completion_target = 0.9 # Spread checkpoint I/O over 90% of interval
```

:::warning What Breaks in Production
If `max_wal_size` is too small, checkpoints happen too frequently, causing I/O spikes. If too large, recovery time increases. Tune based on your write workload.
:::

## WAL Archiving

**WAL archiving** copies WAL segments to external storage for:
- Point-in-time recovery (PITR)
- Standby replication
- Backup and restore

### Enabling WAL Archiving

```conf
# postgresql.conf
wal_level = replica              # or 'logical' for logical replication
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

### Archive Command

The archive command runs for each completed WAL segment:
- `%p` - Path to WAL file
- `%f` - WAL filename
- Must return 0 on success
- Should not block (use async copy if needed)

```bash
# Example: Archive to S3
archive_command = 'aws s3 cp %p s3://mybucket/wal/%f'
```

:::danger Critical Production Issue
If archive_command fails, PostgreSQL will stop accepting writes! Monitor archive_command success. Use a tool like `pgbackrest` or `wal-g` for reliable archiving.
:::

## WAL Replay

During crash recovery or replica startup:
1. PostgreSQL reads WAL from last checkpoint
2. Replays WAL records in order
3. Applies changes to data pages
4. Database becomes consistent

### Recovery Settings

```conf
# Recovery configuration (recovery.conf or postgresql.conf)
restore_command = 'cp /backup/wal/%f %p'
recovery_target_time = '2024-01-15 14:30:00'
recovery_target_action = 'promote'
```

## WAL Statistics

```sql
-- Check WAL generation rate
SELECT 
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0')) as total_wal,
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(), 
            pg_stat_file('pg_wal/archive_status/000000010000000000000001.ready', true)
        )
    ) as wal_since_last_archive;

-- Check WAL usage
SELECT 
    pg_size_pretty(sum(size)) as total_size,
    count(*) as num_segments
FROM pg_ls_waldir();
```

## WAL Performance Tuning

### Write Performance

```conf
# Increase WAL buffers for high write loads
wal_buffers = 16MB

# Group commits to reduce fsync calls
commit_delay = 0
commit_siblings = 5
```

### Replication Performance

```conf
# For replicas: Increase WAL receiver buffers
wal_receiver_timeout = 60s
wal_receiver_status_interval = 10s
```

## Common WAL Issues

### 1. WAL Disk Full

```sql
-- Check WAL directory size
SELECT pg_size_pretty(sum(size)) 
FROM pg_ls_waldir();
```

**Problem**: WAL directory fills up, database stops
**Solution**: Increase `max_wal_size`, ensure archiving works, add disk space

### 2. Slow Checkpoints

```sql
-- Check checkpoint statistics
SELECT * FROM pg_stat_bgwriter;
```

**Problem**: Checkpoints take too long, cause I/O spikes
**Solution**: Increase `checkpoint_timeout`, tune `checkpoint_completion_target`, use faster storage

### 3. Archive Lag

```sql
-- Check replication lag
SELECT 
    pg_current_wal_lsn() as primary_lsn,
    pg_last_wal_replay_lsn() as replica_lsn,
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(),
            pg_last_wal_replay_lsn()
        )
    ) as lag;
```

**Problem**: Replica falls behind, archive command fails
**Solution**: Fix network issues, increase `wal_receiver_timeout`, check replica performance

## Best Practices

1. **Enable WAL archiving** for production databases
2. **Monitor WAL generation rate** to size storage
3. **Tune checkpoint settings** based on write patterns
4. **Test recovery procedures** regularly
5. **Use reliable archive commands** (pgbackrest, wal-g)
6. **Monitor disk space** for WAL directory

:::tip Production Insight
WAL is the foundation of PostgreSQL's durability and replication. Understanding it is essential for production operations. A broken WAL archive means you can't recover from failures.
:::

## Next Steps

Continue to [Buffer Cache & Shared Buffers](./buffer-cache) to understand how PostgreSQL manages memory.

