# Hot vs Cold Data

## Overview

Not all data is accessed equally. Separating hot (frequently accessed) and cold (rarely accessed) data improves performance and reduces costs.

## Data Lifecycle

### Hot Data

- Frequently accessed
- Recent data
- Active users/orders
- Needs fast storage

### Cold Data

- Rarely accessed
- Historical data
- Archived records
- Can use slower storage

## Strategies

### 1. Partitioning by Date

```sql
-- Recent data (hot)
CREATE TABLE orders_2024_12 PARTITION OF orders
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Old data (cold)
CREATE TABLE orders_2023_01 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');
```

**Benefits:**
- Queries only scan recent partitions
- Old partitions can be on slower storage
- Easy to archive old partitions

### 2. Separate Tables

```sql
-- Hot data
CREATE TABLE orders_active (...);

-- Cold data
CREATE TABLE orders_archive (...);

-- Move old data
INSERT INTO orders_archive 
SELECT * FROM orders_active 
WHERE created_at < '2023-01-01';

DELETE FROM orders_active 
WHERE created_at < '2023-01-01';
```

### 3. Archive to External Storage

```sql
-- Export to file
COPY (
    SELECT * FROM orders 
    WHERE created_at < '2023-01-01'
) TO '/backup/orders_2022.csv';

-- Move to S3/object storage
-- Drop from database
```

## Implementation

### Automated Archival

```sql
-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_orders()
RETURNS void AS $$
BEGIN
    -- Move to archive table
    INSERT INTO orders_archive
    SELECT * FROM orders
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Delete from main table
    DELETE FROM orders
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron or external scheduler
```

### Querying Archived Data

```sql
-- Union for queries across hot and cold
SELECT * FROM orders_active
WHERE user_id = 123
UNION ALL
SELECT * FROM orders_archive
WHERE user_id = 123;
```

## Best Practices

1. **Define retention policy** - How long to keep hot data
2. **Automate archival** - Don't do manually
3. **Test archival** - Ensure data integrity
4. **Document procedures** - For operations team
5. **Monitor storage** - Track hot vs cold sizes

:::tip Production Insight
Separating hot and cold data is essential for managing large databases. Most queries only need recent data.
:::

## Next Steps

Continue to [Bloat Management](./bloat-management) to learn about keeping tables lean.
