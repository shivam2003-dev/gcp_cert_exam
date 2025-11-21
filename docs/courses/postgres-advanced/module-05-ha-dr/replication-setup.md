# Streaming Replication Setup

## Complete Setup Guide

This chapter provides a complete guide to setting up streaming replication for high availability.

## Prerequisites

- Two PostgreSQL servers (primary and replica)
- Network connectivity between them
- PostgreSQL 10+ recommended

## Step 1: Primary Configuration

### postgresql.conf

```conf
# Enable WAL for replication
wal_level = replica

# Allow replication connections
max_wal_senders = 3

# Keep WAL for replicas (or use replication slots)
wal_keep_size = 1GB

# For synchronous replication (optional)
synchronous_standby_names = 'ANY 1 (replica1)'
```

### pg_hba.conf

```conf
# Allow replication user from replica
host    replication     replicator     replica_ip/32         md5
```

### Create Replication User

```sql
CREATE USER replicator WITH REPLICATION PASSWORD 'secure_password';
```

### Create Replication Slot

```sql
SELECT pg_create_physical_replication_slot('replica1_slot');
```

## Step 2: Replica Setup

### Base Backup

```bash
pg_basebackup \
  -h primary_host \
  -D /var/lib/postgresql/data \
  -U replicator \
  -P \
  -W \
  -R \
  -S replica1_slot \
  -Fp \
  -Xs
```

**Options:**
- `-R`: Create recovery configuration
- `-S`: Use replication slot
- `-Fp`: Plain format
- `-Xs`: Stream WAL during backup

### Verify Configuration

Check `postgresql.auto.conf`:

```conf
primary_conninfo = 'host=primary_host port=5432 user=replicator password=secure_password'
primary_slot_name = 'replica1_slot'
```

### Start Replica

```bash
systemctl start postgresql
```

## Step 3: Verify Replication

### On Primary

```sql
SELECT 
    application_name,
    state,
    sync_state,
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) as lag_bytes
FROM pg_stat_replication;
```

### On Replica

```sql
SELECT pg_is_in_recovery();

SELECT 
    pg_last_wal_receive_lsn() as received,
    pg_last_wal_replay_lsn() as replayed,
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(),
            pg_last_wal_replay_lsn()
        )
    ) as lag;
```

## Synchronous Replication Setup

For zero data loss:

### Primary Configuration

```conf
synchronous_standby_names = 'ANY 1 (replica1, replica2)'
```

### Replica Configuration

Set `application_name` in `primary_conninfo`:

```conf
primary_conninfo = '... application_name=replica1'
```

## Troubleshooting

### Replica Not Connecting

1. Check network connectivity
2. Verify pg_hba.conf
3. Check replication user credentials
4. Verify firewall rules

### Replication Lag

1. Check network bandwidth
2. Verify replica performance
3. Check for long-running queries on replica
4. Ensure replication slot exists

### Slot Lag Growing

```sql
SELECT 
    slot_name,
    pg_size_pretty(pg_wal_lsn_diff(
        pg_current_wal_lsn(),
        confirmed_flush_lsn
    )) as lag
FROM pg_replication_slots;
```

**Solution:** Ensure replica is running and connected

## Best Practices

1. **Always use replication slots** - Prevent WAL deletion
2. **Monitor replication lag** - Set up alerts
3. **Test failover regularly** - Know your procedures
4. **Document configuration** - For operations team
5. **Use monitoring** - Track replication health

## Next Steps

Continue to [Patroni Clusters](./patroni) for automated HA management.
