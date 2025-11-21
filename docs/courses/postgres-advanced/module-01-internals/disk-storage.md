# Disk Storage & Page Layout

## Overview

Understanding how PostgreSQL stores data on disk is fundamental to performance tuning and troubleshooting.

## Storage Hierarchy

```
Database Cluster
└── Database
    └── Schema
        └── Table/Index
            └── File (8KB pages)
```

## Pages

PostgreSQL stores data in **pages** (also called blocks):
- **Size**: 8KB (8192 bytes) - fixed
- **Location**: Stored in files in the database directory
- **Structure**: Header + data + special space

### Page Layout

```
+-------------------+
| Page Header (24B) |
+-------------------+
| Item Pointers     |
+-------------------+
| Free Space        |
+-------------------+
| Tuples (Rows)     |
+-------------------+
| Special Space     |
+-------------------+
```

### Page Header

Contains metadata:
- **LSN** - Last WAL location
- **Checksum** - Page integrity
- **Flags** - Page state
- **Lower/Upper** - Free space boundaries

### Item Pointers

Array of pointers to tuples:
- Each pointer is 4 bytes
- Points to tuple location within page
- Used for quick tuple access

## Table Storage

### Heap Files

Tables are stored as **heap files**:
- One file per table (if < 1GB)
- Multiple files if table is large (1GB segments)
- File naming: `relfilenode` (e.g., `16384`)

### Finding Table Files

```sql
-- Get table's file node
SELECT pg_relation_filepath('table_name');

-- Get table size
SELECT pg_size_pretty(pg_relation_size('table_name'));

-- Get total size including indexes
SELECT pg_size_pretty(pg_total_relation_size('table_name'));
```

## Index Storage

Indexes are stored similarly:
- B-tree indexes use same page structure
- Each index is a separate file
- Index pages contain index entries, not data

## TOAST (The Oversized-Attribute Storage Technique)

Large values are stored in **TOAST**:
- Values > 2KB are TOASTed
- Stored in separate TOAST table
- Original table stores pointer

```sql
-- Check TOAST size
SELECT 
    pg_size_pretty(pg_relation_size('table_name')) as table_size,
    pg_size_pretty(pg_relation_size('pg_toast.pg_toast_' || oid)) as toast_size
FROM pg_class
WHERE relname = 'table_name';
```

## File System Layout

```
$PGDATA/
├── base/              # Database files
│   ├── 1/            # Template database
│   └── 16384/        # Your database
│       ├── 16385     # Table file
│       └── 16386     # Index file
├── global/           # Cluster-wide files
├── pg_wal/           # WAL files
├── pg_tblspc/        # Tablespaces
└── pg_stat/          # Statistics
```

## Reading Pages

PostgreSQL reads pages into shared buffers:
1. Check if page in buffer cache
2. If not, read from disk
3. Load into shared buffers
4. Return to requester

## Writing Pages

Pages are written:
1. Modified in shared buffers (dirty)
2. WAL record written first
3. Checkpoint writes dirty pages to disk
4. Page marked clean

## Best Practices

1. **Use appropriate page size** - 8KB is fixed, but consider row size
2. **Monitor table bloat** - Dead tuples waste space
3. **Use TOAST wisely** - Large columns are stored separately
4. **Consider partitioning** - Large tables benefit from partitioning
5. **Monitor file sizes** - Know where your data is stored

## Next Steps

Continue to [Crash Recovery](./crash-recovery) to understand how PostgreSQL recovers from failures.

