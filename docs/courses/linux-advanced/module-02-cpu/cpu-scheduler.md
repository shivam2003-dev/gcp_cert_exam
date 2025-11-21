# CFS Scheduler & CPU Diagnostics

## CFS (Completely Fair Scheduler)

- Maintains **red-black tree** per CPU ordered by virtual runtime (`vruntime`)
- Tasks earn vruntime proportional to CPU usage / weight
- Scheduler selects task with smallest vruntime

### Key Parameters

```bash
sysctl kernel.sched_latency_ns            # Target latency
sysctl kernel.sched_min_granularity_ns    # Minimum slice
sysctl kernel.sched_wakeup_granularity_ns
```

Adjust to handle many tasks or reduce latency for interactive workloads.

## Scheduler Diagnostics

```bash
# Dump scheduler debug info
cat /proc/sched_debug | head -40

# Show run queues per CPU
grep -A5 "cpu#0" /proc/sched_debug
```

### schedstat

```bash
# Enable schedstat
sysctl kernel.sched_schedstats=1

# Read stats
cat /proc/schedstat
```

Interpretation:
- `running` time per CPU
- `switches` count
- `avg_idle` durations

## CPU Bottleneck Detection

### top / htop Deep Dive

- Sort by `%CPU`, `TIME+`, `WA%`
- Toggle `H` to view threads
- Inspect load average vs CPU count

### perf top

```bash
perf top -g --sort=dso,symbol
```

- Shows hottest functions across system
- Filter by PID with `-p`

### Flame Graph Workflow

```bash
sudo perf record -F 99 -a -g -- sleep 60
sudo perf script > out.perf
stackcollapse-perf.pl out.perf > out.folded
flamegraph.pl out.folded > cpu-flame.svg
```

## CPU Pressure Monitoring

Use PSI (Pressure Stall Information):

```bash
cat /proc/pressure/cpu

some avg10=0.00 avg60=0.00 avg300=0.00 total=0
full avg10=12.05 avg60=5.23 avg300=1.11 total=1234567
```

- `some`: tasks waiting for CPU
- `full`: tasks stalled entirely due to CPU

## Mitigation Playbook

1. Identify culprit processes (`top`, `pidstat`)
2. Inspect scheduler stats (`/proc/<pid>/sched`)
3. Adjust priorities or CPU quotas (`chrt`, `systemd` properties)
4. Consider CPU isolation or pinning for noisy workloads
5. Tune `sched_latency_ns` for latency-sensitive services

Next: [CPU Troubleshooting Labs](./cpu-troubleshooting).
