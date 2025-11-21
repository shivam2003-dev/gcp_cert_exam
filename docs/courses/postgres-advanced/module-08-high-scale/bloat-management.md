# Bloat Management

## Monitoring Bloat

```sql
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup
FROM pg_stat_user_tables;
```

## Solutions

- Regular VACUUM
- VACUUM FULL when needed
- Tune autovacuum

## Next Steps

Continue to [Partition Management](./partition-management).

