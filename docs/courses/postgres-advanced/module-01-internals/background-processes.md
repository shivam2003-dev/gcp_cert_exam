# Background Processes

## Overview

PostgreSQL runs several background processes that handle critical operations. Understanding these processes is essential for troubleshooting and performance tuning.

## Main Processes

### Postmaster (Main Process)

The **postmaster** is the main PostgreSQL process:
- First process started when PostgreSQL starts
- Manages all other processes
- Handles connection requests
- Coordinates shutdown

```bash
# View PostgreSQL processes
ps aux | grep postgres

# Main postmaster process
postgres: main: postmaster
```

### Backend Processes

**Backend processes** handle individual client connections:
- One process per connection
- Executes queries for that connection
- Terminates when connection closes

```bash
# Backend processes
postgres: main: user database [local] idle
postgres: main: user database [local] SELECT
```

### Background Worker Processes

Several background workers handle maintenance:

#### 1. Autovacuum Launcher

- Starts autovacuum worker processes
- Monitors tables for vacuum needs
- Spawns workers based on configuration

#### 2. Autovacuum Workers

- Run VACUUM and ANALYZE operations
- Multiple workers can run simultaneously
- Controlled by `autovacuum_max_workers`

#### 3. WAL Writer

- Writes WAL buffers to disk
- Ensures WAL durability
- Runs continuously

#### 4. Checkpointer

- Performs checkpoints
- Writes dirty pages to disk
- Updates control file

#### 5. Stats Collector

- Collects database statistics
- Updates pg_stat_* views
- Writes to stats file

#### 6. Logger

- Writes log messages to files
- Handles log rotation
- Manages log levels

## Process Architecture

```
Postmaster (PID 1)
├── Backend Process (Connection 1)
├── Backend Process (Connection 2)
├── Autovacuum Launcher
│   ├── Autovacuum Worker 1
│   └── Autovacuum Worker 2
├── WAL Writer
├── Checkpointer
├── Stats Collector
└── Logger
```

## Monitoring Processes

```sql
-- View all processes
SELECT 
    pid,
    usename,
    datname,
    state,
    query,
    query_start,
    backend_start
FROM pg_stat_activity;

-- Count processes by type
SELECT 
    CASE 
        WHEN query LIKE 'autovacuum%' THEN 'autovacuum'
        WHEN query LIKE 'VACUUM%' THEN 'manual_vacuum'
        WHEN state = 'idle' THEN 'idle'
        ELSE 'active'
    END as process_type,
    count(*) as count
FROM pg_stat_activity
WHERE pid != pg_backend_pid()
GROUP BY process_type;
```

## Process Management

### Killing Processes

```sql
-- Cancel a query (SIGINT)
SELECT pg_cancel_backend(pid);

-- Terminate a connection (SIGTERM)
SELECT pg_terminate_backend(pid);

-- Kill all connections to a database
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'database_name' 
  AND pid != pg_backend_pid();
```

:::warning Production Warning
Be careful when killing processes. Terminating a backend during a transaction can cause rollback and may leave the database in an inconsistent state if done incorrectly.
:::

## Next Steps

Continue to [Disk Storage & Page Layout](./disk-storage) to understand how PostgreSQL stores data.

