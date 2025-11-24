# Streaming Replication

## Overview

**Streaming replication** creates physical replicas of the primary database by continuously streaming WAL records. It's the foundation of PostgreSQL high availability and read scaling.

## How Streaming Replication Works

1. **Primary writes to WAL** - All changes logged to WAL
2. **WAL records streamed** - Sent to replicas in real-time
3. **Replica applies WAL** - Replays WAL records to stay in sync
4. **Replica stays current** - Usually within seconds of primary

## Primary Configuration

### postgresql.conf

```conf
# Enable WAL for replication
wal_level = replica  # or 'logical' for logical replication

# Allow replication connections
max_wal_senders = 3  # Number of concurrent replicas

# Keep WAL segments for replicas
wal_keep_size = 1GB  # Or use replication slots

# For synchronous replication (optional)
synchronous_standby_names = 'ANY 1 (replica1, replica2)'
```

### pg_hba.conf

```conf
# Allow replication user
host    replication     replicator     0.0.0.0/0               md5
```

### Create Replication User

```sql
CREATE USER replicator WITH REPLICATION PASSWORD 'secure_password';
```

## Setting Up Replica

### Step 1: Base Backup

```bash
# On replica server
pg_basebackup \
  -h primary_host \
  -D /var/lib/postgresql/data \
  -U replicator \
  -P \
  -W \
  -R \
  -S replica_slot_name
```

**Options:**
- `-h`: Primary host
- `-D`: Data directory
- `-U`: Replication user
- `-P`: Show progress
- `-W`: Prompt for password
- `-R`: Create recovery configuration
- `-S`: Use replication slot

### Step 2: Configure Replica

The `-R` flag creates `standby.signal` and `postgresql.auto.conf`:

```conf
# postgresql.auto.conf (auto-generated)
primary_conninfo = 'host=primary_host port=5432 user=replicator password=secure_password'
primary_slot_name = 'replica_slot_name'
```

### Step 3: Start Replica

```bash
# Start PostgreSQL on replica
systemctl start postgresql
```

## Replication Slots

**Replication slots** prevent WAL from being deleted before replicas receive it:

```sql
-- Create slot on primary
SELECT pg_create_physical_replication_slot('replica_slot_name');

-- Check slots
SELECT * FROM pg_replication_slots;

-- Drop slot (when replica removed)
SELECT pg_drop_replication_slot('replica_slot_name');
```

:::warning Important
Without replication slots, if a replica falls behind, WAL may be deleted and the replica cannot catch up. Always use slots for production.
:::

## Monitoring Replication

### On Primary

```sql
-- View replication status
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    sync_state,
    sync_priority,
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) as sent_lag_bytes,
    pg_wal_lsn_diff(sent_lsn, write_lsn) as write_lag_bytes,
    pg_wal_lsn_diff(write_lsn, flush_lsn) as flush_lag_bytes,
    pg_wal_lsn_diff(flush_lsn, replay_lsn) as replay_lag_bytes
FROM pg_stat_replication;
```

### On Replica

```sql
-- Check if in recovery
SELECT pg_is_in_recovery();

-- Check replication lag
SELECT 
    pg_current_wal_lsn() as primary_lsn,
    pg_last_wal_receive_lsn() as received_lsn,
    pg_last_wal_replay_lsn() as replayed_lsn,
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(),
            pg_last_wal_replay_lsn()
        )
    ) as lag;
```

## Synchronous vs Asynchronous

### Asynchronous (Default)

```conf
# postgresql.conf (primary)
synchronous_standby_names = ''  # Empty = async
```

**Characteristics:**
- Primary doesn't wait for replica
- Lower latency
- Risk of data loss if primary fails

### Synchronous

```conf
# postgresql.conf (primary)
synchronous_standby_names = 'ANY 1 (replica1, replica2)'
```

**Characteristics:**
- Primary waits for replica confirmation
- Zero data loss (if replica available)
- Higher latency
- Primary blocks if replica unavailable

:::tip Production Insight
Use synchronous replication only when zero data loss is required. For most use cases, asynchronous with replication slots is sufficient.
:::

## Promoting Replica to Primary

### Manual Promotion

```sql
-- On replica
SELECT pg_promote();
```

Or:

```bash
# Create trigger file
touch /var/lib/postgresql/data/promote
```

### Automatic Promotion

Configure in `postgresql.conf`:

```conf
# Automatically promote if primary unavailable
promote_trigger_file = '/tmp/promote'
```

## Common Issues

### Issue 1: Replica Falls Behind

**Symptoms:**
- Large replication lag
- Replica can't catch up

**Solutions:**
- Use replication slots
- Increase `wal_keep_size`
- Check network connectivity
- Ensure replica has sufficient resources

### Issue 2: Replication Slot Lag

```sql
-- Check slot lag
SELECT 
    slot_name,
    pg_size_pretty(pg_wal_lsn_diff(
        pg_current_wal_lsn(),
        confirmed_flush_lsn
    )) as lag
FROM pg_replication_slots;
```

**Problem:** Slot lag grows, consuming disk space
**Solution:** Ensure replica is running and connected

### Issue 3: Connection Issues

```sql
-- Check replication connections
SELECT * FROM pg_stat_replication WHERE state != 'streaming';
```

**Solutions:**
- Verify pg_hba.conf allows replication
- Check network connectivity
- Verify replication user credentials
- Check firewall rules

## Best Practices

1. **Always use replication slots** - Prevent WAL deletion
2. **Monitor replication lag** - Set up alerts
3. **Test failover regularly** - Know your procedures
4. **Use async for read scaling** - Lower latency
5. **Use sync for zero data loss** - When required
6. **Multiple replicas** - For high availability

:::tip Production Insight
Streaming replication is the foundation of PostgreSQL HA. Master it before moving to more complex solutions like Patroni.
:::

## Next Steps

Continue to [Logical Replication](./logical-replication) to learn about selective table replication.

## Field Notes & Industry Reads

- [Crunchy Data — Streaming Replication Deep Dive](https://www.crunchydata.com/blog/) — WAL streaming internals, `pg_stat_replication` dashboards, and failure drills.
- [Percona Blog — Tuning PostgreSQL Replication](https://www.percona.com/blog/) — War stories on replica lag, slot bloat, and WAL compression.
- [AWS Database Blog — Designing HA PostgreSQL](https://aws.amazon.com/blogs/database/) — Reference architectures mixing sync and async replicas across AZs.
- [EDB Blog — WAL Performance Tuning](https://www.enterprisedb.com/blog) — Storage sizing, `wal_keep_size`, and network tuning in real customer incidents.
- [Microsoft Azure Postgres Blog — Multi-region Replication Patterns](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/bg-p/AzureDatabaseforPostgreSQLBlog) — Guidance for cross-region read replicas and failover automation.

