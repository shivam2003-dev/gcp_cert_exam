# Memory Diagnostics & Tooling

## vmstat

### Basic Usage

```bash
# Update every 1 second, 5 times
vmstat 1 5

# With units
vmstat -SM 1 5
```

### Key Columns

Understanding vmstat output is essential for memory and system health monitoring. Each column tells you something important about system state.

| Column | Description | What It Means |
|--------|-------------|---------------|
| `r` | Runnable processes | Processes ready to run but waiting for CPU. High = CPU saturation |
| `b` | Blocked processes | Processes in uninterruptible sleep (usually I/O). High = I/O bottleneck |
| `swpd` | Swap used (KB) | Total swap space in use. > 0 = memory pressure |
| `free` | Free memory (KB) | Completely unused memory. Low = memory pressure |
| `buff` | Buffer cache (KB) | Block device buffers (legacy, usually small) |
| `cache` | Page cache (KB) | File data cache. Can be reclaimed if needed |
| `si` | Swap in (KB/s) | Pages being read from swap. > 0 = active swapping (bad!) |
| `so` | Swap out (KB/s) | Pages being written to swap. > 0 = memory pressure |
| `cs` | Context switches/sec | How often CPU switches between processes. High = many processes |
| `us` | User CPU % | Time spent in user space. High = application CPU usage |
| `sy` | System CPU % | Time spent in kernel. High = kernel overhead (syscalls, interrupts) |
| `id` | Idle CPU % | CPU doing nothing. Low = CPU busy |
| `wa` | I/O wait % | CPU waiting for I/O. High = I/O bottleneck |

:::important Interpreting vmstat Output
**Healthy system:**
- `free` > 10% of total RAM
- `si` and `so` = 0 (no swapping)
- `cache` growing (page cache working)
- `wa` < 10% (not I/O bound)

**Memory pressure:**
- `free` approaching 0
- `si` > 0 (swapping in - processes waiting for memory)
- `so` > 0 (swapping out - kernel freeing memory)
- `cache` shrinking (kernel reclaiming cache)

**I/O problems:**
- `b` > 0 (processes blocked on I/O)
- `wa` > 20% (high I/O wait)
- `si`/`so` might be high (swapping is I/O)
:::

:::warning Swap Activity
If you see `si` or `so` > 0, you have a memory problem:
- `si > 0`: Pages being swapped in (processes were swapped out, now need memory)
- `so > 0`: Pages being swapped out (kernel is freeing memory)

Sustained swap activity (both > 0) indicates severe memory pressure. The system is "thrashing" - spending more time swapping than working. This requires immediate attention.
:::

### Interpreting Output

**Healthy system:**
- `free` > 10% of total RAM
- `si` and `so` = 0 (no swapping)
- `cache` growing (page cache working)

**Memory pressure:**
- `free` approaching 0
- `si` > 0 (swapping in)
- `so` > 0 (swapping out)
- `cache` shrinking

## /proc/meminfo

### Key Metrics

```bash
# All memory info
cat /proc/meminfo

# Important fields:
# MemTotal - Total RAM
# MemFree - Free RAM
# MemAvailable - Available for new processes
# Buffers - Buffer cache
# Cached - Page cache
# SwapTotal - Total swap
# SwapFree - Free swap
# Dirty - Dirty pages waiting writeback
# Writeback - Pages being written
# AnonPages - Anonymous pages
# Mapped - File-backed pages
# Slab - Kernel slab cache
```

### Monitoring Script

```bash
#!/bin/bash
watch -n1 'cat /proc/meminfo | grep -E "MemTotal|MemFree|MemAvailable|SwapTotal|SwapFree|Dirty|Writeback"'
```

## free Command

### Basic Usage

```bash
# Human-readable
free -h

# Continuous monitoring
free -h -s 1

# Total (including buffers/cache)
free -h -t
```

### Understanding Output

```
              total        used        free      shared  buff/cache   available
Mem:           16Gi       8.5Gi       2.1Gi       512Mi       5.4Gi       7.2Gi
Swap:         2.0Gi       512Mi       1.5Gi
```

**Key points:**
- `used` = applications + buffers/cache
- `free` = completely unused
- `available` = free + reclaimable cache
- `buff/cache` = buffers + page cache

## slabtop

### Purpose

Monitors kernel slab allocator (object cache):

```bash
# Interactive mode
slabtop

# One-shot, sorted by size
slabtop -o

# Sort by objects
slabtop -o -s o
```

### Key Metrics

- **OBJS**: Number of objects
- **ALLOC**: Allocated objects
- **OBJ/SIZE**: Object size
- **CACHE SIZE**: Total cache size
- **SLAB**: Number of slabs

### Common Slabs

- `dentry` - Directory entry cache
- `inode_cache` - Inode cache
- `buffer_head` - Buffer heads
- `kmalloc-*` - General allocations

### Detecting Slab Leaks

```bash
# Monitor over time
watch -n5 'slabtop -o -s c | head -20'

# Look for:
# - Growing OBJS count
# - High CACHE SIZE
# - Specific slab growing
```

## pmap

### Process Memory Map

```bash
# Basic map
pmap <pid>

# Extended format
pmap -x <pid>

# Show device mappings
pmap -d <pid>
```

### Understanding Output

```
Address           Kbytes     RSS   Dirty Mode  Mapping
0000000000400000     132     132       0 r-x-- program
0000000000621000       4       4       4 rw--- program
00007f8b5c000000   132096       0       0 rw-s- [ anon ]
00007f8b64000000   262144  262144  262144 rw--- [ heap ]
```

**Columns:**
- `Address`: Virtual address
- `Kbytes`: Size
- `RSS`: Resident Set Size (in RAM)
- `Dirty`: Dirty pages
- `Mode`: Permissions
- `Mapping`: What it maps to

## smem

### Memory Usage by Process

```bash
# Install
# Ubuntu: apt-get install smem
# Or: pip install smem

# Summary
smem

# Per-user
smem -u

# Per-process
smem -P <process>

# With percentages
smem -p
```

### Memory Metrics

- **USS**: Unique Set Size (process-only)
- **PSS**: Proportional Set Size (shared divided)
- **RSS**: Resident Set Size (total in RAM)

## Detecting Memory Leaks

### Application-Level Leaks

**Tools:**
- `valgrind` - Detects leaks in C/C++
- `AddressSanitizer` - Compile-time leak detection
- `memleak` (BCC) - Kernel-level leak detection

### System-Level Leaks

**Slab leaks:**
```bash
# Monitor slab growth
watch -n10 'slabtop -o -s c | head -20'
```

**Process leaks:**
```bash
# Monitor RSS growth
pidstat -r 1 60 | grep <process>

# Check for steady growth
```

### BCC memleak

```bash
# Install BCC tools
# Ubuntu: apt-get install bpfcc-tools

# Monitor leaks
sudo /usr/share/bcc/tools/memleak -p <pid>

# System-wide
sudo /usr/share/bcc/tools/memleak
```

## NUMA Diagnostics

### numastat

```bash
# System-wide
numastat

# Per-process
numastat -p <pid>

# Per-node
numastat -m
```

### Interpreting Output

```
                    Node 0   Node 1
Numa_Hit             12345    23456
Numa_Miss              123      456
Numa_Foreign           456      123
Interleave_Hit          12       34
Local_Node           12000    23000
Other_Node              345      456
```

**Key metrics:**
- `Numa_Hit`: Local memory access
- `Numa_Miss`: Remote memory access
- `Local_Node`: Memory allocated locally
- `Other_Node`: Memory allocated remotely

### NUMA Balancing

```bash
# Check if enabled
cat /proc/sys/kernel/numa_balancing

# Enable
sysctl kernel.numa_balancing=1

# Monitor balancing
cat /proc/vmstat | grep numa
```

## Dirty Page Monitoring

### Current State

```bash
# Dirty pages
cat /proc/meminfo | grep Dirty

# Writeback in progress
cat /proc/meminfo | grep Writeback

# Watch dirty pages
watch -n1 'cat /proc/meminfo | grep -E "Dirty|Writeback"'
```

### Tuning Dirty Pages

```bash
# Thresholds
sysctl vm.dirty_ratio          # % of RAM before blocking writes
sysctl vm.dirty_background_ratio  # % of RAM before background writeback

# Expiration
sysctl vm.dirty_expire_centisecs  # Age before writeback
sysctl vm.dirty_writeback_centisecs  # Writeback interval
```

### Force Writeback

```bash
# Sync all dirty pages
sync

# Drop caches (testing only!)
echo 3 > /proc/sys/vm/drop_caches
```

## Memory Pressure Scenarios

### Scenario 1: High Swap Usage

**Investigation:**
```bash
# Check swap usage
free -h
swapon --show

# Find processes using swap
for pid in $(pgrep -f <pattern>); do
  swap=$(grep VmSwap /proc/$pid/status 2>/dev/null | awk '{print $2}')
  [ -n "$swap" ] && echo "PID $pid: $swap"
done
```

**Fix:**
- Increase RAM
- Optimize applications
- Reduce swappiness

### Scenario 2: Slab Leak

**Investigation:**
```bash
# Monitor slab growth
slabtop -o -s c

# Identify growing slab
# Check if it's expected (e.g., dentry cache)
```

**Fix:**
- Fix kernel bug (update kernel)
- Work around (periodic cache clearing)
- Report to kernel developers

### Scenario 3: Memory Fragmentation

**Symptoms:**
- Plenty of free memory but allocations fail
- High `si` in vmstat despite free memory

**Investigation:**
```bash
# Check fragmentation
cat /proc/buddyinfo

# Check zone info
cat /proc/zoneinfo | grep -E "Node|free|frag"
```

**Fix:**
- Use huge pages
- Restart processes periodically
- Tune page allocator

## Best Practices

1. **Monitor continuously** - Use vmstat, PSI
2. **Set baselines** - Know normal memory usage
3. **Alert on pressure** - PSI, swap usage
4. **Profile leaks** - Use valgrind, memleak
5. **Document limits** - Memory budgets per service

:::tip Production Insight
Memory diagnostics is about understanding where memory is used. Combine multiple tools (vmstat, /proc/meminfo, pmap) for complete picture.
:::

## Next Steps

You've completed Module 3! Move to [Module 4: Storage & Filesystem Internals](../module-04-storage/io-stack).
