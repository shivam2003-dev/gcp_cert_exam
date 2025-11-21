# Index Types Deep Dive

## Overview

PostgreSQL supports multiple index types, each optimized for different use cases. Choosing the right index type is crucial for performance.

## B-Tree Index (Default)

**B-Tree** is the default and most common index type. It's a balanced tree structure optimized for equality and range queries.

### When to Use

- Equality queries: `WHERE id = 123`
- Range queries: `WHERE created_at BETWEEN ...`
- Sorting: `ORDER BY column`
- Unique constraints
- Foreign keys

### Example

```sql
-- Create B-Tree index
CREATE INDEX idx_users_email ON users(email);

-- Supports these queries efficiently
SELECT * FROM users WHERE email = 'user@example.com';
SELECT * FROM users WHERE email > 'a' AND email < 'z';
SELECT * FROM users ORDER BY email;
```

### Characteristics

- **Balanced tree** - O(log n) search time
- **Sorted** - Maintains sort order
- **Supports operators**: `=`, `<`, `>`, `<=`, `>=`, `BETWEEN`, `IN`, `LIKE 'prefix%'`
- **Size**: Moderate (stores key + pointer)

:::tip Exam Tip
B-Tree is the default. If you don't specify a type, you get B-Tree. It's the right choice for most cases.
:::

## GIN (Generalized Inverted Index)

**GIN** indexes are optimized for values that contain multiple elements, like arrays, full-text search, and JSONB.

### When to Use

- Full-text search
- Array operations: `WHERE tags @> ARRAY['tag1']`
- JSONB queries: `WHERE data @> '{"key": "value"}'`
- Composite values with many duplicates

### Example

```sql
-- Full-text search
CREATE INDEX idx_documents_content ON documents USING GIN (to_tsvector('english', content));

SELECT * FROM documents 
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'postgresql');

-- Array operations
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);

SELECT * FROM posts WHERE tags @> ARRAY['database'];

-- JSONB
CREATE INDEX idx_users_metadata ON users USING GIN (metadata);

SELECT * FROM users WHERE metadata @> '{"status": "active"}'::jsonb;
```

### Characteristics

- **Inverted index** - Maps values to rows
- **Fast containment** - `@>`, `<@`, `&&` operators
- **Larger size** - Stores more data than B-Tree
- **Slower updates** - More expensive to maintain

:::warning Production Consideration
GIN indexes are larger and slower to update than B-Tree. Use them when the query patterns justify the cost.
:::

## GiST (Generalized Search Tree)

**GiST** is a framework for building custom index types. It's used for geometric data, full-text search, and other complex data types.

### When to Use

- Geometric data: points, lines, polygons
- Full-text search (alternative to GIN)
- Range types
- Custom data types

### Example

```sql
-- Geometric data
CREATE INDEX idx_locations_coords ON locations USING GiST (coordinates);

SELECT * FROM locations 
WHERE coordinates <-> point(0, 0) < 1000;

-- Full-text search (alternative to GIN)
CREATE INDEX idx_documents_content ON documents USING GiST (to_tsvector('english', content));
```

### Characteristics

- **Flexible** - Can be extended for custom types
- **Good for geometric data** - Spatial queries
- **Moderate size** - Between B-Tree and GIN
- **Slower than GIN** - For full-text search

## BRIN (Block Range Index)

**BRIN** indexes store summary information about ranges of table blocks. They're very small but less precise.

### When to Use

- Very large tables with natural ordering
- Time-series data
- Monotonically increasing values
- When index size is a concern

### Example

```sql
-- Time-series data
CREATE INDEX idx_logs_timestamp ON logs USING BRIN (timestamp);

SELECT * FROM logs 
WHERE timestamp BETWEEN '2024-01-01' AND '2024-01-02';
```

### Characteristics

- **Very small** - Stores only summary data
- **Fast to build** - Minimal overhead
- **Less precise** - May scan more blocks
- **Requires ordering** - Works best with sorted data

:::tip Production Insight
BRIN indexes are perfect for time-series data where you're always querying recent data. They're tiny but effective for the right use case.
:::

## Hash Index

**Hash** indexes store hash values of keys. They only support equality operations.

### When to Use

- Equality-only queries
- Very large tables
- When exact match performance is critical

### Example

```sql
CREATE INDEX idx_users_email_hash ON users USING HASH (email);

SELECT * FROM users WHERE email = 'user@example.com';
```

### Characteristics

- **Equality only** - No range queries
- **Fast lookups** - O(1) average case
- **No sorting** - Can't help with ORDER BY
- **WAL logging** - Since PostgreSQL 10, safe for replication

:::note Important
Hash indexes only support `=` operator. They don't support `<`, `>`, `BETWEEN`, or `ORDER BY`.
:::

## Partial Indexes

**Partial indexes** index only a subset of rows, reducing size and improving performance.

### When to Use

- Queries filter on a specific condition
- Large table with small active subset
- Want to reduce index size

### Example

```sql
-- Index only active users
CREATE INDEX idx_users_active_email ON users(email) 
WHERE status = 'active';

-- This query uses the index
SELECT * FROM users WHERE status = 'active' AND email = 'user@example.com';

-- This query doesn't use the index (must scan all rows)
SELECT * FROM users WHERE email = 'user@example.com';
```

### Benefits

- **Smaller size** - Only indexes relevant rows
- **Faster updates** - Less to maintain
- **Better performance** - Smaller index is faster to scan

## Expression Indexes

**Expression indexes** index the result of an expression, not the column value.

### When to Use

- Queries use expressions in WHERE clause
- Case-insensitive searches
- Function-based filtering

### Example

```sql
-- Case-insensitive search
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Date extraction
CREATE INDEX idx_orders_created_month ON orders(EXTRACT(MONTH FROM created_at));

SELECT * FROM orders WHERE EXTRACT(MONTH FROM created_at) = 1;
```

### Important Notes

- **Must match exactly** - Query must use same expression
- **Maintenance overhead** - Expression computed on every insert/update

## Composite Indexes

**Composite indexes** index multiple columns together.

### When to Use

- Queries filter on multiple columns
- Want to support multiple query patterns
- ORDER BY multiple columns

### Example

```sql
-- Multi-column index
CREATE INDEX idx_users_status_created ON users(status, created_at);

-- These queries can use the index
SELECT * FROM users WHERE status = 'active' AND created_at > '2024-01-01';
SELECT * FROM users WHERE status = 'active' ORDER BY created_at;

-- This query can't use the index efficiently (wrong column order)
SELECT * FROM users WHERE created_at > '2024-01-01';
```

### Column Order Matters

- **Leftmost prefix rule** - Index supports queries on leftmost columns
- **Most selective first** - Put most selective column first
- **Consider query patterns** - Order based on how you query

## Index Maintenance

### Rebuilding Indexes

```sql
-- Rebuild index to remove bloat
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on a table
REINDEX TABLE users;

-- Rebuild all indexes in database
REINDEX DATABASE mydb;
```

### Monitoring Index Usage

```sql
-- Find unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find indexes with low usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as size,
    round(100.0 * idx_scan / NULLIF(idx_tup_read, 0), 2) as selectivity
FROM pg_stat_user_indexes
WHERE idx_scan < 100
ORDER BY pg_relation_size(indexrelid) DESC;
```

## When Indexes Hurt Performance

Indexes aren't always beneficial:

1. **High write, low read** - Index maintenance overhead
2. **Very small tables** - Sequential scan may be faster
3. **Low selectivity** - Index doesn't filter much
4. **Too many indexes** - Slows down writes

### Example: When Not to Index

```sql
-- Bad: Index on low-cardinality column
CREATE INDEX idx_users_gender ON users(gender);  -- Only 2-3 values

-- Bad: Index on frequently updated column
CREATE INDEX idx_users_last_login ON users(last_login);  -- Updated on every login
```

## Best Practices

1. **Index primary keys and foreign keys** - Usually automatic
2. **Index WHERE clause columns** - Most important
3. **Index ORDER BY columns** - If sorting is frequent
4. **Use partial indexes** - When appropriate
5. **Monitor index usage** - Remove unused indexes
6. **Consider index type** - Match to query patterns
7. **Don't over-index** - Each index slows writes

:::tip Production Insight
The right index can make a query 1000x faster. The wrong index (or too many indexes) can slow down your entire database. Choose wisely.
:::

## Next Steps

Continue to [Statistics and ANALYZE](./statistics-analyze) to understand how statistics affect query planning.

