# Crash Recovery

## Overview

PostgreSQL can recover from crashes by replaying the Write-Ahead Log (WAL). Understanding recovery is critical for production operations.

## How Recovery Works

When PostgreSQL starts after a crash:

1. **Read control file** - Find last checkpoint
2. **Read WAL** - Start from checkpoint
3. **Replay WAL records** - Apply changes in order
4. **Database becomes consistent** - Ready for connections

## Recovery Process

```
PostgreSQL Startup
    ↓
Read pg_control (last checkpoint)
    ↓
Open WAL from checkpoint LSN
    ↓
Replay WAL records
    ↓
Apply changes to data pages
    ↓
Database consistent
    ↓
Accept connections
```

## Control File

The **control file** (`pg_control`) contains:
- Last checkpoint LSN
- Database system identifier
- Timeline information
- Recovery settings

```bash
# View control file info
pg_controldata $PGDATA
```

## Recovery Modes

### Automatic Recovery

PostgreSQL automatically recovers on startup if:
- Last shutdown was not clean
- WAL files are present
- Control file is valid

### Point-in-Time Recovery (PITR)

Recover to a specific point in time:
1. Restore base backup
2. Configure recovery settings
3. Start PostgreSQL
4. Replay WAL until target time

## Recovery Configuration

```conf
# recovery.conf (or postgresql.conf in PG 12+)
restore_command = 'cp /backup/wal/%f %p'
recovery_target_time = '2024-01-15 14:30:00'
recovery_target_action = 'promote'
```

## Monitoring Recovery

```sql
-- Check if in recovery
SELECT pg_is_in_recovery();

-- Check recovery progress (if in recovery)
SELECT 
    pg_is_in_recovery() as in_recovery,
    pg_last_wal_replay_lsn() as replay_lsn,
    pg_last_wal_replay_lsn() - pg_current_wal_lsn() as lag;
```

## Common Recovery Scenarios

### Scenario 1: Database Crash

**What happens**:
- PostgreSQL stops unexpectedly
- Some pages may not be written to disk
- WAL contains all changes

**Recovery**:
- Automatic on next startup
- Replays WAL from last checkpoint
- Database becomes consistent

### Scenario 2: Disk Failure

**What happens**:
- Data files corrupted or lost
- WAL files may be available

**Recovery**:
1. Restore from backup
2. Replay WAL from backup time
3. Database restored to point of failure

### Scenario 3: Point-in-Time Recovery

**What happens**:
- Need to recover to specific time
- Before a bad transaction

**Recovery**:
1. Restore base backup
2. Configure recovery_target_time
3. Start PostgreSQL
4. Replay WAL until target time

## Best Practices

1. **Regular backups** - Base backups for recovery
2. **WAL archiving** - Enable for PITR
3. **Test recovery** - Regularly test restore procedures
4. **Monitor WAL** - Ensure archiving works
5. **Document procedures** - Recovery runbooks

## Next Steps

You've completed Module 1! Move to [Module 2: Query Planner & Performance Tuning](../module-02-planner/intro).

