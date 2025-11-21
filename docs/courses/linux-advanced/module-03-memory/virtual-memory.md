# Virtual Memory Internals

## Virtual vs Physical Memory

- Each process sees contiguous virtual memory (VMAs)
- Kernel maps VMAs to physical frames via page tables
- Page faults resolve missing mappings (minor vs major)

### Inspecting VMAs

```bash
cat /proc/<pid>/maps | head
smem -P "nginx"
```

### Page Table Statistics

```bash
# Page table size
pmap -x <pid> | tail -1

# Huge page mappings
grep -i huge /proc/meminfo
```

## Paging & Swapping

- **Anonymous pages** backed by swap when evicted
- **File-backed pages** can be dropped and reloaded
- Swappiness determines preference for swap vs reclaim

```bash
sysctl vm.swappiness
vmstat 1 5
```

## Transparent Huge Pages (THP)

- 2MB pages reduce TLB misses
- Good for large in-memory workloads, bad for latency-sensitive systems

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled

# Disable temporarily
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
```

## NUMA Basics

- Non-Uniform Memory Access: multiple memory nodes
- Accessing remote node incurs latency

```bash
numactl --hardware
numastat -p <pid>
```

### NUMA Tuning

```bash
# Bind process to NUMA node
numactl --membind=0 --cpunodebind=0 ./app

# Auto NUMA balancing
sysctl kernel.numa_balancing=1
```

## Dirty Pages & Writeback

```bash
# Dirty page thresholds
sysctl vm.dirty_ratio vm.dirty_background_ratio

# Force flush
sync; echo 3 | sudo tee /proc/sys/vm/drop_caches
```

Next: [OOM Killer, Swap & Memory Failures](./oom-swap).
