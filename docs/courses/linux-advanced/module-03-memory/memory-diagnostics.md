# Memory Diagnostics & Tooling

## vmstat

```bash
vmstat -SM 1
```

Key columns:
- `si/so`: swap in/out
- `free`: free memory
- `cache`: page cache
- `cs`: context switches

## /proc/meminfo

```bash
cat /proc/meminfo | egrep 'Mem|Swap|Dirty|Anon'
```

Track `MemAvailable`, `Dirty`, `AnonHugePages`, `Slab` growth.

## slabtop

```bash
slabtop -o
```

- Detect slab leaks (e.g., dentry cache runaway)
- Sort by size, obj, cache

## pmap & smem

```bash
# Detailed mapping
pmap -x <pid> | head

# Aggregate per process
smem -r -k
```

## Detecting Memory Leaks

1. Monitor RSS via `pidstat -r`
2. Check cgroup memory stats

```bash
cat /sys/fs/cgroup/<slice>/memory.current
```

3. Use `valgrind`, `memleak` (BCC) for application-level leaks

### BCC memleak

```bash
sudo /usr/share/bcc/tools/memleak -p <pid>
```

## NUMA Diagnostics

```bash
numastat -m
numastat -p <pid>
```

Look for remote hits or imbalance.

## Dirty Page Debugging

```bash
watch -n1 cat /proc/meminfo | egrep 'Dirty|Writeback'

# Force flush
sudo sync
```

## Checklist

- [ ] Track swap usage trends
- [ ] Alert on abnormal slab growth
- [ ] Triage OOM logs immediately
- [ ] Document cgroup memory budgets

Next: [Storage & Filesystem Internals](../module-04-storage/io-stack).
