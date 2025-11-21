# Partition Management

## Overview

Managing partitions at scale requires automation and careful planning. This chapter covers partition management patterns.

## Automated Partition Creation

### Using pg_partman

**pg_partman** automates partition management:

```sql
-- Create partitioned table
CREATE TABLE orders (
    id BIGSERIAL,
    created_at TIMESTAMP NOT NULL,
    total DECIMAL
) PARTITION BY RANGE (created_at);

-- Set up pg_partman
SELECT partman.create_parent(
    p_parent_table => 'public.orders',
    p_control => 'created_at',
    p_type => 'range',
    p_interval => 'monthly',
    p_premake => 3
);
```

**Features:**
- Automatic partition creation
- Automatic partition dropping
- Retention policies

### Manual Automation

```sql
-- Function to create next month's partition
CREATE OR REPLACE FUNCTION create_next_month_partition()
RETURNS void AS $$
DECLARE
    next_month_start DATE;
    next_month_end DATE;
    partition_name TEXT;
BEGIN
    next_month_start := date_trunc('month', NOW() + INTERVAL '1 month');
    next_month_end := next_month_start + INTERVAL '1 month';
    partition_name := 'orders_' || to_char(next_month_start, 'YYYY_MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        next_month_start,
        next_month_end
    );
END;
$$ LANGUAGE plpgsql;

-- Schedule with cron
-- 0 0 1 * * psql -d mydb -c "SELECT create_next_month_partition();"
```

## Partition Maintenance

### Adding Partitions

```sql
-- Add next month
CREATE TABLE orders_2025_01 PARTITION OF orders
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### Dropping Old Partitions

```sql
-- Drop old partition (fast!)
DROP TABLE orders_2023_01;

-- Or detach and archive
ALTER TABLE orders DETACH PARTITION orders_2023_01;
-- Then move to archive storage
```

### Attaching Existing Tables

```sql
-- Convert existing table to partition
CREATE TABLE orders_2024_12 (LIKE orders INCLUDING ALL);
-- ... populate data ...
ALTER TABLE orders ATTACH PARTITION orders_2024_12
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
```

## Monitoring Partitions

### Check Partition Sizes

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'orders_%'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Partition Usage

```sql
-- See which partitions are accessed
SELECT 
    schemaname,
    tablename,
    seq_scan,
    idx_scan
FROM pg_stat_user_tables
WHERE tablename LIKE 'orders_%'
ORDER BY tablename;
```

## Best Practices

1. **Automate creation** - Use pg_partman or custom scripts
2. **Plan retention** - Automate dropping old partitions
3. **Monitor sizes** - Track partition growth
4. **Test procedures** - Before automating
5. **Document processes** - For operations team

:::tip Production Insight
Partition management at scale requires automation. Manual management doesn't scale.
:::

## Next Steps

Continue to [High Concurrency](./high-concurrency) to learn about performance under load.
