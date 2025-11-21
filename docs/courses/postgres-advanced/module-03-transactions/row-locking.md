# Row-Level Locking

## Overview

PostgreSQL uses row-level locks to coordinate concurrent access to individual rows. Understanding row locking is essential for high-concurrency applications.

## Row Lock Modes

### FOR UPDATE

Locks row for update:

```sql
SELECT * FROM users WHERE id = 1 FOR UPDATE;
-- Row is locked until transaction commits
```

**Behavior:**
- Other transactions can't UPDATE or DELETE the row
- Other transactions can't SELECT FOR UPDATE the row
- Other transactions can SELECT the row (MVCC)

### FOR SHARE

Locks row for shared access:

```sql
SELECT * FROM users WHERE id = 1 FOR SHARE;
```

**Behavior:**
- Other transactions can SELECT FOR SHARE
- Other transactions can't UPDATE, DELETE, or SELECT FOR UPDATE
- Used for read consistency

### FOR NO KEY UPDATE

Locks row but allows foreign key operations:

```sql
SELECT * FROM users WHERE id = 1 FOR NO KEY UPDATE;
```

### FOR KEY SHARE

Weakest row lock, only prevents foreign key violations:

```sql
SELECT * FROM users WHERE id = 1 FOR KEY SHARE;
```

## Lock Conflicts

| Lock Mode | FOR KEY SHARE | FOR SHARE | FOR NO KEY UPDATE | FOR UPDATE |
|-----------|---------------|-----------|-------------------|------------|
| **FOR KEY SHARE** | ✓ | ✓ | ✓ | ✓ |
| **FOR SHARE** | ✓ | ✓ | ✗ | ✗ |
| **FOR NO KEY UPDATE** | ✓ | ✗ | ✗ | ✗ |
| **FOR UPDATE** | ✓ | ✗ | ✗ | ✗ |

## Locking Behavior

### MVCC and Row Locks

Row locks don't block regular SELECTs due to MVCC:

```sql
-- Session 1
BEGIN;
SELECT * FROM users WHERE id = 1 FOR UPDATE;
-- Don't commit yet

-- Session 2 (not blocked!)
SELECT * FROM users WHERE id = 1;  -- Returns old version
```

### UPDATE Automatically Locks

```sql
-- This automatically acquires FOR UPDATE lock
UPDATE users SET email = 'new@example.com' WHERE id = 1;
```

## Viewing Row Locks

```sql
-- View row-level locks
SELECT 
    locktype,
    relation::regclass,
    page,
    tuple,
    mode,
    granted,
    pid
FROM pg_locks
WHERE locktype = 'tuple';
```

## Deadlocks with Row Locks

Row locks can cause deadlocks:

```sql
-- Session 1
BEGIN;
UPDATE users SET email = 'new1' WHERE id = 1;  -- Locks row 1
-- Waiting for row 2...

-- Session 2
BEGIN;
UPDATE users SET email = 'new2' WHERE id = 2;  -- Locks row 2
UPDATE users SET email = 'new3' WHERE id = 1;  -- Waiting for row 1
-- DEADLOCK!
```

PostgreSQL detects and resolves deadlocks automatically.

## Best Practices

1. **Lock in consistent order** - Always lock rows in same order
2. **Keep locks short** - Commit transactions quickly
3. **Use appropriate lock mode** - FOR SHARE when possible
4. **Avoid unnecessary locks** - Don't lock if not needed
5. **Handle deadlocks** - Application should retry on deadlock

:::tip Production Insight
Row locks are lightweight but can cause deadlocks. Always lock in consistent order across your application.
:::

## Next Steps

Continue to [Deadlocks](./deadlocks) to understand how deadlocks occur and how to prevent them.

