# System Tuning for High-Load Servers

## Tuning Philosophy

1. Measure before changing
2. Change one variable at a time
3. Document every tweak
4. Revert if regression occurs

## CPU & Scheduler

```bash
# Increase number of PID hash buckets
sysctl kernel.pid_max=131072

# Favor latency
sysctl kernel.sched_min_granularity_ns=750000
```

## Memory & Cache

```bash
sysctl vm.dirty_ratio=10
sysctl vm.dirty_background_ratio=5
sysctl vm.min_free_kbytes=131072
```

## Networking

```bash
sysctl net.core.rmem_max=134217728
sysctl net.core.wmem_max=134217728
sysctl net.ipv4.tcp_rmem="4096 87380 134217728"
sysctl net.ipv4.tcp_wmem="4096 65536 134217728"
```

## Storage

```bash
sysctl vm.vfs_cache_pressure=50
blockdev --setra 512 /dev/nvme0n1
```

## Benchmark & Validate

- Use `stress-ng`, `fio`, `wrk`, `iperf`
- Capture before/after metrics

Next: [Kernel Parameters & sysctl Deep Dive](./kernel-parameters).
