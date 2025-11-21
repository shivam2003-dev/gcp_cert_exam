# Lock Debugging

## Finding Lock Issues

### View Current Locks

```sql
-- All current locks
SELECT 
    locktype,
    relation::regclass as table_name,
    mode,
    granted,
    pid,
    pg_blocking_pids(pid) as blocked_by
FROM pg_locks
WHERE relation IS NOT NULL
ORDER BY pid;
```

### Find Blocking Queries

```sql
-- Queries blocking others
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query,
    blocked_activity.application_name AS blocked_app,
    blocking_activity.application_name AS blocking_app
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
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### Find Long-Running Transactions

```sql
-- Transactions holding locks for a long time
SELECT 
    pid,
    now() - xact_start AS transaction_duration,
    now() - query_start AS query_duration,
    state,
    query,
    wait_event_type,
    wait_event
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
  AND state != 'idle'
ORDER BY xact_start;
```

## Common Lock Scenarios

### Scenario 1: DDL Blocking Queries

```sql
-- Find what's blocking ALTER TABLE
SELECT 
    blocking.pid AS blocking_pid,
    blocking.query AS blocking_query,
    blocked.pid AS blocked_pid,
    blocked.query AS blocked_query
FROM pg_stat_activity blocking
JOIN pg_locks blocking_locks ON blocking_locks.pid = blocking.pid
JOIN pg_locks blocked_locks ON 
    blocked_locks.locktype = blocking_locks.locktype
    AND blocked_locks.relation = blocking_locks.relation
JOIN pg_stat_activity blocked ON blocked.pid = blocked_locks.pid
WHERE blocking_locks.granted = true
  AND blocked_locks.granted = false;
```

### Scenario 2: VACUUM Blocking

```sql
-- Find queries blocked by VACUUM
SELECT 
    a.pid,
    a.query,
    a.state,
    l.mode,
    l.locktype
FROM pg_stat_activity a
JOIN pg_locks l ON l.pid = a.pid
WHERE a.query LIKE '%VACUUM%'
  AND l.granted = true;
```

## Killing Blocking Queries

### Cancel Query

```sql
-- Cancel query (SIGINT - allows rollback)
SELECT pg_cancel_backend(pid);
```

### Terminate Connection

```sql
-- Terminate connection (SIGTERM - forces disconnect)
SELECT pg_terminate_backend(pid);
```

### Kill All Connections to Database

```sql
-- Kill all connections except current
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'mydb'
  AND pid != pg_backend_pid();
```

## Monitoring Lock Waits

### Enable Lock Wait Logging

```conf
# postgresql.conf
log_lock_waits = on
deadlock_timeout = 1s
```

### Check Lock Wait Statistics

```sql
-- View lock wait events
SELECT 
    pid,
    wait_event_type,
    wait_event,
    state,
    query
FROM pg_stat_activity
WHERE wait_event_type = 'Lock';
```

## Best Practices

1. **Monitor locks regularly** - Set up alerts for long waits
2. **Keep transactions short** - Reduces lock duration
3. **Use appropriate timeouts** - Set lock_timeout
4. **Document lock patterns** - Know what locks your app uses
5. **Test under load** - Lock issues appear under concurrency

:::tip Production Insight
Lock debugging is about finding what's blocking what. The queries above help you identify the root cause quickly.
:::

## Next Steps

You've completed Module 3! Move to [Module 4: Scaling PostgreSQL](../module-04-scaling/intro).

