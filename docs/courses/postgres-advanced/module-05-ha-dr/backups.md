# Backup Strategies

## Overview

Backups are essential for disaster recovery. This chapter covers different backup methods and when to use them.

## Backup Types

### 1. Logical Backups (pg_dump)

**pg_dump** creates SQL scripts that can recreate the database.

#### Basic Usage

```bash
# Dump entire database
pg_dump mydb > backup.sql

# Restore
psql mydb < backup.sql
```

#### Options

```bash
# Custom format (compressed, flexible)
pg_dump -Fc mydb > backup.dump

# Restore custom format
pg_restore -d mydb backup.dump

# Dump specific schema
pg_dump -n public mydb > backup.sql

# Dump specific tables
pg_dump -t users -t orders mydb > backup.sql

# Parallel dump (PostgreSQL 11+)
pg_dump -j 4 -Fd mydb -f backup_dir/
```

#### Pros and Cons

**Pros:**
- Portable across versions
- Selective restore
- Human-readable
- Can restore to different database

**Cons:**
- Slower for large databases
- Requires database to be accessible
- Not point-in-time (unless combined with WAL)

### 2. Physical Backups (pg_basebackup)

**pg_basebackup** creates binary copy of database cluster.

#### Basic Usage

```bash
# Full backup
pg_basebackup -D /backup/base -Ft -z -P

# Restore
tar -xzf base.tar.gz -C /var/lib/postgresql/data
```

#### Options

```bash
# Stream WAL during backup
pg_basebackup -D /backup -Ft -z -P -Xs

# Use replication slot
pg_basebackup -D /backup -Ft -z -P -S backup_slot

# Fast mode (no verification)
pg_basebackup -D /backup -Ft -z -P --no-verify-checksums
```

#### Pros and Cons

**Pros:**
- Fast for large databases
- Exact copy
- Works with PITR

**Cons:**
- Not portable across versions
- Requires full cluster restore
- Larger size

### 3. Continuous Archiving (PITR)

Combines base backup with WAL archiving for point-in-time recovery.

#### Setup

```conf
# postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

#### Backup Process

1. Take base backup
2. Archive WAL continuously
3. Can restore to any point in time

#### Restore

```conf
# recovery.conf or postgresql.conf
restore_command = 'cp /backup/wal/%f %p'
recovery_target_time = '2024-01-15 14:30:00'
```

## Backup Tools

### pgBackRest

Enterprise-grade backup tool:

```bash
# Configure
pgbackrest.conf:
[global]
repo1-path=/backup
repo1-retention-full=2

[db]
db1-host=localhost
db1-path=/var/lib/postgresql/data

# Full backup
pgbackrest backup --type=full

# Incremental backup
pgbackrest backup --type=incr

# Restore
pgbackrest restore --stanza=db --type=time --target="2024-01-15 14:30:00"
```

### Barman

Backup and recovery manager:

```bash
# Setup
barman-server backup-server

# Backup
barman backup backup-server

# Restore
barman recover backup-server latest /restore/path
```

## Backup Strategy

### For Small Databases (< 100GB)

- **Daily pg_dump** - Simple, sufficient
- **Weekly full backups** - Keep for 4 weeks
- **Store off-site** - Cloud storage

### For Medium Databases (100GB - 1TB)

- **Weekly pg_basebackup** - Fast full backup
- **Daily incremental** - If using pgBackRest
- **WAL archiving** - For PITR
- **Test restores** - Monthly

### For Large Databases (> 1TB)

- **pgBackRest or Barman** - Enterprise tools
- **Incremental backups** - Reduce backup time
- **WAL archiving** - Essential
- **Parallel backups** - Use multiple workers
- **Dedicated backup server** - Offload primary

## Backup Best Practices

1. **Automate backups** - Use cron or scheduler
2. **Test restores** - Regularly verify backups work
3. **Store off-site** - Don't keep only on primary
4. **Encrypt backups** - If containing sensitive data
5. **Monitor backup success** - Alert on failures
6. **Document procedures** - Recovery runbooks
7. **Retention policy** - Define how long to keep

## RPO and RTO

### RPO (Recovery Point Objective)

Maximum acceptable data loss.

- **RPO = 0** - Zero data loss (synchronous replication)
- **RPO = 1 hour** - Can lose up to 1 hour of data
- **RPO = 24 hours** - Daily backups sufficient

### RTO (Recovery Time Objective)

Maximum acceptable downtime.

- **RTO = 0** - Always online (HA with automatic failover)
- **RTO = 1 hour** - Can restore within 1 hour
- **RTO = 24 hours** - Manual restore acceptable

## Backup Checklist

- [ ] Backup strategy defined
- [ ] Backups automated
- [ ] Backups tested
- [ ] Off-site storage configured
- [ ] Monitoring and alerts set up
- [ ] Recovery procedures documented
- [ ] Team trained on recovery

:::warning Critical
Backups are useless if you can't restore them. Test your restore procedures regularly!
:::

## Next Steps

Continue to [Disaster Recovery](./disaster-recovery) to learn recovery procedures.
