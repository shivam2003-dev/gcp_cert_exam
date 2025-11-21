# Backup Strategies

## pg_dump

```bash
pg_dump mydb > backup.sql
```

## pg_basebackup

```bash
pg_basebackup -D /backup -Ft -z -P
```

## Continuous Archiving

WAL archiving for point-in-time recovery.

## Next Steps

Continue to [Disaster Recovery](./disaster-recovery).

