# Designing for Scale

## Overview

Designing schemas and applications for massive scale requires different approaches than small databases. This chapter covers design patterns for scale.

## Schema Design Principles

### Normalization vs Denormalization

**For Scale:**
- **Normalize** - Reduce redundancy, smaller tables
- **Denormalize selectively** - When queries benefit
- **Balance** - Normalize for writes, denormalize for reads

### Data Types

Choose appropriate types:

```sql
-- Good: Right-sized types
CREATE TABLE users (
    id BIGSERIAL,           -- Not INT for large tables
    email VARCHAR(255),     -- Not TEXT if fixed size
    created_at TIMESTAMP,   -- Not TIMESTAMPTZ if timezone not needed
    status SMALLINT         -- Not INT for few values
);
```

### Avoid Wide Tables

```sql
-- Bad: Too many columns
CREATE TABLE users (
    id INT,
    col1 TEXT, col2 TEXT, ..., col100 TEXT
);

-- Better: Normalize or use JSONB
CREATE TABLE users (
    id INT,
    metadata JSONB  -- For flexible attributes
);
```

## Index Strategy

### Selective Indexing

```sql
-- Index only what's needed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status_created ON users(status, created_at);

-- Avoid over-indexing
-- Each index slows writes
```

### Partial Indexes

```sql
-- Index only active users
CREATE INDEX idx_users_active_email ON users(email) 
WHERE status = 'active';
```

## Partitioning Strategy

### Time-Based Partitioning

```sql
-- Partition by month
CREATE TABLE orders (...) PARTITION BY RANGE (created_at);

-- Automate partition creation
-- Use cron or triggers
```

### Hash Partitioning

```sql
-- Even distribution
CREATE TABLE data (...) PARTITION BY HASH (user_id);
```

## Query Design

### Avoid Full Table Scans

```sql
-- Bad: Scans entire table
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Good: Uses index
SELECT * FROM users WHERE email = 'user@example.com';
```

### Use LIMIT

```sql
-- Always use LIMIT when possible
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

### Pagination

```sql
-- Cursor-based pagination (better than OFFSET)
SELECT * FROM users 
WHERE id > last_seen_id 
ORDER BY id 
LIMIT 20;
```

## Best Practices

1. **Plan for growth** - Design with scale in mind
2. **Partition early** - Before tables become huge
3. **Index strategically** - Not too many, not too few
4. **Monitor continuously** - Catch issues early
5. **Test at scale** - With realistic data volumes

:::tip Production Insight
Designing for scale is about making the right trade-offs early. It's harder to retrofit scale than to design for it.
:::

## Next Steps

Continue to [Hot vs Cold Data](./hot-cold-data) to learn about data lifecycle management.
