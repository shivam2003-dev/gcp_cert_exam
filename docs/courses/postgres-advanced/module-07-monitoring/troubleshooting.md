# Troubleshooting

## Overview

This chapter covers systematic approaches to troubleshooting common PostgreSQL issues.

## Troubleshooting Methodology

### 1. Gather Information

- What is the symptom?
- When did it start?
- What changed recently?
- What are the error messages?

### 2. Check Logs

```bash
# Recent errors
tail -100 /var/log/postgresql/postgresql.log | grep -i error

# Check for patterns
grep -i "timeout\|connection\|deadlock" /var/log/postgresql/postgresql.log
```

### 3. Check System Resources

```bash
# CPU and memory
top
htop

# Disk I/O
iostat -x 1

# Disk space
df -h
```

### 4. Check Database State

```sql
-- Connections
SELECT count(*) FROM pg_stat_activity;

-- Locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Replication
SELECT * FROM pg_stat_replication;
```

## Common Issues

### Issue 1: High CPU Usage

**Symptoms:** High CPU, slow queries

**Investigation:**
```sql
-- Find active queries
SELECT pid, query, state, wait_event
FROM pg_stat_activity
WHERE state = 'active';

-- Check for long-running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

**Solutions:**
- Kill long-running queries
- Add indexes
- Optimize queries
- Increase work_mem

### Issue 2: High Memory Usage

**Symptoms:** Out of memory, swapping

**Investigation:**
```bash
# Check memory
free -h

# Check PostgreSQL memory
SELECT 
    setting as shared_buffers,
    (SELECT count(*) FROM pg_stat_activity) * 
    (SELECT setting::int FROM pg_settings WHERE name = 'work_mem') 
    as total_work_mem
FROM pg_settings 
WHERE name = 'shared_buffers';
```

**Solutions:**
- Reduce work_mem
- Reduce max_connections
- Use connection pooling
- Add more RAM

### Issue 3: Slow Queries

**Symptoms:** Queries taking too long

**Investigation:**
```sql
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Get query plan
EXPLAIN ANALYZE SELECT ...;
```

**Solutions:**
- Add indexes
- Update statistics
- Optimize queries
- Tune configuration

### Issue 4: Replication Lag

**Symptoms:** Replica falling behind

**Investigation:**
```sql
-- Check lag
SELECT 
    application_name,
    pg_size_pretty(
        pg_wal_lsn_diff(
            pg_current_wal_lsn(),
            replay_lsn
        )
    ) as lag
FROM pg_stat_replication;
```

**Solutions:**
- Check network
- Verify replica performance
- Check for long-running queries on replica
- Increase replica resources

### Issue 5: Lock Contention

**Symptoms:** Queries waiting, timeouts

**Investigation:**
```sql
-- Find blocking queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

**Solutions:**
- Kill blocking queries
- Keep transactions short
- Use appropriate isolation levels
- Optimize queries

## Diagnostic Queries

### System Health Check

```sql
-- Overall health
SELECT 
    (SELECT count(*) FROM pg_stat_activity) as connections,
    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_conn,
    (SELECT sum(n_dead_tup) FROM pg_stat_user_tables) as dead_tuples,
    (SELECT count(*) FROM pg_stat_replication) as replicas;
```

### Resource Usage

```sql
-- Memory usage
SELECT 
    name,
    setting,
    unit
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'maintenance_work_mem');
```

## Best Practices

1. **Document issues** - Keep runbooks
2. **Monitor proactively** - Catch issues early
3. **Test changes** - In staging first
4. **Have rollback plan** - For any change
5. **Learn from incidents** - Post-mortems

:::tip Production Insight
Good troubleshooting is systematic. Follow a process, gather data, test hypotheses, and document solutions.
:::

## Next Steps

You've completed Module 7! Move to [Module 8: PostgreSQL at Massive Scale](../module-08-high-scale/intro).
