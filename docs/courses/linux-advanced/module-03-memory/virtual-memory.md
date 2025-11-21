# Virtual Memory Internals

## Overview

Linux uses virtual memory to provide each process with its own address space, enable memory protection, and allow efficient use of physical RAM through paging and swapping.

## Virtual vs Physical Memory

### Virtual Address Space

Each process sees a **contiguous virtual address space** (typically 0 to 2^48 on x86_64):

```
Virtual Address Space (per process)
├── Text (code)
├── Data (initialized variables)
├── BSS (uninitialized variables)
├── Heap (dynamic allocation)
├── Stack
└── Memory Mapped Files
```

### Physical Memory

Physical RAM is divided into **pages** (typically 4KB):

```
Physical Memory
├── Page 0
├── Page 1
├── Page 2
└── ...
```

### Address Translation

**Page Tables** map virtual pages to physical frames:

```
Virtual Address → Page Table → Physical Address
```

**Translation Lookaside Buffer (TLB)** caches recent translations for speed.

### Inspecting Virtual Memory

```bash
# Process memory map
cat /proc/<pid>/maps

# Detailed mapping
pmap -x <pid>

# Memory segments
cat /proc/<pid>/smaps
```

## Memory Management Unit (MMU)

The MMU handles:
- Address translation
- Page table walks
- TLB management
- Page fault handling

### Page Faults

**Types:**
1. **Minor fault** - Page in memory but not in page table (COW, shared libraries)
2. **Major fault** - Page not in memory, must read from disk
3. **Protection fault** - Invalid access (segmentation fault)

```bash
# Page fault statistics
cat /proc/<pid>/stat | awk '{print $12, $13}'
# Field 12: minor faults
# Field 13: major faults
```

## Paging and Swapping

### Paging

**Paging** moves pages between RAM and swap:

- **Page out**: Move page from RAM to swap
- **Page in**: Move page from swap to RAM

### Swapping

**Swapping** moves entire processes to swap (rarely used in modern Linux).

### Page Types

**Anonymous pages:**
- Heap, stack
- Must be swapped if evicted
- Backed by swap space

**File-backed pages:**
- Memory-mapped files
- Can be dropped and reloaded from file
- No swap needed

### Inspecting Swap Usage

```bash
# Swap usage
free -h
swapon --show

# Swap activity
vmstat 1 5
# si = swap in, so = swap out

# Per-process swap
cat /proc/<pid>/status | grep VmSwap
```

## Page Cache

The **page cache** stores recently accessed file data:

- **Read cache**: File data read from disk
- **Write cache**: Dirty pages waiting to be written

### Benefits

- Faster file access (no disk I/O)
- Shared between processes
- Automatically managed

### Inspecting Page Cache

```bash
# Cache size
free -h
# "buff/cache" shows page cache

# Detailed breakdown
cat /proc/meminfo | grep -E "Cached|Buffers|Dirty"

# Drop cache (testing only!)
sync
echo 3 > /proc/sys/vm/drop_caches
```

## Transparent Huge Pages (THP)

### What are Huge Pages?

Normal pages: 4KB
Huge pages: 2MB or 1GB (x86_64)

### Benefits

- Fewer TLB misses
- Better for large memory workloads
- Reduced page table overhead

### Drawbacks

- Memory fragmentation
- Latency spikes during allocation
- Not suitable for all workloads

### Configuration

```bash
# Check THP status
cat /sys/kernel/mm/transparent_hugepage/enabled
# [always] madvise [never]

# Disable THP
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled

# Make persistent
echo 'never' > /etc/sysctl.d/99-thp.conf
```

### When to Disable THP

- Latency-sensitive applications (databases)
- Applications with memory fragmentation issues
- When monitoring shows THP-related latency

## Huge Pages (Explicit)

### Configuration

```bash
# Check huge page size
grep Hugepagesize /proc/meminfo

# Allocate huge pages
echo 1024 > /proc/sys/vm/nr_hugepages

# Mount huge pages
mount -t hugetlbfs none /mnt/hugepages
```

### Application Usage

```c
// Allocate huge page
void *ptr = mmap(NULL, size, PROT_READ|PROT_WRITE,
                 MAP_PRIVATE|MAP_HUGETLB, -1, 0);
```

## NUMA (Non-Uniform Memory Access)

### What is NUMA?

Multi-socket systems have **local** and **remote** memory:

- **Local memory**: Same socket, fast access
- **Remote memory**: Different socket, slower access

### NUMA Topology

```bash
# View NUMA topology
numactl --hardware

# Output:
# available: 2 nodes (0-1)
# node 0 cpus: 0 1 2 3
# node 0 size: 16384 MB
# node 0 free: 12000 MB
# node 1 cpus: 4 5 6 7
# node 1 size: 16384 MB
# node 1 free: 15000 MB
```

### NUMA Statistics

```bash
# System-wide
numastat

# Per-process
numastat -p <pid>

# Per-node
numastat -m
```

### NUMA Policies

```bash
# Bind to node 0
numactl --membind=0 <command>

# Prefer node 0
numactl --preferred=0 <command>

# Interleave across nodes
numactl --interleave=all <command>
```

### NUMA Tuning

```bash
# Enable automatic NUMA balancing
sysctl kernel.numa_balancing=1

# Disable for latency-sensitive apps
numactl --membind=0 --cpunodebind=0 <command>
```

## Memory Mapping

### mmap() System Call

```c
void *mmap(void *addr, size_t length, int prot, int flags,
           int fd, off_t offset);
```

**Uses:**
- File mapping
- Anonymous memory
- Shared memory
- Device memory

### Inspecting Mappings

```bash
# Memory maps
cat /proc/<pid>/maps

# Detailed info
cat /proc/<pid>/smaps

# Summary
pmap -x <pid>
```

## Copy-on-Write (COW)

### How COW Works

1. Parent and child initially share physical pages
2. Pages marked read-only
3. On write, page fault occurs
4. Kernel creates copy
5. Process continues with own copy

### Benefits

- Fast fork() - No immediate copying
- Memory efficient - Shared pages until modified

### Monitoring COW

```bash
# COW pages
cat /proc/<pid>/smaps | grep -i cow

# Page faults (indicator of COW)
cat /proc/<pid>/stat | awk '{print $12}'
```

## Memory Overcommit

Linux allows **overcommitting** memory:

- Allocate more virtual memory than physical RAM
- Assumes not all memory will be used
- OOM killer handles when memory exhausted

### Overcommit Modes

```bash
# Check mode
cat /proc/sys/vm/overcommit_memory
# 0 = heuristic (default)
# 1 = always overcommit
# 2 = never overcommit

# Overcommit ratio
cat /proc/sys/vm/overcommit_ratio
# Default: 50 (allow 50% more than RAM + swap)
```

### When to Change

- **Mode 2**: For databases, prevent OOM surprises
- **Mode 1**: For workloads that know their limits

## Best Practices

1. **Monitor page faults** - High major faults indicate swapping
2. **Disable THP** - For latency-sensitive applications
3. **Use NUMA awareness** - Bind processes to local memory
4. **Understand COW** - Helps optimize fork-heavy applications
5. **Tune overcommit** - Based on workload characteristics

:::tip Production Insight
Virtual memory is the foundation of process isolation. Understanding it helps you debug memory issues, optimize performance, and prevent OOM kills.
:::

## Next Steps

Continue to [OOM Killer, Swap Behavior & Tuning](./oom-swap) to understand memory pressure and the OOM killer.
