# CPU Troubleshooting Labs

## Scenario 1: Runaway Process Saturating CPU

### Symptoms

- Load average spikes to 8.0 on 4-core system
- Single process showing >300% CPU in `top`
- System becomes unresponsive
- Other processes starved

### Investigation Steps

**Step 1: Identify the Offender**

```bash
# Quick identification
top -b -n1 | head -20

# More detailed
pidstat -u 1 5

# Per-thread breakdown
ps -Lp <pid> -o pid,tid,pcpu,comm
```

**Step 2: Understand What It's Doing**

```bash
# System calls
strace -c -p <pid>

# Function calls
perf top -p <pid>

# Full profile
perf record -g -p <pid> sleep 10
perf report
```

**Step 3: Check Process Details**

```bash
# Priority and scheduling
chrt -p <pid>
ps -o pid,ni,pri,rtprio,stat,comm -p <pid>

# CPU affinity
taskset -cp <pid>

# Resource limits
cat /proc/<pid>/limits
```

### Root Cause Analysis

**Common Causes:**
1. **Infinite loop** - Bug in application code
2. **Busy waiting** - Polling instead of blocking
3. **Lock contention** - Spinning on locks
4. **Compilation** - Heavy build process
5. **Cryptographic operations** - CPU-intensive crypto

### Solution

**Immediate Fix:**
```bash
# Throttle with cpulimit
cpulimit -l 50 -p <pid>

# Or use systemd
systemd-run --scope -p CPUQuota=50% <command>

# Kill if necessary
kill -TERM <pid>  # Graceful
kill -KILL <pid>  # Force kill
```

**Long-term Fix:**
- Fix application bug
- Optimize algorithm
- Add rate limiting
- Use async I/O instead of polling

### Prevention

- Set CPU quotas via cgroups
- Monitor CPU usage per process
- Implement circuit breakers
- Use resource limits

## Scenario 2: High System CPU (sys%)

### Symptoms

- `mpstat` shows %sys > 40%
- User CPU low despite high load
- System feels slow
- Interrupt storms possible

### Investigation Steps

**Step 1: Check Interrupts**

```bash
# Interrupt distribution
cat /proc/interrupts | head -20

# Per-CPU interrupts
watch -n1 'cat /proc/interrupts | head'

# Soft interrupts
watch -n1 'cat /proc/softirqs'
```

**Step 2: Profile Kernel**

```bash
# Kernel functions
perf top -k

# System calls
perf top -e syscalls:sys_enter_*

# Interrupt handlers
perf top -e irq:irq_handler_entry
```

**Step 3: Check Network/Storage**

```bash
# Network interrupts
cat /proc/interrupts | grep -i eth

# Storage interrupts
cat /proc/interrupts | grep -i sata

# IRQ affinity
cat /proc/irq/<irq_num>/smp_affinity
```

### Root Cause Analysis

**Common Causes:**
1. **Network interrupt storms** - High packet rate
2. **Storage I/O** - Many small I/O operations
3. **Kernel bugs** - Infinite loops in kernel
4. **Driver issues** - Faulty device drivers
5. **Softirq backlog** - Network/block softirqs

### Solution

**Immediate Fix:**
```bash
# Balance interrupts
systemctl start irqbalance

# Or manually set affinity
echo 3 > /proc/irq/<irq_num>/smp_affinity  # CPUs 0,1

# Update drivers
# Check for kernel updates
```

**Long-term Fix:**
- Update NIC drivers/firmware
- Tune network stack
- Use interrupt coalescing
- Update kernel

### Prevention

- Monitor interrupt rates
- Keep drivers updated
- Use irqbalance
- Tune network/block subsystems

## Scenario 3: CPU Starvation in Contention

### Symptoms

- PSI shows `full` values > 0
- Latency-sensitive services miss deadlines
- High context switch rate
- Load average high but CPU idle

### Investigation Steps

**Step 1: Check PSI**

```bash
# CPU pressure
cat /proc/pressure/cpu

# Monitor over time
watch -n1 'cat /proc/pressure/cpu'
```

**Step 2: Check Scheduler**

```bash
# Run queue length
cat /proc/sched_debug | grep "cfs_rq"

# Context switches
vmstat 1 5

# Per-process switches
pidstat -w 1 5
```

**Step 3: Check Priorities**

```bash
# Real-time tasks
ps -eo pid,rtprio,ni,comm | awk '$2 != "-" || $3 < 0'

# CPU weights
systemd-cgls --cpu
```

### Root Cause Analysis

**Common Causes:**
1. **Too many tasks** - More tasks than CPUs
2. **Real-time tasks** - Starving normal tasks
3. **Lock contention** - Processes waiting on locks
4. **I/O wait** - Processes blocked on I/O

### Solution

**Immediate Fix:**
```bash
# Increase CPU weight for critical service
systemctl set-property critical.service CPUWeight=1000

# Isolate CPUs
# Add to kernel cmdline: isolcpus=2,3
# Then pin critical tasks: taskset -cp 2,3 <pid>
```

**Long-term Fix:**
- Add more CPUs
- Reduce task count
- Optimize locking
- Fix I/O bottlenecks

### Prevention

- Monitor PSI continuously
- Set CPU quotas
- Limit RT tasks
- Use CPU isolation for critical workloads

## Scenario 4: Context Switch Storm

### Symptoms

- Very high `cs` in vmstat (>100k/sec)
- Poor performance despite low CPU usage
- High scheduler overhead

### Investigation Steps

```bash
# Monitor switches
vmstat 1

# Per-process
pidstat -w 1 5

# Scheduler overhead
perf stat -e context-switches,cpu-migrations <command>
```

### Root Cause

- Too many threads
- Excessive locking
- Frequent wakeups
- CPU migration

### Solution

- Reduce thread count
- Optimize locking (lock-free algorithms)
- Increase time slices
- Use CPU affinity

## Diagnostic Command Reference

### Quick CPU Health Check

```bash
#!/bin/bash
echo "=== CPU Health Check ==="
echo "Load Average:"
uptime
echo ""
echo "CPU Usage:"
mpstat -P ALL 1 3
echo ""
echo "Top Processes:"
top -b -n1 | head -15
echo ""
echo "Context Switches:"
vmstat 1 3 | tail -1
echo ""
echo "CPU Pressure:"
cat /proc/pressure/cpu
```

### Advanced Profiling

```bash
# Full system profile
perf record -a -g sleep 60
perf report -g graph

# Specific process
perf record -g -p <pid> sleep 30
perf report

# Flame graph
perf script | stackcollapse-perf.pl | flamegraph.pl > cpu.svg
```

## Best Practices

1. **Monitor continuously** - Catch issues early
2. **Profile before optimizing** - Know the bottleneck
3. **Use PSI** - Early warning system
4. **Set quotas** - Prevent runaway processes
5. **Document baselines** - Know normal behavior

:::tip Production Insight
CPU issues are often symptoms of other problems (I/O, memory, locks). Always profile to find the root cause before optimizing.
:::

## Next Steps

You've completed Module 2! Move to [Module 3: Memory Management & Tuning](../module-03-memory/virtual-memory).
