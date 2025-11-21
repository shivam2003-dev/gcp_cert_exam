# MVCC Architecture

## What is MVCC?

**Multi-Version Concurrency Control (MVCC)** is PostgreSQL's core mechanism for handling concurrent transactions. Unlike databases that use locking for isolation, PostgreSQL creates multiple versions of rows to allow readers and writers to work simultaneously.

## The Core Problem

Traditional locking approaches have a fundamental issue:

- **Pessimistic locking**: Writers block readers, readers block writers
- **Low concurrency**: Only one transaction can modify data at a time
- **Deadlocks**: Complex locking can cause circular waits

MVCC solves this by:
- **No read locks**: Readers never block writers
- **No write locks**: Writers don't block readers (in most cases)
- **Snapshot isolation**: Each transaction sees a consistent snapshot

## How MVCC Works

### Row Versions

Every row in PostgreSQL has:
- **xmin** - Transaction ID that created this version
- **xmax** - Transaction ID that deleted/updated this version (if any)
- **ctid** - Physical location of the row (page number + offset)

When you UPDATE a row, PostgreSQL:
1. Creates a **new version** of the row with the updated data
2. Sets the old row's **xmax** to the current transaction ID
3. Sets the new row's **xmin** to the current transaction ID

The old version remains until vacuum removes it.

### Transaction IDs

PostgreSQL assigns each transaction a unique **Transaction ID (XID)**:
- Sequential 32-bit integers
- Wraps around at 2^31 (about 2 billion transactions)
- Used to determine row visibility

### Visibility Rules

A row is visible to a transaction if:
1. **xmin < transaction's XID** (row was created before transaction started)
2. **xmax is NULL or xmax > transaction's XID** (row not deleted, or deleted after transaction started)
3. **xmin transaction committed** (creating transaction completed)
4. **xmax transaction not committed** (or doesn't exist)

### Snapshot Isolation

Each transaction gets a **snapshot** that includes:
- **xmin** - Lowest active transaction ID
- **xmax** - Highest committed transaction ID + 1
- **xip_list** - List of in-progress transaction IDs

This snapshot determines which row versions are visible.

## Example: Concurrent Transactions

```sql
-- Transaction 1 (XID = 100)
BEGIN;
UPDATE users SET name = 'Alice' WHERE id = 1;
-- Creates new row version with xmin=100, old version has xmax=100
COMMIT;

-- Transaction 2 (XID = 101) - Started before Transaction 1 committed
BEGIN;  -- Snapshot: xmin=100, xmax=101
SELECT name FROM users WHERE id = 1;
-- Still sees old version (xmax=100 > 101 is false, so row visible)
COMMIT;
```

Transaction 2 sees the old value because its snapshot was taken before Transaction 1 committed.

## Visibility Map & Hint Bits

PostgreSQL maintains a **visibility map** to optimize vacuum:
- Bitmap indicating which pages are "all visible"
- Pages where all rows are visible to all transactions
- Allows vacuum to skip pages during full table scans

**Hint bits** are flags stored in row headers:
- **HEAP_XMIN_COMMITTED** - xmin transaction committed
- **HEAP_XMAX_COMMITTED** - xmax transaction committed
- **HEAP_XMIN_INVALID** - xmin transaction aborted
- **HEAP_XMAX_INVALID** - xmax transaction aborted

These bits avoid checking the transaction status table (pg_clog) repeatedly.

## Transaction Status (pg_clog)

PostgreSQL maintains transaction status in **pg_clog** (commit log):
- 2 bits per transaction: committed, aborted, in-progress, sub-committed
- Cached in memory for performance
- Checked to determine row visibility

:::warning What Breaks in Production
If pg_clog is corrupted or missing, PostgreSQL cannot determine row visibility. This causes queries to fail or return incorrect results. Always backup pg_clog!
:::

## MVCC Overhead

MVCC has costs:

1. **Storage overhead** - Multiple versions of rows consume space
2. **Vacuum required** - Old versions must be cleaned up
3. **Transaction ID wraparound** - Must prevent XID exhaustion
4. **Visibility checks** - CPU overhead checking transaction status

### Storage Bloat

When many updates occur:
- Old row versions accumulate
- Tables grow larger than necessary
- Indexes point to dead tuples
- Queries scan more data than needed

This is why **vacuum** is critical.

## Freezing Transactions

PostgreSQL uses **transaction freezing** to prevent XID wraparound:

- Transactions older than 2 billion are "frozen"
- Frozen rows are always visible to all transactions
- Autovacuum automatically freezes old rows
- If freezing fails, database becomes read-only

:::danger Critical Production Issue
If transaction ID wraparound occurs, PostgreSQL will refuse writes. This happens when:
- Autovacuum is disabled or too slow
- Very old transactions exist
- Freeze process can't keep up

Monitor `age(pg_database.datfrozenxid)` to prevent this!
:::

## MVCC in Practice

### Checking Row Versions

```sql
-- See transaction IDs for a row
SELECT xmin, xmax, ctid, * FROM users WHERE id = 1;

-- Check transaction status
SELECT * FROM pg_clog WHERE xid = 100;
```

### Understanding Concurrency

```sql
-- Session 1
BEGIN;
UPDATE users SET balance = balance - 100 WHERE id = 1;
-- Don't commit yet

-- Session 2 (in another connection)
BEGIN;
SELECT balance FROM users WHERE id = 1;
-- Still sees old balance (MVCC isolation)

-- Session 1
COMMIT;

-- Session 2
SELECT balance FROM users WHERE id = 1;
-- Still sees old balance (snapshot isolation)
COMMIT;

-- Session 2 (new transaction)
BEGIN;
SELECT balance FROM users WHERE id = 1;
-- Now sees new balance
```

## Common MVCC Issues

### 1. Long-Running Transactions

```sql
-- This transaction holds onto old row versions
BEGIN;
SELECT * FROM large_table;
-- ... application processes for hours ...
COMMIT;
```

**Problem**: Prevents vacuum from removing old versions
**Solution**: Keep transactions short, use read-only replicas for long queries

### 2. Hot Updates

```sql
-- Updating indexed columns creates new index entries
UPDATE users SET email = 'new@example.com' WHERE id = 1;
```

**Problem**: Old index entries remain until vacuum
**Solution**: Monitor index bloat, tune autovacuum

### 3. Transaction ID Wraparound

```sql
-- Check how close you are to wraparound
SELECT 
    datname,
    age(datfrozenxid) as xid_age,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
ORDER BY age(datfrozenxid) DESC;
```

**Problem**: If age exceeds 2 billion, database becomes read-only
**Solution**: Ensure autovacuum runs, monitor freeze progress

## Best Practices

1. **Keep transactions short** - Reduces MVCC overhead
2. **Monitor vacuum** - Ensure old versions are cleaned up
3. **Watch XID age** - Prevent wraparound
4. **Use appropriate isolation levels** - Don't use SERIALIZABLE unless needed
5. **Understand snapshot isolation** - Know what your queries see

:::tip Production Insight
MVCC is why PostgreSQL can handle high read concurrency. Understanding it helps you design schemas and queries that work with the system, not against it.
:::

## Next Steps

Continue to [Write-Ahead Log (WAL)](./wal-checkpointing) to understand how PostgreSQL ensures durability.

