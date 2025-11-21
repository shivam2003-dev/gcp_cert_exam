# Configuration Basics

## Overview

PostgreSQL has hundreds of configuration parameters. This chapter covers the basics of configuration management.

## Configuration Files

### postgresql.conf

Main configuration file:

```conf
# Memory settings
shared_buffers = 4GB
work_mem = 64MB

# Connection settings
max_connections = 100

# WAL settings
wal_level = replica
```

### postgresql.auto.conf

Auto-generated file (don't edit manually):
- Created by ALTER SYSTEM
- Loaded after postgresql.conf
- Takes precedence

### Location

```sql
-- Find config file location
SHOW config_file;

-- Find data directory
SHOW data_directory;
```

## Viewing Configuration

### Current Settings

```sql
-- All settings
SHOW ALL;

-- Specific setting
SHOW shared_buffers;

-- Settings with descriptions
SELECT name, setting, unit, context, short_desc
FROM pg_settings
WHERE name = 'shared_buffers';
```

### Changed Settings

```sql
-- Settings changed from default
SELECT name, setting, source
FROM pg_settings
WHERE source != 'default';
```

## Changing Configuration

### Method 1: Edit postgresql.conf

```conf
# Edit file
shared_buffers = 8GB

# Reload (for some settings)
SELECT pg_reload_conf();

# Or restart (for some settings)
systemctl restart postgresql
```

### Method 2: ALTER SYSTEM

```sql
-- Change setting
ALTER SYSTEM SET shared_buffers = '8GB';

-- Reload
SELECT pg_reload_conf();
```

### Method 3: SET (Session)

```sql
-- For current session
SET work_mem = '128MB';

-- For current transaction
SET LOCAL work_mem = '128MB';
```

## Setting Contexts

### internal

Cannot be changed (compiled-in):
- data_directory
- max_identifier_length

### postmaster

Requires restart:
- shared_buffers
- max_connections
- port

### superuser

Can be changed by superuser:
- work_mem
- maintenance_work_mem

### user

Can be changed by any user:
- statement_timeout
- timezone

## Reloading vs Restarting

### Settings Requiring Reload

```sql
SELECT pg_reload_conf();  -- Sufficient for:
```

- work_mem
- log settings
- Most runtime parameters

### Settings Requiring Restart

```bash
systemctl restart postgresql  -- Required for:
```

- shared_buffers
- max_connections
- wal_level
- data_directory

## Configuration Best Practices

1. **Document changes** - Know what you changed and why
2. **Test changes** - In staging first
3. **Change incrementally** - One setting at a time
4. **Monitor impact** - After each change
5. **Use ALTER SYSTEM** - For persistent changes
6. **Backup config** - Before major changes

## Next Steps

Continue to [Memory Tuning](./memory-tuning) to learn about memory configuration.
