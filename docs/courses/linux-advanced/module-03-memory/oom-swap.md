# OOM Killer, Swap Behavior & Tuning

## Swapping Strategy

- Swap prevents immediate OOM but hurts latency
- Monitor swap-in/out via `vmstat`, `sar`, `free`

```bash
vmstat 1 5
sar -S 1 5
free -h
```

### Tuning Swappiness

```bash
sysctl vm.swappiness=10
cat /proc/sys/vm/swappiness
```

- Lower values prefer reclaim over swap
- For low-latency systems set to 1

## OOM Killer Internals

- Triggered when reclaim fails and no memory available
- Scores processes based on `oom_score_adj`, memory usage, badness heuristic

```bash
# Inspect score
cat /proc/<pid>/oom_score
cat /proc/<pid>/oom_score_adj

# Protect critical service
systemd-run --scope -p OOMScoreAdjust=-900 <command>
```

### OOM Logs

```bash
journalctl -k -g "Out of memory"
```

Sample entry:
```
Out of memory: Killed process 1234 (java) total-vm:8G anon-rss:6G
```

## OOM Incident Workflow

1. Capture `dmesg` or `journalctl -k`
2. Identify OOM victim and triggering allocation
3. Check memory graphs around incident
4. Examine per-cgroup memory limits

```bash
systemd-cgls --memory
cat /sys/fs/cgroup/<slice>/memory.max
```

## Preventing OOM Cascades

- Set realistic memory limits via cgroups
- Use `MemoryMax` and `MemoryHigh` for services

```bash
systemctl set-property api.service MemoryMax=4G MemorySwapMax=1G
```

- Reserve memory for kernel via `vm.min_free_kbytes`
- Protect critical daemons with `OOMScoreAdjust`

Next: [Memory Diagnostics & Tooling](./memory-diagnostics).
