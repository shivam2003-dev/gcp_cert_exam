# Deadlocks

## What is a Deadlock?

A **deadlock** occurs when two or more transactions are waiting for each other to release locks, creating a circular dependency.

## How Deadlocks Happen

### Example Deadlock

```sql
-- Transaction 1
BEGIN;
UPDATE users SET email = 'new1' WHERE id = 1;  -- Locks row 1
-- ... processing ...
UPDATE users SET email = 'new2' WHERE id = 2;  -- Waits for row 2

-- Transaction 2 (concurrent)
BEGIN;
UPDATE users SET email = 'new3' WHERE id = 2;  -- Locks row 2
-- ... processing ...
UPDATE users SET email = 'new4' WHERE id = 1;  -- Waits for row 1

-- DEADLOCK! Both waiting for each other
```

PostgreSQL detects this and aborts one transaction.

## Deadlock Detection

PostgreSQL automatically detects deadlocks:

1. **Checks periodically** - Every `deadlock_timeout` (default 1 second)
2. **Finds cycles** - Detects circular wait
3. **Aborts victim** - Cancels one transaction
4. **Returns error** - `ERROR: deadlock detected`

### Deadlock Timeout

```sql
-- Check current setting
SHOW deadlock_timeout;

-- Adjust if needed (not recommended to change)
-- postgresql.conf: deadlock_timeout = 1s
```

## Preventing Deadlocks

### Strategy 1: Consistent Lock Order

**Always acquire locks in the same order:**

```python
# Good: Always lock in id order
def update_users(user_ids):
    sorted_ids = sorted(user_ids)
    for user_id in sorted_ids:
        update_user(user_id)
```

**Bad:**
```python
# Bad: Order depends on input
def update_users(user_ids):
    for user_id in user_ids:  # Order not guaranteed
        update_user(user_id)
```

### Strategy 2: Lock All Rows First

```sql
-- Lock all needed rows at once
SELECT * FROM users WHERE id IN (1, 2, 3) ORDER BY id FOR UPDATE;

-- Then update
UPDATE users SET email = 'new1' WHERE id = 1;
UPDATE users SET email = 'new2' WHERE id = 2;
UPDATE users SET email = 'new3' WHERE id = 3;
```

### Strategy 3: Use Advisory Locks

```sql
-- Use advisory locks for coordination
SELECT pg_advisory_lock(12345);  -- Application-level lock
-- ... do work ...
SELECT pg_advisory_unlock(12345);
```

### Strategy 4: Keep Transactions Short

```sql
-- Good: Short transaction
BEGIN;
UPDATE users SET email = 'new@example.com' WHERE id = 1;
COMMIT;  -- Release locks quickly

-- Bad: Long transaction
BEGIN;
UPDATE users SET email = 'new@example.com' WHERE id = 1;
-- ... application processes for minutes ...
COMMIT;  -- Locks held too long
```

## Handling Deadlocks in Applications

### Retry Logic

```python
import psycopg2
from psycopg2 import OperationalError

def update_with_retry(conn, query, max_retries=3):
    for attempt in range(max_retries):
        try:
            with conn.cursor() as cur:
                cur.execute(query)
                conn.commit()
                return
        except OperationalError as e:
            if 'deadlock detected' in str(e) and attempt < max_retries - 1:
                time.sleep(0.1 * (attempt + 1))  # Exponential backoff
                continue
            raise
```

## Monitoring Deadlocks

### Check Logs

```sql
-- Enable deadlock logging
-- postgresql.conf
log_lock_waits = on
deadlock_timeout = 1s
```

Logs will show:
```
ERROR: deadlock detected
DETAIL: Process 12345 waits for ShareLock on transaction 67890; blocked by process 11111.
Process 11111 waits for ShareLock on transaction 67890; blocked by process 12345.
```

### Query Statistics

```sql
-- Check deadlock count
SELECT 
    datname,
    deadlocks
FROM pg_stat_database
WHERE datname = current_database();
```

## Common Deadlock Scenarios

### Scenario 1: Foreign Key Updates

```sql
-- Transaction 1
UPDATE parent SET id = 2 WHERE id = 1;  -- Locks parent row 1

-- Transaction 2
UPDATE child SET parent_id = 2 WHERE parent_id = 1;  -- Locks child rows
UPDATE parent SET id = 3 WHERE id = 2;  -- Waits for parent row 2

-- Transaction 1 continues
UPDATE child SET parent_id = 2 WHERE parent_id = 1;  -- Waits for child rows
-- DEADLOCK!
```

**Solution**: Update in consistent order, or use DEFERRABLE constraints

### Scenario 2: Multiple Table Updates

```sql
-- Transaction 1
UPDATE users SET email = 'new1' WHERE id = 1;
UPDATE orders SET status = 'processed' WHERE user_id = 1;

-- Transaction 2
UPDATE orders SET status = 'processed' WHERE user_id = 2;
UPDATE users SET email = 'new2' WHERE id = 2;
-- DEADLOCK if rows overlap!
```

**Solution**: Always update in same table order (users, then orders)

## Best Practices

1. **Lock in consistent order** - Always same order across application
2. **Keep transactions short** - Reduce lock duration
3. **Lock all rows first** - If possible, lock everything upfront
4. **Handle deadlocks gracefully** - Retry in application
5. **Monitor deadlock frequency** - Alert if too high
6. **Use appropriate isolation** - Lower isolation = fewer deadlocks

:::warning Production Warning
Deadlocks are inevitable in high-concurrency systems. The key is handling them gracefully with retry logic.
:::

## Next Steps

Continue to [Transaction Isolation](./isolation-levels) to understand isolation levels and their guarantees.

