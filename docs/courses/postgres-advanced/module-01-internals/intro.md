# Module 1: PostgreSQL Internals

## Overview

To truly master PostgreSQL, you must understand how it works internally. This module dives deep into the engine that powers PostgreSQL.

## Learning Objectives

By the end of this module, you will understand:

- How PostgreSQL stores data on disk
- How MVCC (Multi-Version Concurrency Control) works
- How the Write-Ahead Log (WAL) ensures durability
- How the buffer cache manages memory
- How vacuum and autovacuum maintain the database
- How crash recovery works
- How PostgreSQL reads and writes pages

## Module Structure

1. [MVCC Architecture](./mvcc-architecture) - How PostgreSQL handles concurrent transactions
2. [Write-Ahead Log (WAL)](./wal-checkpointing) - Durability and crash recovery
3. [Buffer Cache & Shared Buffers](./buffer-cache) - Memory management
4. [Background Processes](./background-processes) - What runs behind the scenes
5. [Vacuum & Autovacuum](./vacuum-autovacuum) - Maintaining database health
6. [Disk Storage & Page Layout](./disk-storage) - How data is stored on disk
7. [Crash Recovery](./crash-recovery) - How PostgreSQL recovers from failures

## Why This Matters

Understanding internals helps you:

- **Debug performance issues** - Know why queries are slow
- **Tune configurations** - Make informed decisions about settings
- **Troubleshoot failures** - Understand what went wrong
- **Design better schemas** - Know how your design affects internals
- **Optimize queries** - Understand what the planner sees

:::tip Production Insight
Senior engineers who understand internals can diagnose issues that stump others. When a query is slow, they know whether it's a buffer cache issue, a vacuum problem, or a WAL bottleneck.
:::

## Next Steps

Start with [MVCC Architecture](./mvcc-architecture) - it's the foundation of how PostgreSQL handles concurrency.

