# Linux I/O Stack

## Overview

Understanding the Linux I/O stack is crucial for diagnosing storage performance issues. This module covers the complete path from application to hardware.

## I/O Stack Layers

### Complete Stack

```
Application
    ↓
libc (read/write)
    ↓
VFS (Virtual File System)
    ↓
Filesystem (ext4, xfs, etc.)
    ↓
Block Layer
    ↓
I/O Scheduler
    ↓
Device Driver
    ↓
Hardware (Disk, SSD, NVMe)
```

### Layer Responsibilities

**Application Layer:**
- Makes read/write calls
- Uses buffered or direct I/O

**VFS Layer:**
- Provides unified interface
- Handles pathname resolution
- Manages file descriptors

**Filesystem Layer:**
- Organizes data on disk
- Manages metadata
- Handles journaling

**Block Layer:**
- Manages request queues
- Handles I/O scheduling
- Merges adjacent requests

**Device Driver:**
- Communicates with hardware
- Handles interrupts
- Manages DMA

## Block Devices

### Block Device Types

```bash
# List block devices
lsblk

# Detailed info
lsblk -o NAME,TYPE,SIZE,MODEL,ROTA,SCHED

# Device topology
lsblk -t
```

### Device Nodes

```bash
# Block devices in /dev
ls -l /dev/sd* /dev/nvme*

# Major:Minor numbers
ls -l /dev/sda
# brw-rw---- 1 root disk 8, 0 Jan 15 10:00 /dev/sda
# 8 = major number (SCSI disk)
# 0 = minor number (first disk)
```

### Inspecting Block Devices

```bash
# Device info
udevadm info --query=all --name=/dev/sda

# SCSI info
lsscsi

# Disk geometry
fdisk -l /dev/sda
```

## I/O Schedulers

### Available Schedulers

**mq-deadline:**
- Default for NVMe/multiqueue devices
- Deadline-based
- Good for most workloads

**kyber:**
- Low latency
- Good for SSDs
- Adaptive

**bfq:**
- Fair queuing
- Good for desktop
- Interactive workloads

**none:**
- No-op scheduler
- For devices with own scheduling

### Checking Current Scheduler

```bash
# Per-device scheduler
cat /sys/block/sda/queue/scheduler
# [mq-deadline] kyber bfq none

# Change scheduler
echo kyber | sudo tee /sys/block/sda/queue/scheduler
```

### Scheduler Selection Guide

**NVMe SSD:**
- `mq-deadline` or `kyber`

**SATA SSD:**
- `mq-deadline` or `kyber`

**HDD:**
- `bfq` or `mq-deadline`

**Virtual disks:**
- `none` (host handles scheduling)

## Block Layer Internals

### Request Queues

```bash
# Queue depth
cat /sys/block/sda/queue/nr_requests

# Max sectors per request
cat /sys/block/sda/queue/max_sectors_kb

# Physical block size
cat /sys/block/sda/queue/physical_block_size

# Logical block size
cat /sys/block/sda/queue/logical_block_size
```

### Request Merging

The block layer merges adjacent requests:

- **Front merge**: New request before existing
- **Back merge**: New request after existing
- **Plugging**: Batch requests before sending to driver

## Filesystem Cache

### Page Cache

The page cache stores:
- File data (read cache)
- Dirty pages (write cache)
- Metadata

### Cache Behavior

**Read path:**
1. Check page cache
2. If miss, read from disk
3. Store in cache
4. Return to application

**Write path:**
1. Write to page cache (dirty page)
2. Mark as dirty
3. Writeback daemon flushes to disk

### Inspecting Cache

```bash
# Cache size
free -h
# "buff/cache" shows page cache

# Detailed breakdown
cat /proc/meminfo | grep -E "Cached|Buffers|Dirty|Writeback"

# Per-file cache
vmtouch <file>
```

## Direct I/O

### Bypassing Page Cache

```c
// Open with O_DIRECT
int fd = open("/path/to/file", O_RDWR | O_DIRECT);

// Requirements:
// - Buffer must be aligned to block size
// - Size must be multiple of block size
```

### When to Use Direct I/O

- **Databases**: Manage own cache
- **Large sequential I/O**: No benefit from cache
- **Real-time applications**: Predictable latency

### Performance Impact

- **Reads**: Slower (no cache)
- **Writes**: Faster (no writeback delay)
- **CPU**: Higher (no kernel caching)

## Asynchronous I/O (AIO)

### Linux AIO

```c
// io_setup
io_context_t ctx;
io_setup(128, &ctx);

// io_submit
struct iocb iocb;
io_prep_pread(&iocb, fd, buf, size, offset);
io_submit(ctx, 1, &iocb);

// io_getevents
io_getevents(ctx, 1, 1, &event, NULL);
```

### libaio

```bash
# Install
# Ubuntu: apt-get install libaio-dev

# Use in applications
# Link with -laio
```

## Measuring I/O Performance

### iostat

`iostat` is the primary tool for monitoring I/O performance. It shows both device-level and system-wide I/O statistics.

```bash
# Basic usage - extended statistics, update every 1 second, 5 times
iostat -x 1 5
```

:::important Understanding iostat Metrics

**Operations:**
- `r/s`: Read operations per second
- `w/s`: Write operations per second
- `rkB/s`: Read throughput (KB/s)
- `wkB/s`: Write throughput (KB/s)

**Latency:**
- `await`: Average time (ms) for I/O requests to complete (includes queue time)
- `svctm`: Average service time (ms) - actual I/O time (excludes queue time)
- `r_await`: Average read wait time
- `w_await`: Average write wait time

**Utilization:**
- `%util`: Percentage of time device was busy (0-100%)
- `%util = 100%` means device is saturated

**Queue:**
- `avgqu-sz`: Average queue length
- High queue length indicates I/O bottleneck
:::

:::warning Interpreting %util
`%util` can be misleading:
- For SSDs: `%util = 100%` usually means saturation
- For HDDs with many spindles: `%util` can be > 100% (multiple operations in parallel)
- Always check `await` and `svctm` together with `%util`
:::

:::tip Performance Indicators
**Healthy I/O:**
- `await` < `svctm` * 2 (low queue time)
- `%util` < 80% (not saturated)
- `svctm` reasonable for device type (SSD: < 1ms, HDD: < 10ms)

**I/O Problems:**
- `await` >> `svctm` (high queue time, device busy)
- `%util` = 100% (device saturated)
- High `svctm` (slow device or driver issues)
:::

### iotop

```bash
# Per-process I/O
sudo iotop

# Options:
# -a: Accumulated I/O
# -o: Only processes doing I/O
# -d: Delay between updates
```

### blktrace

```bash
# Trace block I/O
sudo blktrace -d /dev/sda -o trace

# Parse trace
blkparse trace | head

# Generate timeline
blkparse -i trace -d trace.bin
btt -i trace.bin
```

## I/O Tuning Parameters

### Queue Depth

```bash
# Increase queue depth
echo 512 > /sys/block/sda/queue/nr_requests

# For NVMe
echo 1024 > /sys/block/nvme0n1/queue/nr_requests
```

### Read-Ahead

```bash
# Check current
blockdev --getra /dev/sda

# Set read-ahead (512KB = 1024 * 512 bytes)
blockdev --setra 1024 /dev/sda
```

### I/O Scheduler Tuning

**mq-deadline:**
```bash
# Read expiration (ms)
echo 100 > /sys/block/sda/queue/iosched/read_expire

# Write expiration (ms)
echo 5000 > /sys/block/sda/queue/iosched/write_expire
```

## Production Scenarios

### Scenario 1: High I/O Wait

**Symptoms:**
- High `%wa` in `top`
- Slow system
- Processes in D state

**Investigation:**
```bash
# Check I/O stats
iostat -x 1 5

# Find I/O hogs
iotop -ao

# Check queue depth
cat /sys/block/sda/queue/nr_requests
```

**Fix:**
- Increase queue depth
- Optimize I/O patterns
- Use faster storage
- Tune scheduler

### Scenario 2: Low Throughput

**Symptoms:**
- Low rkB/s, wkB/s
- High await
- Low %util

**Investigation:**
```bash
# Check I/O size
iostat -x 1 5
# Look for small I/O sizes

# Check alignment
fdisk -l /dev/sda
```

**Fix:**
- Increase I/O size
- Align partitions
- Tune read-ahead
- Use direct I/O for large files

## Best Practices

1. **Monitor I/O metrics** - iostat, iotop regularly
2. **Tune scheduler** - Based on workload
3. **Optimize queue depth** - Match device capabilities
4. **Use appropriate I/O** - Direct vs buffered
5. **Profile I/O patterns** - blktrace for deep analysis

:::tip Production Insight
I/O performance is often the bottleneck. Understanding the I/O stack helps you identify where the problem is and how to fix it.
:::

## Next Steps

Continue to [Filesystems & Journaling](./filesystems) to understand filesystem internals.
