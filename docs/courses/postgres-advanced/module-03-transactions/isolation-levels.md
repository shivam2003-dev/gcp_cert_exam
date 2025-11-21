# Transaction Isolation Levels

## Overview

PostgreSQL supports four transaction isolation levels, each providing different guarantees about what transactions can see.

## Isolation Levels

### READ UNCOMMITTED

**Not supported in PostgreSQL** - Treated as READ COMMITTED.

PostgreSQL's MVCC makes READ UNCOMMITTED unnecessary - you can't see uncommitted data anyway.

### READ COMMITTED (Default)

Each statement sees only data committed before the statement began.

**Characteristics:**
- Default isolation level
- Each statement gets new snapshot
- Can see different data in same transaction
- No dirty reads (can't see uncommitted data)
- Non-repeatable reads possible
- Phantom reads possible

**Example:**

```sql
-- Session 1
BEGIN;
SELECT balance FROM accounts WHERE id = 1;  -- Returns 1000
-- ... doesn't commit yet ...

-- Session 2
BEGIN;
UPDATE accounts SET balance = 2000 WHERE id = 1;
COMMIT;

-- Session 1 (same transaction)
SELECT balance FROM accounts WHERE id = 1;  -- Returns 2000 (different!)
COMMIT;
```

### REPEATABLE READ

Transaction sees consistent snapshot throughout. Same query always returns same results.

**Characteristics:**
- Snapshot taken at transaction start
- Same query returns same results
- No dirty reads
- No non-repeatable reads
- Phantom reads possible (in some cases)
- Serializable errors possible

**Example:**

```sql
-- Session 1
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1;  -- Returns 1000

-- Session 2
BEGIN;
UPDATE accounts SET balance = 2000 WHERE id = 1;
COMMIT;

-- Session 1 (same transaction)
SELECT balance FROM accounts WHERE id = 1;  -- Still returns 1000 (same!)
COMMIT;
```

### SERIALIZABLE

Strictest isolation. Transactions execute as if serially.

**Characteristics:**
- Highest isolation
- Prevents all anomalies
- Serializable errors common
- Performance impact
- Use only when necessary

**Example:**

```sql
-- Session 1
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT SUM(balance) FROM accounts;  -- Returns 10000

-- Session 2
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT SUM(balance) FROM accounts;  -- Returns 10000
UPDATE accounts SET balance = balance + 1000 WHERE id = 1;
COMMIT;  -- Succeeds

-- Session 1
UPDATE accounts SET balance = balance - 500 WHERE id = 2;
COMMIT;  -- ERROR: could not serialize access due to concurrent update
```

## Isolation Anomalies

### Dirty Read

Reading uncommitted data. **Not possible in PostgreSQL** due to MVCC.

### Non-Repeatable Read

Same query returns different results in same transaction.

**READ COMMITTED allows this:**
```sql
-- First read
SELECT balance FROM accounts WHERE id = 1;  -- 1000

-- Another transaction commits update

-- Second read (different result)
SELECT balance FROM accounts WHERE id = 1;  -- 2000
```

**REPEATABLE READ prevents this.**

### Phantom Read

Seeing new rows that weren't there before.

**Example:**
```sql
-- First query
SELECT COUNT(*) FROM accounts WHERE status = 'active';  -- 10

-- Another transaction inserts active account

-- Second query (phantom row)
SELECT COUNT(*) FROM accounts WHERE status = 'active';  -- 11
```

## Choosing Isolation Level

### Use READ COMMITTED When:

- Default is usually fine
- Application handles concurrent updates
- Performance is important
- Most use cases

### Use REPEATABLE READ When:

- Need consistent reads within transaction
- Doing multiple reads that must match
- Can handle serialization errors

### Use SERIALIZABLE When:

- Absolute consistency required
- Complex transactions with multiple tables
- Willing to handle serialization errors
- Performance acceptable

## Setting Isolation Level

```sql
-- For current transaction
BEGIN ISOLATION LEVEL REPEATABLE READ;

-- Or
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;

-- For session (all future transactions)
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- For database (default for new connections)
ALTER DATABASE mydb SET default_transaction_isolation = 'repeatable read';
```

## Best Practices

1. **Use READ COMMITTED by default** - It's usually sufficient
2. **Upgrade only when needed** - Higher isolation has costs
3. **Handle serialization errors** - If using SERIALIZABLE
4. **Test isolation behavior** - Understand what your app sees
5. **Document isolation requirements** - Know why you chose a level

:::tip Production Insight
Most applications work fine with READ COMMITTED. Only use higher isolation when you have specific consistency requirements.
:::

## Next Steps

Continue to [Lock Debugging](./lock-debugging) to learn how to find and fix lock issues.

