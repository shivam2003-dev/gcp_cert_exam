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

## Best Practices

1. **Choose right partition key** - Based on query patterns
2. **Plan partition size** - Not too small, not too large
3. **Automate partition creation** - Use cron jobs or triggers
4. **Monitor partition usage** - Ensure pruning works
5. **Archive old partitions** - Drop or move to cheaper storage

:::tip Production Insight
Partitioning is one of the most effective ways to manage large tables. Start partitioning before tables become unmanageably large.
:::

## Next Steps

Continue to [Sharding](./sharding) to learn about horizontal scaling across databases.
