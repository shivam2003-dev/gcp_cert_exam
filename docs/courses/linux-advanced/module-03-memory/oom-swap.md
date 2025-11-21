# OOM Killer, Swap Behavior & Tuning

## Swapping Strategy

### When Does Swapping Occur?

Swapping happens when:
1. Free memory drops below threshold
2. Kernel needs to free memory
3. No clean pages available to evict

### Swappiness

**swappiness** controls preference for swap vs page cache eviction:

- Range: 0-100
- Default: 60
- Lower = prefer reclaim over swap
- Higher = prefer swap over reclaim

```bash
# Check current value
cat /proc/sys/vm/swappiness

# Set swappiness
sysctl vm.swappiness=10

# Make persistent
echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
```

### Tuning Guidelines

**For databases (low latency):**
```bash
sysctl vm.swappiness=1
```

**For desktop systems:**
```bash
sysctl vm.swappiness=60  # Default
```

**For servers with lots of RAM:**
```bash
sysctl vm.swappiness=10
```

### Monitoring Swap

```bash
# Swap usage
free -h
swapon --show

# Swap activity
vmstat 1 5
# si = swap in (pages/sec)
# so = swap out (pages/sec)

# Per-process swap
for pid in $(pgrep <process>); do
  echo "PID $pid: $(grep VmSwap /proc/$pid/status)"
done
```

## OOM Killer Internals

### When OOM Killer Triggers

The OOM killer activates when:
1. System runs out of memory
2. Kernel cannot free memory
3. No swap available or swap full
4. All allocation attempts fail

### OOM Scoring

The kernel scores processes based on:

1. **Memory usage** - RSS, swap usage
2. **oom_score_adj** - Adjustment factor (-1000 to 1000)
3. **Process age** - Longer-running processes favored
4. **Root processes** - Slightly penalized
5. **Badness heuristic** - Complex calculation

### Inspecting OOM Scores

```bash
# Current score
cat /proc/<pid>/oom_score

# Adjustment
cat /proc/<pid>/oom_score_adj

# Score limit (if set)
cat /proc/<pid>/oom_score_adj
```

### Protecting Processes

```bash
# Make process less likely to be killed
echo -900 > /proc/<pid>/oom_score_adj

# Via systemd
systemctl edit myservice.service
[Service]
OOMScoreAdjust=-900
```

### OOM Killer Logs

```bash
# Kernel messages
journalctl -k -g "Out of memory"

# dmesg
dmesg | grep -i "out of memory"

# Typical log entry:
# Out of memory: Killed process 1234 (java) total-vm:8388608kB anon-rss:6291456kB file-rss:0kB shmem-rss:0kB
```

## OOM Killer Behavior

### Selection Process

1. Calculate oom_score for all processes
2. Select process with highest score
3. Send SIGKILL (cannot be caught)
4. Free memory from killed process
5. Retry allocation

### OOM Killer Modes

```bash
# Check mode
cat /proc/sys/vm/oom_kill_allocating_task
# 0 = kill highest-scoring process
# 1 = kill allocating task (if possible)

# Panic on OOM
cat /proc/sys/vm/panic_on_oom
# 0 = use OOM killer
# 1 = panic instead
```

## Swap Configuration

### Creating Swap

```bash
# Create swap file
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make persistent
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Swap Types

1. **Swap partition** - Dedicated partition
2. **Swap file** - File on filesystem
3. **ZRAM** - Compressed RAM (embedded systems)

### Swap Sizing Guidelines

- **Minimum**: Equal to RAM (for hibernation)
- **Recommended**: 1-2x RAM for servers
- **Maximum**: 4x RAM (diminishing returns)

## Memory Pressure Indicators

### PSI (Pressure Stall Information)

```bash
# Memory pressure
cat /proc/pressure/memory

# Output:
# some avg10=0.00 avg60=0.00 avg300=0.00 total=0
# full avg10=5.23 avg60=2.11 avg300=0.89 total=1234567
```

**Interpretation:**
- `some`: Some tasks waiting for memory
- `full`: All tasks blocked (severe pressure)
- `avg10/60/300`: Averages over time windows
- `total`: Total stall time (microseconds)

### Monitoring PSI

```bash
# Watch pressure
watch -n1 'cat /proc/pressure/memory'

# Alert thresholds:
# some avg10 > 10%: Warning
# full avg10 > 5%: Critical
```

## OOM Incident Workflow

### Step 1: Identify Victim

```bash
# Check OOM logs
journalctl -k -g "Out of memory" | tail -20

# Extract PID and process name
# Example: "Killed process 1234 (java)"
```

### Step 2: Analyze Memory Usage

```bash
# Check system memory at time of OOM
# Review monitoring graphs

# Check cgroup limits
cat /sys/fs/cgroup/<slice>/memory.events
# Look for oom_kill events
```

### Step 3: Root Cause

**Common causes:**
1. Memory leak in application
2. Too many processes
3. Insufficient memory limits
4. Memory fragmentation
5. Swap disabled or full

### Step 4: Immediate Fix

```bash
# If process still running, kill it
kill -9 <pid>

# Free memory
sync
echo 3 > /proc/sys/vm/drop_caches

# Check if system recovers
free -h
```

### Step 5: Long-term Fix

- Fix memory leaks
- Increase memory limits
- Add more RAM
- Enable/expand swap
- Optimize application memory usage

## Preventing OOM

### Application Level

```c
// Check available memory before allocation
long available = sysconf(_SC_AV_PHYS_PAGES) * sysconf(_SC_PAGESIZE);
if (needed > available * 0.8) {
    // Handle gracefully
}
```

### System Level

```bash
# Set memory limits via cgroups
echo "4G" > /sys/fs/cgroup/memory.max

# Via systemd
systemctl set-property myservice.service MemoryMax=4G MemorySwapMax=1G
```

### Monitoring

```bash
# Alert on memory pressure
# PSI some > 10%
# PSI full > 5%
# Swap usage > 80%
# OOM kills > 0
```

## Swap Performance

### Swap on SSD vs HDD

- **SSD**: Acceptable performance, ~100x slower than RAM
- **HDD**: Very slow, ~1000x slower than RAM

### Reducing Swap Usage

1. **Increase RAM** - Most effective
2. **Optimize applications** - Reduce memory footprint
3. **Tune swappiness** - Lower value
4. **Use zswap** - Compressed swap in RAM

### zswap

zswap compresses pages before swapping:

```bash
# Enable zswap
modprobe zswap
echo Y > /sys/module/zswap/parameters/enabled

# Check status
cat /sys/module/zswap/parameters/enabled
```

## Best Practices

1. **Monitor PSI** - Early warning of memory pressure
2. **Set memory limits** - Prevent runaway processes
3. **Protect critical services** - Use OOMScoreAdjust
4. **Tune swappiness** - Based on workload
5. **Size swap appropriately** - Not too small, not too large

:::warning Production Warning
OOM kills are disruptive. Always set memory limits and monitor memory pressure. PSI provides early warning before OOM.
:::

## Next Steps

Continue to [Memory Diagnostics & Tooling](./memory-diagnostics) to learn memory monitoring tools.
