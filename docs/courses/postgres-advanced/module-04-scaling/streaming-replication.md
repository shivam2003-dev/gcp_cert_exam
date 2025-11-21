# Streaming Replication

## Overview

Streaming replication creates physical replicas of the primary database by continuously streaming WAL records.

## Setup

### Primary Configuration

```conf
# postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB
```

### Replica Setup

```bash
# Base backup
pg_basebackup -h primary_host -D /var/lib/postgresql/data -U replicator -P -W

# Configure replica
# postgresql.conf
hot_standby = on
```

## Monitoring

```sql
-- Check replication status
SELECT * FROM pg_stat_replication;
```

## Next Steps

Continue to [Logical Replication](./logical-replication).

