# Lock Manager Deep Dive

## Overview

PostgreSQL's lock manager coordinates concurrent access to database objects. Understanding locks is essential for debugging performance issues and preventing deadlocks.

## Lock Types

### Table-Level Locks

**ACCESS SHARE** - Acquired by SELECT
- Compatible with: ACCESS SHARE, ROW SHARE
- Blocks: ACCESS EXCLUSIVE

**ROW SHARE** - Acquired by SELECT FOR UPDATE/SHARE
- Compatible with: ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE
- Blocks: EXCLUSIVE, ACCESS EXCLUSIVE

**ROW EXCLUSIVE** - Acquired by INSERT, UPDATE, DELETE
- Compatible with: ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE
- Blocks: SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE

**SHARE UPDATE EXCLUSIVE** - Acquired by VACUUM, ANALYZE, CREATE INDEX CONCURRENTLY
- Compatible with: ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE
- Blocks: SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE

**SHARE** - Acquired by CREATE INDEX (non-concurrent)
- Compatible with: ACCESS SHARE, ROW SHARE
- Blocks: ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE

**SHARE ROW EXCLUSIVE** - Acquired by CREATE TRIGGER, some ALTER TABLE
- Compatible with: ACCESS SHARE, ROW SHARE
- Blocks: ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE

**EXCLUSIVE** - Acquired by some ALTER TABLE, CREATE INDEX
- Compatible with: ACCESS SHARE
- Blocks: All except ACCESS SHARE

**ACCESS EXCLUSIVE** - Acquired by DROP TABLE, TRUNCATE, most ALTER TABLE
- Compatible with: None
- Blocks: All

## Viewing Locks

### Current Locks

```sql
-- View all current locks
SELECT 
    locktype,
    database,
    relation::regclass,
    page,
    tuple,
    virtualxid,
    transactionid,
    mode,
    granted,
    pid
FROM pg_locks
WHERE granted = true;
```

### Blocking Queries

```sql
-- Find queries blocking others
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query,
    blocked_activity.state AS blocked_state,
    blocking_activity.state AS blocking_state
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

## Lock Modes in Practice

### SELECT (No Lock)

```sql
-- Acquires ACCESS SHARE lock (very weak)
SELECT * FROM users;
```

### SELECT FOR UPDATE

```sql
-- Acquires ROW SHARE lock
SELECT * FROM users WHERE id = 1 FOR UPDATE;
```

### INSERT/UPDATE/DELETE

```sql
-- Acquires ROW EXCLUSIVE lock
INSERT INTO users (email) VALUES ('user@example.com');
UPDATE users SET email = 'new@example.com' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

### DDL Operations

```sql
-- ALTER TABLE acquires ACCESS EXCLUSIVE (blocks everything)
ALTER TABLE users ADD COLUMN new_column TEXT;

-- CREATE INDEX (non-concurrent) acquires SHARE lock
CREATE INDEX idx_users_email ON users(email);

-- CREATE INDEX CONCURRENTLY acquires SHARE UPDATE EXCLUSIVE
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

## Lock Timeouts

### Setting Lock Timeout

```sql
-- Wait up to 5 seconds for lock
SET lock_timeout = '5s';

-- Or in transaction
BEGIN;
SET LOCAL lock_timeout = '5s';
SELECT * FROM users WHERE id = 1 FOR UPDATE;
COMMIT;
```

### Statement Timeout

```sql
-- Cancel query after 30 seconds
SET statement_timeout = '30s';
```

## Common Lock Scenarios

### Scenario 1: Long-Running Transaction

```sql
-- Session 1
BEGIN;
SELECT * FROM large_table;  -- Holds ACCESS SHARE
-- ... doesn't commit ...

-- Session 2 (blocked)
ALTER TABLE large_table ADD COLUMN new_col TEXT;  -- Needs ACCESS EXCLUSIVE
```

**Solution**: Keep transactions short, kill long-running transactions if needed

### Scenario 2: Concurrent DDL

```sql
-- Session 1
ALTER TABLE users ADD COLUMN col1 TEXT;  -- ACCESS EXCLUSIVE

-- Session 2 (blocked)
ALTER TABLE users ADD COLUMN col2 TEXT;  -- Also needs ACCESS EXCLUSIVE
```

**Solution**: Run DDL sequentially, use maintenance windows

### Scenario 3: VACUUM Blocking

```sql
-- Session 1
VACUUM FULL users;  -- SHARE UPDATE EXCLUSIVE

-- Session 2 (blocked)
CREATE INDEX idx_users_email ON users(email);  -- Needs SHARE
```

**Solution**: Use VACUUM instead of VACUUM FULL, or CREATE INDEX CONCURRENTLY

## Advisory Locks

Advisory locks are application-level locks using arbitrary integer keys:

```sql
-- Acquire advisory lock
SELECT pg_advisory_lock(12345);

-- Try to acquire (non-blocking)
SELECT pg_try_advisory_lock(12345);

-- Release
SELECT pg_advisory_unlock(12345);

-- Check if held
SELECT pg_advisory_lock_held(12345);
```

## Best Practices

1. **Keep transactions short** - Reduces lock duration
2. **Use appropriate isolation levels** - Don't use SERIALIZABLE unless needed
3. **Avoid long-running DDL** - Use maintenance windows
4. **Monitor locks** - Set up alerts for lock contention
5. **Use advisory locks** - For application-level coordination
6. **Set timeouts** - Prevent indefinite blocking

:::tip Production Insight
Most lock contention comes from long transactions or concurrent DDL. Monitor pg_locks regularly to catch issues early.
:::

## Next Steps

Continue to [Row-Level Locking](./row-locking) to understand how PostgreSQL locks individual rows.

