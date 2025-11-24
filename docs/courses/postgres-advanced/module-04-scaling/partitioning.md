# Partitioning

## Overview

**Partitioning** splits large tables into smaller, manageable pieces called partitions. This improves query performance and simplifies maintenance.

## Benefits of Partitioning

- **Query performance** - Partition pruning eliminates unnecessary partitions
- **Maintenance** - Work with smaller partitions
- **Archival** - Drop old partitions easily
- **Parallel operations** - Operations can run in parallel on partitions

## Partition Types

### Range Partitioning

Partition by range of values (dates, numbers):

```sql
CREATE TABLE orders (
    id SERIAL,
    user_id INT,
    created_at TIMESTAMP NOT NULL,
    total DECIMAL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_01 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE orders_2024_03 PARTITION OF orders
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
```

**Best for:** Time-series data, sequential values

### List Partitioning

Partition by list of values:

```sql
CREATE TABLE users (
    id SERIAL,
    email VARCHAR(255),
    country VARCHAR(2) NOT NULL
) PARTITION BY LIST (country);

-- Create partitions
CREATE TABLE users_us PARTITION OF users
    FOR VALUES IN ('US');

CREATE TABLE users_ca PARTITION OF users
    FOR VALUES IN ('CA');

CREATE TABLE users_uk PARTITION OF users
    FOR VALUES IN ('GB', 'IE');  -- Multiple values
```

**Best for:** Categorical data with known values

### Hash Partitioning

Partition by hash of column:

```sql
CREATE TABLE data (
    id SERIAL,
    user_id INT NOT NULL,
    value TEXT
) PARTITION BY HASH (user_id);

-- Create partitions (4 partitions)
CREATE TABLE data_0 PARTITION OF data
    FOR VALUES WITH (modulus 4, remainder 0);

CREATE TABLE data_1 PARTITION OF data
    FOR VALUES WITH (modulus 4, remainder 1);

CREATE TABLE data_2 PARTITION OF data
    FOR VALUES WITH (modulus 4, remainder 2);

CREATE TABLE data_3 PARTITION OF data
    FOR VALUES WITH (modulus 4, remainder 3);
```

**Best for:** Even distribution, no natural partitioning key

## Partition Pruning

PostgreSQL automatically eliminates partitions that can't contain matching rows:

```sql
-- Only scans orders_2024_01 partition
SELECT * FROM orders 
WHERE created_at >= '2024-01-15' 
  AND created_at < '2024-01-20';
```

**EXPLAIN shows pruning:**

```
Append
  -> Seq Scan on orders_2024_01
        Filter: (created_at >= '2024-01-15' AND created_at < '2024-01-20')
```

## Managing Partitions

### Adding Partitions

```sql
-- Add new month partition
CREATE TABLE orders_2024_04 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
```

### Dropping Partitions

```sql
-- Drop old partition (fast!)
DROP TABLE orders_2023_01;
```

### Attaching Existing Table

```sql
-- Convert existing table to partition
CREATE TABLE orders_2024_05 (LIKE orders INCLUDING ALL);
-- ... populate data ...
ALTER TABLE orders ATTACH PARTITION orders_2024_05
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
```

### Detaching Partition

```sql
-- Detach without dropping
ALTER TABLE orders DETACH PARTITION orders_2024_01;
```

## Indexes on Partitions

### Automatic Index Creation

Indexes on parent table automatically created on partitions:

```sql
-- Index created on all partitions
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Per-Partition Indexes

Create indexes on specific partitions:

```sql
-- Index only on recent partition
CREATE INDEX idx_orders_2024_01_created ON orders_2024_01(created_at);
```

## Constraints

### Partition Key Constraints

Partition key must be NOT NULL:

```sql
-- This will fail
CREATE TABLE orders (
    created_at TIMESTAMP  -- Missing NOT NULL
) PARTITION BY RANGE (created_at);
```

### Foreign Keys

Foreign keys work with partitioned tables:

```sql
-- Parent table can have foreign keys
ALTER TABLE orders 
ADD CONSTRAINT fk_user 
FOREIGN KEY (user_id) REFERENCES users(id);
```

## pg_partman: Automated Partition Management

**pg_partman** is a PostgreSQL extension that automates partition creation, maintenance, and archival. It eliminates the need for manual cron jobs and reduces operational overhead.

### Why pg_partman?

Managing partitions manually becomes tedious:
- Creating new partitions before they're needed
- Dropping old partitions
- Handling edge cases (leap years, month boundaries)
- Monitoring partition health

pg_partman handles all of this automatically.

### Installation

```sql
-- Install extension
CREATE EXTENSION pg_partman;

-- Verify installation
SELECT * FROM pg_extension WHERE extname = 'pg_partman';
```

**From source:**
```bash
git clone https://github.com/pgpartman/pg_partman.git
cd pg_partman
make install
```

### Configuration Schema

pg_partman uses a dedicated schema for its metadata:

```sql
-- Check configuration schema
\dx+ pg_partman

-- View configuration tables
\dt partman.*
```

Key tables:
- `partman.part_config` - Partition configuration
- `partman.part_config_sub` - Sub-partition configuration
- `partman.partition_tables` - Managed partition tables

### Creating Partitioned Tables with pg_partman

#### Range Partitioning (Time-based)

```sql
-- Create parent table
CREATE TABLE events (
    id BIGSERIAL,
    event_time TIMESTAMP NOT NULL,
    event_data JSONB
) PARTITION BY RANGE (event_time);

-- Create initial partition
CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Configure pg_partman
SELECT partman.create_parent(
    p_parent_table => 'public.events',
    p_control => 'event_time',
    p_type => 'range',
    p_interval => 'monthly',
    p_premake => 3,  -- Create 3 months ahead
    p_start_partition => '2024-01-01'
);
```

**Configuration options:**
- `p_interval` - `'daily'`, `'weekly'`, `'monthly'`, `'yearly'`, or custom interval
- `p_premake` - Number of future partitions to maintain
- `p_start_partition` - Starting partition date
- `p_inherit_fk` - Inherit foreign keys (default: true)
- `p_epoch` - Use Unix timestamp (default: false)

#### List Partitioning

```sql
CREATE TABLE users_by_region (
    id SERIAL,
    email VARCHAR(255),
    region VARCHAR(2) NOT NULL
) PARTITION BY LIST (region);

-- Create initial partition
CREATE TABLE users_by_region_us PARTITION OF users_by_region
    FOR VALUES IN ('US');

-- Configure pg_partman for list partitioning
SELECT partman.create_parent(
    p_parent_table => 'public.users_by_region',
    p_control => 'region',
    p_type => 'list',
    p_premake => 1
);
```

#### Hash Partitioning

```sql
CREATE TABLE distributed_data (
    id BIGSERIAL,
    user_id INT NOT NULL,
    data TEXT
) PARTITION BY HASH (user_id);

-- Configure hash partitioning
SELECT partman.create_parent(
    p_parent_table => 'public.distributed_data',
    p_control => 'user_id',
    p_type => 'hash',
    p_count => 4  -- Number of hash partitions
);
```

### Automatic Partition Management

pg_partman runs maintenance functions to:
- Create new partitions
- Drop old partitions
- Update statistics
- Handle edge cases

#### Running Maintenance

**Manual execution:**
```sql
-- Run partition maintenance
SELECT partman.run_maintenance();

-- Run for specific table
SELECT partman.run_maintenance('public.events');
```

**Automated via pg_cron:**
```sql
-- Install pg_cron extension
CREATE EXTENSION pg_cron;

-- Schedule partition maintenance (daily at 2 AM)
SELECT cron.schedule(
    'partition-maintenance',
    '0 2 * * *',
    $$SELECT partman.run_maintenance()$$
);
```

**Automated via external cron:**
```bash
# Add to crontab
0 2 * * * psql -d mydb -c "SELECT partman.run_maintenance();"
```

### Partition Configuration

View and modify partition configuration:

```sql
-- View all configurations
SELECT * FROM partman.part_config;

-- View specific table configuration
SELECT * FROM partman.part_config 
WHERE parent_table = 'public.events';

-- Update configuration
UPDATE partman.part_config
SET premake = 6,  -- Create 6 months ahead
    retention = '12 months',  -- Keep 12 months
    retention_keep_table = false  -- Drop, don't archive
WHERE parent_table = 'public.events';
```

### Retention and Archival

Automatically drop or archive old partitions:

```sql
-- Configure retention (drop partitions older than 12 months)
UPDATE partman.part_config
SET retention = '12 months',
    retention_keep_table = false
WHERE parent_table = 'public.events';

-- Or archive to separate schema
UPDATE partman.part_config
SET retention = '12 months',
    retention_keep_table = true,
    retention_schema = 'archive'
WHERE parent_table = 'public.events';
```

**Retention options:**
- `retention` - Duration to keep partitions (e.g., `'6 months'`, `'90 days'`)
- `retention_keep_table` - `true` to archive, `false` to drop
- `retention_schema` - Schema for archived partitions

### Sub-partitioning

Create nested partitions (partition of partitions):

```sql
-- Create monthly parent
SELECT partman.create_parent(
    p_parent_table => 'public.events',
    p_control => 'event_time',
    p_type => 'range',
    p_interval => 'monthly'
);

-- Sub-partition by region (list)
SELECT partman.create_sub_parent(
    p_parent_table => 'public.events',
    p_control => 'region',
    p_type => 'list',
    p_interval => 'monthly',
    p_native_check => true
);
```

### Maintenance Functions

#### Check Partition Status

```sql
-- Check partition health
SELECT partman.check_parent();

-- Check specific table
SELECT partman.check_parent('public.events');

-- View partition information
SELECT 
    schemaname,
    tablename,
    partition_interval,
    partition_type
FROM partman.show_partitions('public.events');
```

#### Manual Partition Operations

```sql
-- Create partition manually
SELECT partman.create_partition_time(
    p_parent_table => 'public.events',
    p_partition_timestamp => '2024-06-01'
);

-- Drop partition manually
SELECT partman.drop_partition_time(
    p_parent_table => 'public.events',
    p_retention => '6 months',
    p_keep_table => false
);
```

#### Undoing pg_partman

```sql
-- Remove pg_partman management (keeps partitions)
SELECT partman.undo_partition(
    p_parent_table => 'public.events',
    p_batch_interval => '1 month',
    p_batch_count => 12,
    p_keep_table => true
);
```

### Advanced Configuration

#### Custom Intervals

```sql
-- Partition every 7 days
SELECT partman.create_parent(
    p_parent_table => 'public.events',
    p_control => 'event_time',
    p_type => 'range',
    p_interval => '7 days',
    p_premake => 4
);

-- Partition every 2 hours
SELECT partman.create_parent(
    p_parent_table => 'public.metrics',
    p_control => 'metric_time',
    p_type => 'range',
    p_interval => '2 hours',
    p_premake => 24
);
```

#### Partition Naming

```sql
-- Custom partition naming template
UPDATE partman.part_config
SET partition_name_template = 'events_{year}_{month}'
WHERE parent_table = 'public.events';
```

#### Index Management

```sql
-- Automatically create indexes on new partitions
UPDATE partman.part_config
SET inherit_privileges = true,
    inherit_fk = true
WHERE parent_table = 'public.events';

-- Create index template
CREATE INDEX idx_events_event_time ON events(event_time);

-- Future partitions will inherit this index
```

### Monitoring and Troubleshooting

#### Check Partition Status

```sql
-- List all managed partitions
SELECT 
    parent_table,
    partition_type,
    partition_interval,
    premake,
    retention
FROM partman.part_config;

-- View partition sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM partman.show_partitions('public.events')
ORDER BY tablename;
```

#### Common Issues

**Missing partitions:**
```sql
-- Check for gaps
SELECT partman.check_parent('public.events');

-- Manually create missing partition
SELECT partman.create_partition_time(
    p_parent_table => 'public.events',
    p_partition_timestamp => '2024-06-01'
);
```

**Partition creation failures:**
```sql
-- Check pg_partman logs
SELECT * FROM partman.part_config 
WHERE parent_table = 'public.events';

-- View maintenance job status
SELECT * FROM partman.part_config_job 
WHERE parent_table = 'public.events';
```

### Best Practices with pg_partman

1. **Set appropriate premake** - Balance between having partitions ready and not creating too many
   ```sql
   -- For monthly partitions, 2-3 months ahead is usually sufficient
   UPDATE partman.part_config SET premake = 3;
   ```

2. **Configure retention early** - Set retention policy from the start
   ```sql
   UPDATE partman.part_config 
   SET retention = '12 months', retention_keep_table = false;
   ```

3. **Monitor partition sizes** - Ensure partitions don't grow too large
   ```sql
   -- Alert if partition exceeds 50GB
   SELECT tablename, pg_total_relation_size(schemaname||'.'||tablename)
   FROM partman.show_partitions('public.events')
   WHERE pg_total_relation_size(schemaname||'.'||tablename) > 50*1024*1024*1024;
   ```

4. **Use maintenance window** - Run maintenance during low-traffic periods
   ```sql
   -- Schedule for 2 AM
   SELECT cron.schedule(
       'partition-maintenance',
       '0 2 * * *',
       $$SELECT partman.run_maintenance()$$
   );
   ```

5. **Test retention policies** - Verify old partitions are dropped/archived correctly
   ```sql
   -- Dry run retention
   SELECT partman.drop_partition_time(
       p_parent_table => 'public.events',
       p_retention => '12 months',
       p_keep_table => false,
       p_batch_count => 1  -- Test with one partition
   );
   ```

### Production Considerations

:::warning Important
Always test pg_partman configuration in a staging environment before production. Partition management affects data availability.
:::

**Before production:**
1. Test partition creation and dropping
2. Verify retention policies work correctly
3. Ensure maintenance jobs run successfully
4. Monitor partition sizes and query performance
5. Have a rollback plan

**Monitoring checklist:**
- [ ] Partition creation is working
- [ ] Old partitions are being dropped/archived
- [ ] No gaps in partition coverage
- [ ] Partition sizes are reasonable
- [ ] Query performance is acceptable
- [ ] Maintenance jobs complete successfully

**Example production setup:**
```sql
-- Production-ready configuration
SELECT partman.create_parent(
    p_parent_table => 'public.events',
    p_control => 'event_time',
    p_type => 'range',
    p_interval => 'monthly',
    p_premake => 3,
    p_start_partition => CURRENT_DATE,
    p_inherit_fk => true
);

-- Set retention (keep 24 months, archive older)
UPDATE partman.part_config
SET retention = '24 months',
    retention_keep_table = true,
    retention_schema = 'archive',
    premake = 3
WHERE parent_table = 'public.events';

-- Schedule maintenance
SELECT cron.schedule(
    'events-partition-maintenance',
    '0 2 * * *',  -- Daily at 2 AM
    $$SELECT partman.run_maintenance('public.events')$$
);
```

:::tip Production Insight
pg_partman is essential for production systems with time-series or large partitioned tables. It eliminates manual partition management and reduces operational errors.
:::

## Best Practices

1. **Choose right partition key** - Based on query patterns
2. **Plan partition size** - Not too small, not too large
3. **Automate partition creation** - Use pg_partman or cron jobs
4. **Monitor partition usage** - Ensure pruning works
5. **Archive old partitions** - Drop or move to cheaper storage
6. **Use pg_partman** - For automated partition management in production

:::tip Production Insight
Partitioning is one of the most effective ways to manage large tables. Start partitioning before tables become unmanageably large. Use pg_partman to automate partition lifecycle management.
:::

## Field Notes & Industry Reads

- [Kyle Hailey — Postgres Partition Pains & LockManager Waits](https://www.kylehailey.com/post/postgres-partition-pains-lockmanager-waits) — Hard-earned lessons on partition lock amplification and mitigation via detaching hot partitions.
- [GitLab Scalability — Partitioning the CI Database](https://about.gitlab.com/blog/) — How GitLab partitioned multi-terabyte tables while keeping the service online.
- [AWS Database Blog — Automating Partition Management with pg_partman](https://aws.amazon.com/blogs/database/) — Reference architecture for Lambda/pg_cron driven partition creation.
- [Citus Data — Advanced Partitioning and Sharding Recipes](https://www.citusdata.com/blog/) — Combining native partitioning with distributed tables.
- [Crunchy Data — Partitioning Performance Deep Dives](https://www.crunchydata.com/blog/) — Benchmarks on pruning, statistics, and index maintenance per partition.

## Next Steps

Continue to [Sharding](./sharding) to learn about horizontal scaling across databases.
