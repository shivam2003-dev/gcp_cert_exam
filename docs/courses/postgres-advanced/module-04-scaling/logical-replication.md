# Logical Replication

## Overview

**Logical replication** replicates at the logical level (SQL statements), allowing selective table replication and cross-version replication.

## How Logical Replication Works

1. **Primary publishes changes** - Creates publication of tables
2. **Replica subscribes** - Creates subscription to publication
3. **Changes streamed** - SQL statements sent to replica
4. **Replica applies** - Executes SQL statements

## Differences from Streaming Replication

| Feature | Streaming Replication | Logical Replication |
|---------|----------------------|---------------------|
| **Level** | Physical (WAL) | Logical (SQL) |
| **Granularity** | Entire database | Selected tables |
| **Versions** | Same major version | Cross-version possible |
| **Selective** | No | Yes |
| **Performance** | Lower overhead | Higher overhead |

## Setup

### Primary Configuration

```conf
# postgresql.conf
wal_level = logical  # Required for logical replication
max_replication_slots = 10
max_wal_senders = 10
```

### Create Publication

```sql
-- Publish specific tables
CREATE PUBLICATION my_publication FOR TABLE users, orders;

-- Publish all tables
CREATE PUBLICATION all_tables FOR ALL TABLES;

-- Publish with filters (PostgreSQL 15+)
CREATE PUBLICATION filtered_publication 
FOR TABLE users 
WHERE (status = 'active');
```

### Create Subscription

```sql
-- On replica
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=primary_host port=5432 dbname=mydb user=replicator password=secure_password'
PUBLICATION my_publication
WITH (
    copy_data = true,           -- Copy existing data
    create_slot = true,         -- Create replication slot
    enabled = true,             -- Enable immediately
    slot_name = 'logical_slot'  -- Slot name
);
```

## Monitoring

### Check Subscriptions

```sql
-- On replica
SELECT 
    subname,
    subenabled,
    subslotname,
    subpublications
FROM pg_subscription;
```

### Check Publication Status

```sql
-- On primary
SELECT 
    pubname,
    puballtables,
    pubinsert,
    pubupdate,
    pubdelete
FROM pg_publication;

-- Tables in publication
SELECT * FROM pg_publication_tables;
```

### Check Replication Lag

```sql
-- On primary
SELECT 
    application_name,
    state,
    sync_state,
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) as lag_bytes
FROM pg_stat_replication
WHERE application_name LIKE 'my_subscription%';
```

## Use Cases

### 1. Selective Replication

Replicate only specific tables:

```sql
-- Only replicate active users
CREATE PUBLICATION active_users FOR TABLE users WHERE (status = 'active');
```

### 2. Cross-Version Replication

Replicate from PostgreSQL 14 to 15:

```sql
-- Works across major versions
CREATE SUBSCRIPTION sub_14_to_15
CONNECTION 'host=pg14_host port=5432 dbname=mydb user=replicator'
PUBLICATION my_publication;
```

### 3. Data Distribution

Send data to multiple destinations:

```sql
-- Replica 1: Full data
CREATE SUBSCRIPTION full_replica ...;

-- Replica 2: Only recent data
CREATE PUBLICATION recent_data FOR TABLE orders WHERE (created_at > '2024-01-01');
CREATE SUBSCRIPTION recent_replica ...;
```

### 4. Upgrades

Use logical replication for zero-downtime upgrades:

1. Set up logical replication to new version
2. Let it catch up
3. Switch application to new version
4. Drop subscription

## Managing Subscriptions

### Pause Subscription

```sql
ALTER SUBSCRIPTION my_subscription DISABLE;
```

### Resume Subscription

```sql
ALTER SUBSCRIPTION my_subscription ENABLE;
```

### Refresh Subscription

```sql
-- Re-copy data
ALTER SUBSCRIPTION my_subscription REFRESH PUBLICATION;
```

### Drop Subscription

```sql
-- On replica
DROP SUBSCRIPTION my_subscription;

-- Or with slot cleanup
DROP SUBSCRIPTION my_subscription WITH (slot_name = 'logical_slot');
```

## Limitations

1. **Schema changes** - DDL not replicated automatically
2. **Sequence values** - May differ between primary and replica
3. **Large transactions** - Replicated as single transaction
4. **TRUNCATE** - Replicated but may have issues
5. **Foreign keys** - Must exist on replica

## Best Practices

1. **Use for selective replication** - When you need specific tables
2. **Monitor lag** - Logical replication can lag more than streaming
3. **Handle schema changes** - Apply DDL manually on replica
4. **Test thoroughly** - More complex than streaming replication
5. **Use replication slots** - Prevent WAL deletion

:::tip Production Insight
Logical replication is powerful but more complex than streaming replication. Use it when you need selective replication or cross-version replication.
:::

## Next Steps

Continue to [Partitioning](./partitioning) to learn about table partitioning.

## Field Notes & Industry Reads

- [AWS Database Blog — Blue/Green Deployments with Logical Replication](https://aws.amazon.com/blogs/database/) — Real migration runbooks and failure lessons.
- [Crunchy Data — Logical Replication in Production](https://www.crunchydata.com/blog/) — Monitoring tips and slot management best practices.
- [Percona Blog — Debugging Logical Replication Lag](https://www.percona.com/blog/) — Incident postmortems focused on apply workers and batching.
- [EDB Blog — Schema Change Management with Logical Replication](https://www.enterprisedb.com/blog) — Strategies for DDL coordination and sequence alignment.
- [Microsoft Azure — Cross-Region Logical Replication Patterns](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/bg-p/AzureDatabaseforPostgreSQLBlog) — Reference architectures for hybrid and multi-cloud sync.
