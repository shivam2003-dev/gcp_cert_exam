# Query Anti-Patterns

## Overview

Certain query patterns are guaranteed to perform poorly. Recognizing and avoiding these anti-patterns is essential for production performance.

## Anti-Pattern 1: N+1 Queries

### The Problem

```python
# Bad: N+1 queries
users = db.query("SELECT * FROM users")
for user in users:
    orders = db.query("SELECT * FROM orders WHERE user_id = %s", user.id)
```

This executes 1 query for users + N queries for orders = N+1 queries.

### The Solution

```python
# Good: Single query with JOIN
users_with_orders = db.query("""
    SELECT u.*, o.* 
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
""")
```

Or use a single query per user with IN:

```sql
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ...);
```

## Anti-Pattern 2: SELECT * When Not Needed

### The Problem

```sql
-- Returns all columns, even if only need one
SELECT * FROM users WHERE id = 123;
```

**Issues:**
- Transfers unnecessary data
- Can't use index-only scans
- Wastes memory and bandwidth

### The Solution

```sql
-- Only select what you need
SELECT id, email FROM users WHERE id = 123;
```

## Anti-Pattern 3: Functions in WHERE Clause

### The Problem

```sql
-- Can't use index on created_at
SELECT * FROM users 
WHERE EXTRACT(YEAR FROM created_at) = 2024;

-- Can't use index on email
SELECT * FROM users 
WHERE LOWER(email) = 'user@example.com';
```

### The Solution

```sql
-- Rewrite to use index
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
  AND created_at < '2025-01-01';

-- Or create expression index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

## Anti-Pattern 4: OR Conditions

### The Problem

```sql
-- Often results in sequential scan
SELECT * FROM users 
WHERE email = 'user1@example.com' 
   OR email = 'user2@example.com';
```

### The Solution

```sql
-- Use IN instead
SELECT * FROM users 
WHERE email IN ('user1@example.com', 'user2@example.com');
```

## Anti-Pattern 5: LIKE with Leading Wildcard

### The Problem

```sql
-- Can't use index (must scan all rows)
SELECT * FROM users WHERE email LIKE '%@example.com';
```

### The Solution

```sql
-- Use suffix index or full-text search
CREATE INDEX idx_users_email_suffix ON users(REVERSE(email));
SELECT * FROM users WHERE REVERSE(email) LIKE REVERSE('%@example.com');

-- Or use full-text search for complex patterns
CREATE INDEX idx_users_email_gin ON users USING GIN (email gin_trgm_ops);
SELECT * FROM users WHERE email LIKE '%pattern%';
```

## Anti-Pattern 6: COUNT(*) for Existence Checks

### The Problem

```sql
-- Counts all rows, even if only need to know if any exist
SELECT COUNT(*) FROM orders WHERE user_id = 123;
```

### The Solution

```sql
-- Use EXISTS instead
SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = 123);

-- Or LIMIT 1
SELECT 1 FROM orders WHERE user_id = 123 LIMIT 1;
```

## Anti-Pattern 7: Subqueries in SELECT

### The Problem

```sql
-- Executes subquery for each row
SELECT 
    id,
    email,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;
```

### The Solution

```sql
-- Use JOIN instead
SELECT 
    u.id,
    u.email,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email;
```

## Anti-Pattern 8: ORDER BY with Different Sort

### The Problem

```sql
-- Can't use index if sort direction differs
SELECT * FROM users ORDER BY created_at ASC, updated_at DESC;
```

### The Solution

```sql
-- Create composite index matching sort order
CREATE INDEX idx_users_created_updated ON users(created_at ASC, updated_at DESC);
```

## Anti-Pattern 9: Unnecessary DISTINCT

### The Problem

```sql
-- DISTINCT adds sorting overhead
SELECT DISTINCT user_id FROM orders;
```

### The Solution

```sql
-- Use GROUP BY if appropriate
SELECT user_id FROM orders GROUP BY user_id;

-- Or ensure query naturally returns unique rows
SELECT user_id FROM orders WHERE status = 'active';
```

## Anti-Pattern 10: Large IN Clauses

### The Problem

```sql
-- Very large IN list is slow
SELECT * FROM users WHERE id IN (1, 2, 3, ..., 100000);
```

### The Solution

```sql
-- Use temporary table or VALUES
CREATE TEMP TABLE user_ids (id INT);
INSERT INTO user_ids VALUES (1), (2), (3), ...;

SELECT u.* FROM users u
JOIN user_ids ui ON u.id = ui.id;
```

## Anti-Pattern 11: Not Using Prepared Statements

### The Problem

```sql
-- Each execution parses and plans
SELECT * FROM users WHERE email = 'user1@example.com';
SELECT * FROM users WHERE email = 'user2@example.com';
```

### The Solution

```sql
-- Use prepared statement (application level)
PREPARE get_user(text) AS 
SELECT * FROM users WHERE email = $1;

EXECUTE get_user('user1@example.com');
EXECUTE get_user('user2@example.com');
```

## Anti-Pattern 12: Transactions Too Long

### The Problem

```sql
BEGIN;
SELECT * FROM large_table;  -- Holds snapshot
-- ... application processes for hours ...
COMMIT;
```

**Issues:**
- Holds MVCC snapshot
- Prevents vacuum
- Can cause XID wraparound

### The Solution

```sql
-- Keep transactions short
BEGIN;
SELECT * FROM large_table;
COMMIT;  -- Release snapshot immediately

-- Process data in application
```

## Anti-Pattern 13: Over-Fetching with LIMIT

### The Problem

```sql
-- Fetches all rows, then limits
SELECT * FROM users ORDER BY created_at LIMIT 10;
```

If no index on `created_at`, this sorts entire table.

### The Solution

```sql
-- Ensure index exists for ORDER BY
CREATE INDEX idx_users_created ON users(created_at);
SELECT * FROM users ORDER BY created_at LIMIT 10;
```

## Anti-Pattern 14: Ignoring NULLs in Indexes

### The Problem

```sql
-- Index includes NULLs, but query filters them
CREATE INDEX idx_users_deleted ON users(deleted_at);
SELECT * FROM users WHERE deleted_at IS NOT NULL;
```

### The Solution

```sql
-- Use partial index
CREATE INDEX idx_users_deleted ON users(deleted_at) 
WHERE deleted_at IS NOT NULL;
```

## Best Practices

1. **Profile queries** - Use EXPLAIN ANALYZE
2. **Avoid functions in WHERE** - Rewrite or use expression indexes
3. **Use appropriate indexes** - Match query patterns
4. **Keep transactions short** - Release resources quickly
5. **Use JOINs not subqueries** - When possible
6. **Test with real data** - Small datasets hide problems

:::warning Production Warning
These anti-patterns can cause queries to be 100-1000x slower. Always profile queries before deploying to production.
:::

## Next Steps

Continue to [Performance Tuning Techniques](./tuning-techniques) to learn optimization strategies.

