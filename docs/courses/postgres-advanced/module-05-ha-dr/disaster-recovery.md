# Disaster Recovery

## Overview

Disaster recovery procedures ensure you can restore your database after catastrophic failures.

## Recovery Scenarios

### Scenario 1: Complete Data Loss

**Situation:** Primary database completely lost (disk failure, corruption, etc.)

**Recovery Steps:**

1. **Assess situation**
   - Determine last known good state
   - Check available backups
   - Verify WAL archives

2. **Restore base backup**
   ```bash
   # Restore from pg_basebackup
   tar -xzf base_backup.tar.gz -C /var/lib/postgresql/data
   
   # Or from pgBackRest
   pgbackrest restore --stanza=db
   ```

3. **Configure recovery**
   ```conf
   # postgresql.conf or recovery.conf
   restore_command = 'cp /backup/wal/%f %p'
   recovery_target_time = '2024-01-15 14:30:00'  # Optional
   ```

4. **Start PostgreSQL**
   ```bash
   systemctl start postgresql
   ```

5. **Verify data**
   ```sql
   SELECT COUNT(*) FROM important_table;
   ```

### Scenario 2: Point-in-Time Recovery

**Situation:** Need to recover to specific point before data corruption

**Recovery Steps:**

1. **Restore base backup**
   ```bash
   pgbackrest restore --stanza=db --type=time --target="2024-01-15 14:30:00"
   ```

2. **PostgreSQL automatically replays WAL**
   - Stops at recovery_target_time
   - Database ready for connections

### Scenario 3: Replica Promotion

**Situation:** Primary failed, promote replica

**Recovery Steps:**

1. **Verify replica is current**
   ```sql
   SELECT pg_last_wal_replay_lsn();
   ```

2. **Promote replica**
   ```sql
   SELECT pg_promote();
   ```

3. **Update application connections**
   - Point to new primary
   - Update DNS/load balancer

4. **Verify functionality**
   - Test critical queries
   - Monitor for issues

## Recovery Procedures

### Full Database Restore

```bash
# 1. Stop PostgreSQL
systemctl stop postgresql

# 2. Backup current data (if exists)
mv /var/lib/postgresql/data /var/lib/postgresql/data.old

# 3. Restore base backup
pgbackrest restore --stanza=db

# 4. Configure recovery (if needed)
# Edit postgresql.conf with recovery settings

# 5. Start PostgreSQL
systemctl start postgresql

# 6. Verify
psql -c "SELECT version();"
```

### Selective Table Restore

```bash
# From pg_dump backup
pg_restore -d mydb -t users backup.dump

# Or from SQL dump
psql mydb -c "\i users_backup.sql"
```

## Testing Recovery

### Regular Testing

1. **Monthly recovery tests**
   - Restore to test environment
   - Verify data integrity
   - Test application connectivity

2. **Document issues**
   - Note any problems
   - Update procedures
   - Train team

### Recovery Test Checklist

- [ ] Backup accessible
- [ ] Can restore base backup
- [ ] WAL archives available
- [ ] Recovery completes successfully
- [ ] Data integrity verified
- [ ] Application connects
- [ ] Performance acceptable

## RPO and RTO Planning

### Define Requirements

- **RPO:** How much data loss acceptable?
- **RTO:** How quickly must system recover?

### Design for Requirements

**RPO = 0, RTO = 0:**
- Synchronous replication
- Automatic failover
- Multiple replicas

**RPO = 1 hour, RTO = 1 hour:**
- Asynchronous replication
- WAL archiving
- Manual failover acceptable

**RPO = 24 hours, RTO = 24 hours:**
- Daily backups
- Manual restore procedures

## Best Practices

1. **Document procedures** - Step-by-step runbooks
2. **Test regularly** - Monthly recovery tests
3. **Train team** - Everyone should know procedures
4. **Automate where possible** - Reduce human error
5. **Monitor backups** - Alert on failures
6. **Keep backups off-site** - Don't rely on single location
7. **Verify backups** - Test restores regularly

:::warning Critical
Disaster recovery is not optional. Test your recovery procedures before you need them!
:::

## Next Steps

You've completed Module 5! Move to [Module 6: Production Tuning & Configuration](../module-06-tuning/intro).
