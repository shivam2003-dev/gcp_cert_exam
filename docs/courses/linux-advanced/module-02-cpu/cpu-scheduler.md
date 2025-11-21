# CFS Scheduler & CPU Diagnostics

## Completely Fair Scheduler (CFS)

CFS is Linux's default scheduler for normal (non-real-time) processes.

### Design Principles

1. **Fairness**: All tasks get equal CPU time (weighted by priority)
2. **Efficiency**: O(log n) insertion/deletion
3. **Scalability**: Works well with many tasks

### How CFS Works

**Virtual Runtime (vruntime):**
- Each task accumulates vruntime based on CPU usage
- vruntime = actual_runtime / weight
- Tasks with lower vruntime run first

**Red-Black Tree:**
- Tasks ordered by vruntime
- Leftmost node = next to run
- O(log n) operations

### Key Parameters

```bash
# Target latency (time to run all tasks once)
sysctl kernel.sched_latency_ns
# Default: 6000000 (6ms)

# Minimum time slice
sysctl kernel.sched_min_granularity_ns
# Default: 750000 (0.75ms)

# Wakeup granularity
sysctl kernel.sched_wakeup_granularity_ns
# Default: 1000000 (1ms)
```

### Tuning CFS

**For many tasks (100+):**
```bash
sysctl kernel.sched_min_granularity_ns=1000000
```

**For low latency:**
```bash
sysctl kernel.sched_latency_ns=3000000
sysctl kernel.sched_min_granularity_ns=500000
```

## Scheduler Statistics

### /proc/sched_debug

```bash
# Dump scheduler state
cat /proc/sched_debug | head -100

# Per-CPU run queues
grep -A10 "cpu#0" /proc/sched_debug
```

### /proc/schedstat

```bash
# Enable schedstat
sysctl kernel.sched_schedstats=1

# View statistics
cat /proc/schedstat

# Format:
# CPU: running_time, wait_time, timeslices
```

### Per-Process Scheduler Info

```bash
# Scheduler statistics
cat /proc/<pid>/sched

# Key fields:
# se.statistics.nr_switches - Context switches
# se.statistics.wait_sum - Total wait time
# se.vruntime - Virtual runtime
```

## CPU Bottleneck Detection

### Load Average

```bash
uptime
# Shows: 1min, 5min, 15min averages

# Interpretation:
# load < CPU_count: OK
# load = CPU_count: Fully utilized
# load > CPU_count: Overloaded
```

### top / htop

**Key metrics:**
- `%CPU`: CPU usage percentage
- `TIME+`: Total CPU time
- `%MEM`: Memory usage
- `NI`: Nice value
- `PR`: Priority

**Sorting:**
- `P`: By CPU
- `M`: By memory
- `T`: By time

### mpstat

```bash
# All CPUs
mpstat -P ALL 1 5

# Per-CPU breakdown
mpstat -P 0 1 5

# Key metrics:
# %usr - User time
# %sys - System time
# %iowait - I/O wait
# %irq - Interrupt time
# %soft - Softirq time
```

### pidstat

```bash
# CPU usage per process
pidstat 1 5

# Per-thread
pidstat -t 1 5

# With command names
pidstat -u -l 1 5
```

## perf: Performance Analysis

### perf top

```bash
# System-wide hot functions
perf top

# Per-process
perf top -p <pid>

# With call graphs
perf top -g
```

### perf record / report

```bash
# Record for 60 seconds
perf record -a -g sleep 60

# View report
perf report

# With call graphs
perf report -g graph
```

### perf stat

```bash
# Count events
perf stat <command>

# Specific events
perf stat -e cycles,instructions,cache-misses <command>

# Per-CPU
perf stat -a -A <command>
```

## Flame Graphs

### Creating Flame Graphs

```bash
# Record
perf record -F 99 -a -g -- sleep 60

# Generate script
perf script > out.perf

# Fold
stackcollapse-perf.pl out.perf > out.folded

# Generate SVG
flamegraph.pl out.folded > cpu-flame.svg
```

### Reading Flame Graphs

- **Width**: Time spent in function
- **Height**: Call stack depth
- **Color**: Random (for distinction)

## CPU Pressure Monitoring

### PSI (Pressure Stall Information)

```bash
# CPU pressure
cat /proc/pressure/cpu

# Output:
# some avg10=0.00 avg60=0.00 avg300=0.00 total=0
# full avg10=12.05 avg60=5.23 avg300=1.11 total=1234567
```

**Interpretation:**
- `some`: Some tasks waiting for CPU
- `full`: All tasks blocked (CPU starvation)
- `avg10/60/300`: Averages over time windows
- `total`: Total stall time in microseconds

### Monitoring PSI

```bash
# Watch pressure
watch -n1 cat /proc/pressure/cpu

# Alert when full > 10%
# Indicates CPU starvation
```

## CPU Saturation Detection

### Signs of CPU Saturation

1. **Load average > CPU count**
2. **High context switch rate**
3. **PSI full values > 0**
4. **Long run queues** (`/proc/sched_debug`)
5. **High %sys time** (kernel overhead)

### Investigation Steps

```bash
# 1. Check load
uptime

# 2. Identify CPU hogs
top -b -n1 | head -20

# 3. Check scheduler
cat /proc/sched_debug | grep "cfs_rq"

# 4. Profile with perf
perf top -g
```

## Real-Time Scheduling

### SCHED_FIFO

- Highest priority runs until it blocks
- Can starve other tasks
- Use with caution

```bash
# Set FIFO priority 50
chrt -f -p 50 <pid>

# Check
chrt -p <pid>
```

### SCHED_RR

- Round-robin among same priority
- Time slice per task
- More fair than FIFO

```bash
# Set RR priority 50
chrt -r -p 50 <pid>
```

### SCHED_DEADLINE

- Deadline-based scheduling
- For time-critical tasks
- Requires careful configuration

### Real-Time Best Practices

1. **Limit RT tasks** - Use cgroups
2. **Set CPU affinity** - Pin to specific CPUs
3. **Monitor carefully** - RT tasks can starve system
4. **Use watchdog** - Detect runaway RT tasks

## CPU Tuning Strategies

### For High Throughput

```bash
# Increase time slices
sysctl kernel.sched_min_granularity_ns=2000000

# Reduce wakeup overhead
sysctl kernel.sched_wakeup_granularity_ns=2000000
```

### For Low Latency

```bash
# Reduce latency target
sysctl kernel.sched_latency_ns=3000000

# Smaller time slices
sysctl kernel.sched_min_granularity_ns=500000
```

### For Many Tasks

```bash
# Larger minimum granularity
sysctl kernel.sched_min_granularity_ns=1000000

# Prevents too many context switches
```

## Production Scenarios

### Scenario 1: CPU Saturation

**Symptoms:**
- Load average > CPU count
- High %CPU in top
- Slow response times

**Investigation:**
```bash
# Find CPU hogs
top -b -n1 | head -20

# Profile
perf top -g

# Check scheduler
cat /proc/sched_debug | head -50
```

**Fix:**
- Optimize hot functions
- Add more CPUs
- Reduce workload
- Use CPU affinity

### Scenario 2: High System CPU

**Symptoms:**
- High %sys in mpstat
- Low %usr
- System feels slow

**Investigation:**
```bash
# Check interrupts
cat /proc/interrupts | head

# Profile kernel
perf top -k

# Check softirqs
watch -n1 cat /proc/softirqs
```

**Fix:**
- Optimize interrupt handling
- Update drivers
- Reduce system call overhead

### Scenario 3: Context Switch Storm

**Symptoms:**
- Very high `cs` in vmstat
- Poor performance
- High CPU usage

**Investigation:**
```bash
# Monitor switches
vmstat 1

# Per-process switches
pidstat -w 1 5
```

**Fix:**
- Reduce thread count
- Optimize locking
- Use CPU affinity
- Increase time slices

## Best Practices

1. **Monitor load average** - Alert when > CPU count
2. **Profile regularly** - Use perf to find hotspots
3. **Tune scheduler** - Based on workload
4. **Use PSI** - Early warning of CPU pressure
5. **Limit RT tasks** - Prevent starvation

:::tip Production Insight
CPU saturation is often a symptom, not the cause. Profile with perf to find the real bottleneck - it might be I/O, memory, or lock contention.
:::

## Next Steps

Continue to [CPU Troubleshooting Labs](./cpu-troubleshooting) for hands-on troubleshooting scenarios.
