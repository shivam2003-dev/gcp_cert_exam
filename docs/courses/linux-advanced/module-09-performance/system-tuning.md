# System Tuning for High-Load Servers

## Overview

Performance tuning is the art of optimizing Linux systems for specific workloads. This module covers comprehensive tuning strategies for high-load production servers.

## Tuning Philosophy

### Golden Rules

1. **Measure before changing** - Know baseline performance
2. **Change one variable at a time** - Isolate effects
3. **Document every tweak** - Track what changed
4. **Test thoroughly** - Verify improvements
5. **Revert if regression** - Don't be afraid to undo

### Tuning Workflow

```
1. Baseline Measurement
   ↓
2. Identify Bottleneck
   ↓
3. Apply Tuning
   ↓
4. Measure Again
   ↓
5. Compare Results
   ↓
6. Document Changes
```

## CPU & Scheduler Tuning

### Process Limits

```bash
# Increase PID limit
sysctl kernel.pid_max=131072

# Check current limit
cat /proc/sys/kernel/pid_max
```

### Scheduler Tuning

**For Low Latency:**
```bash
# Reduce latency target
sysctl kernel.sched_latency_ns=3000000

# Smaller time slices
sysctl kernel.sched_min_granularity_ns=500000
```

**For High Throughput:**
```bash
# Larger time slices
sysctl kernel.sched_min_granularity_ns=2000000

# Reduce wakeup overhead
sysctl kernel.sched_wakeup_granularity_ns=2000000
```

**For Many Tasks:**
```bash
# Prevent too many context switches
sysctl kernel.sched_min_granularity_ns=1000000
```

### CPU Isolation

```bash
# Isolate CPUs (kernel parameter)
isolcpus=2,3

# Then pin critical tasks
taskset -cp 2,3 <pid>
```

## Memory & Cache Tuning

### Dirty Page Tuning

```bash
# Reduce dirty pages
sysctl vm.dirty_ratio=10
sysctl vm.dirty_background_ratio=5

# Defaults are often too high (40% and 10%)
# Lower values = more frequent writeback
# Better for latency-sensitive workloads
```

### Swappiness

```bash
# Reduce swap usage
sysctl vm.swappiness=10

# For databases (very low)
sysctl vm.swappiness=1

# For desktop (default)
sysctl vm.swappiness=60
```

### Memory Reserves

```bash
# Reserve memory for kernel
sysctl vm.min_free_kbytes=131072

# Calculate: sqrt(total_memory * 16)
# Example: sqrt(16GB * 16) = sqrt(256) = 16MB = 16384 KB
```

### Page Cache Pressure

```bash
# Reduce page cache pressure
sysctl vm.vfs_cache_pressure=50

# Default: 100
# Lower = keep more cache
# Higher = reclaim cache more aggressively
```

## Networking Tuning

### TCP Buffer Sizes

```bash
# Increase socket buffers
sysctl net.core.rmem_max=134217728  # 128MB
sysctl net.core.wmem_max=134217728  # 128MB

# TCP receive buffers
sysctl net.ipv4.tcp_rmem="4096 87380 134217728"
# min default max

# TCP send buffers
sysctl net.ipv4.tcp_wmem="4096 65536 134217728"
```

### TCP Connection Tuning

```bash
# Increase connection backlog
sysctl net.core.somaxconn=65535
sysctl net.ipv4.tcp_max_syn_backlog=65535

# TIME-WAIT reuse
sysctl net.ipv4.tcp_tw_reuse=1

# Reduce TIME-WAIT timeout
sysctl net.ipv4.tcp_fin_timeout=15
# Default: 60 seconds
```

### TCP Congestion Control

```bash
# Check current algorithm
sysctl net.ipv4.tcp_congestion_control

# Available algorithms:
# - cubic (default)
# - reno
# - bbr (Google's BBR)
# - htcp

# Set BBR (if available)
sysctl net.ipv4.tcp_congestion_control=bbr

# Enable BBR (requires kernel 4.9+)
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/bbr.conf
```

### Network Queues

```bash
# Increase receive queue
sysctl net.core.netdev_max_backlog=5000

# Increase connection tracking
sysctl net.netfilter.nf_conntrack_max=262144
```

## Storage Tuning

### I/O Scheduler

```bash
# For NVMe (use none or mq-deadline)
echo none > /sys/block/nvme0n1/queue/scheduler

# For SATA SSD (use mq-deadline or kyber)
echo mq-deadline > /sys/block/sda/queue/scheduler

# For HDD (use bfq or mq-deadline)
echo bfq > /sys/block/sda/queue/scheduler
```

### Read-Ahead

```bash
# Increase read-ahead for sequential workloads
blockdev --setra 2048 /dev/sda
# 2048 * 512 bytes = 1MB

# For random I/O, reduce read-ahead
blockdev --setra 256 /dev/sda
```

### Queue Depth

```bash
# Increase queue depth
echo 1024 > /sys/block/nvme0n1/queue/nr_requests

# For SATA
echo 512 > /sys/block/sda/queue/nr_requests
```

### Filesystem Options

```bash
# Mount options for performance
# /etc/fstab
UUID=... /data ext4 defaults,noatime,nodiratime,barrier=0 0 2

# Options:
# noatime - Don't update access time
# nodiratime - Don't update directory access time
# barrier=0 - Disable write barriers (risky, faster)
```

## Application-Specific Tuning

### Database Servers

```bash
# Memory
sysctl vm.swappiness=1
sysctl vm.dirty_ratio=5
sysctl vm.dirty_background_ratio=2

# Disable THP
echo never > /sys/kernel/mm/transparent_hugepage/enabled

# I/O scheduler
echo deadline > /sys/block/sda/queue/scheduler

# Network
sysctl net.core.somaxconn=65535
sysctl net.ipv4.tcp_max_syn_backlog=65535
```

### Web Servers

```bash
# File descriptors
ulimit -n 65535
# Or in /etc/security/limits.conf
* soft nofile 65535
* hard nofile 65535

# Network
sysctl net.core.somaxconn=65535
sysctl net.ipv4.tcp_tw_reuse=1

# Keepalive
sysctl net.ipv4.tcp_keepalive_time=300
sysctl net.ipv4.tcp_keepalive_probes=5
sysctl net.ipv4.tcp_keepalive_intvl=15
```

### High-Performance Computing

```bash
# CPU isolation
isolcpus=2-15

# Disable CPU frequency scaling
echo performance > /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# NUMA tuning
numactl --membind=0 --cpunodebind=0 <command>
```

## Benchmarking & Validation

### CPU Benchmarking

```bash
# stress-ng
stress-ng --cpu 4 --timeout 60s --metrics-brief

# sysbench
sysbench cpu --threads=4 --time=60 run
```

### Memory Benchmarking

```bash
# Memory bandwidth
sysbench memory --threads=4 --time=60 run

# Latency
lat_mem_rd -P 1 -W 1 -N 1 512M
```

### I/O Benchmarking

```bash
# fio - Random read
fio --name=randread --filename=/dev/sda --rw=randread --bs=4k --ioengine=libaio --iodepth=64 --runtime=60 --time_based

# fio - Sequential write
fio --name=seqwrite --filename=/dev/sda --rw=write --bs=1M --ioengine=libaio --iodepth=32 --runtime=60 --time_based
```

### Network Benchmarking

```bash
# iperf3
iperf3 -s  # Server
iperf3 -c <server> -t 60 -P 4  # Client

# wrk (HTTP)
wrk -t4 -c100 -d30s http://server/
```

### Before/After Comparison

```bash
# Capture baseline
./benchmark.sh > baseline.txt

# Apply tuning
# ... make changes ...

# Capture after
./benchmark.sh > after.txt

# Compare
diff baseline.txt after.txt
```

## Monitoring Tuned Systems

### Key Metrics to Watch

**CPU:**
- Load average
- CPU utilization
- Context switches
- CPU pressure (PSI)

**Memory:**
- Free memory
- Swap usage
- OOM kills
- Memory pressure (PSI)

**I/O:**
- I/O wait
- Throughput
- Latency
- Queue depth

**Network:**
- Throughput
- Latency
- Packet loss
- Connection count

### Alerting

Set up alerts for:
- Load average > CPU count * 2
- Memory usage > 90%
- I/O wait > 50%
- Network errors > 0

## Best Practices

1. **Test in staging first** - Never tune production blindly
2. **Document all changes** - Know what you changed
3. **Monitor continuously** - Watch for regressions
4. **Revert if needed** - Don't be afraid to undo
5. **Benchmark regularly** - Track performance trends

:::warning Production Warning
Tuning can have unexpected side effects. Always test in staging and monitor production closely after applying changes.
:::

## Next Steps

Continue to [Kernel Parameters & sysctl Deep Dive](./kernel-parameters) for detailed parameter explanations.
