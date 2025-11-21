# Failure Scenario: OOM Kill Storm

## Overview

OOM (Out of Memory) kill storms occur when the system repeatedly runs out of memory, causing the OOM killer to terminate multiple processes in quick succession. This is a critical failure scenario requiring immediate attention.

## Symptoms

### Observable Symptoms

- **Multiple services killed** - Within minutes
- **Sawtooth memory pattern** - Memory usage spikes then drops
- **Repeated OOM messages** - In kernel logs
- **Application errors** - "Cannot allocate memory"
- **System instability** - Services restarting

### Memory Pattern

```
Memory Usage Over Time:
     |     /\
     |    /  \    /\
     |   /    \  /  \
     |  /      \/    \
     | /              \
     |/________________\___
     0  5  10 15 20 25 30 min
     (Sawtooth pattern)
```

## Investigation Steps

### Step 1: Review OOM Logs

```bash
# Kernel OOM messages
journalctl -k -g "Out of memory"

# Previous boot OOM messages
journalctl -k -b -1 | grep -i "out of memory"

# dmesg OOM messages
dmesg | grep -i "out of memory"

# Typical OOM log entry:
# Out of memory: Killed process 1234 (java) total-vm:8388608kB anon-rss:6291456kB file-rss:0kB shmem-rss:0kB
```

### Step 2: Identify Cgroup Victims

```bash
# Check cgroup memory events
for cgroup in /sys/fs/cgroup/system.slice/*/; do
  if [ -f "$cgroup/memory.events" ]; then
    oom_kills=$(grep oom_kill "$cgroup/memory.events" | awk '{print $2}')
    if [ "$oom_kills" -gt 0 ]; then
      echo "$cgroup: $oom_kills OOM kills"
    fi
  fi
done

# Or using systemd
systemd-cgls --memory | grep -A5 "memory.events"
```

### Step 3: Check Swap Behavior

```bash
# Swap usage
free -h
swapon --show

# Swap activity
vmstat 1 5
# Look for: si (swap in), so (swap out)

# Per-process swap
for pid in $(pgrep -f <pattern>); do
  swap=$(grep VmSwap /proc/$pid/status 2>/dev/null | awk '{print $2}')
  [ -n "$swap" ] && echo "PID $pid: $swap KB swapped"
done
```

### Step 4: Inspect Application Memory

```bash
# Per-process memory usage
pidstat -r 1 60 | grep <process>

# Memory usage over time
smem -r -k -P <process>

# Check for memory leaks
# Monitor RSS growth over time
watch -n5 'ps aux --sort=-%mem | head -10'
```

### Step 5: Check Memory Pressure

```bash
# PSI (Pressure Stall Information)
cat /proc/pressure/memory

# Per-cgroup PSI
cat /sys/fs/cgroup/system.slice/<service>/memory.pressure

# Monitor continuously
watch -n1 'cat /proc/pressure/memory'
```

## Root Cause Analysis

### Common Causes

**1. Memory Leak:**
- Application not freeing memory
- Gradual memory growth
- Eventually exhausts system

**2. Insufficient Memory:**
- Workload requires more RAM
- Too many processes
- Memory limits too low

**3. Memory Fragmentation:**
- Cannot allocate large chunks
- Many small allocations
- Memory available but not usable

**4. Cache Pressure:**
- Page cache consuming too much
- Not enough free memory
- OOM killer targets applications

**5. Noisy Neighbor:**
- One process consuming too much
- Starving other processes
- No memory limits set

## Fix Procedures

### Immediate Fix

**Option 1: Increase Memory Limits**

```bash
# For specific service
systemctl set-property myservice.service MemoryMax=4G

# For cgroup
echo "4G" > /sys/fs/cgroup/system.slice/myservice.service/memory.max
```

**Option 2: Cap Noisy Neighbors**

```bash
# Find memory hogs
ps aux --sort=-%mem | head -10

# Set memory limit
systemctl set-property noisy-service.service MemoryMax=2G

# Or kill if necessary
kill -9 <pid>
```

**Option 3: Reduce Cache Pressure**

```bash
# Drop caches (temporary)
sync
echo 3 > /proc/sys/vm/drop_caches

# Tune cache pressure
sysctl vm.vfs_cache_pressure=200
# Higher = more aggressive cache reclaim
```

**Option 4: Add Swap (Temporary)**

```bash
# Create swap file
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# This buys time but doesn't fix root cause
```

### Long-term Fix

**For Memory Leaks:**
- Fix application bug
- Use memory profiling tools (valgrind, AddressSanitizer)
- Implement memory limits
- Add monitoring

**For Insufficient Memory:**
- Add more RAM
- Reduce workload
- Optimize applications
- Use memory limits appropriately

**For Fragmentation:**
- Use huge pages
- Restart processes periodically
- Optimize allocation patterns

## Prevention Strategies

### Memory Limits

```bash
# Set limits per service
systemctl set-property myservice.service MemoryMax=4G MemoryHigh=3G

# MemoryHigh = soft limit (throttle)
# MemoryMax = hard limit (OOM kill)
```

### Monitoring

```bash
# Alert on memory pressure
# PSI some > 10%: Warning
# PSI full > 5%: Critical

# Alert on OOM kills
# Monitor memory.events oom_kill

# Alert on high memory usage
# Memory usage > 80%: Warning
# Memory usage > 90%: Critical
```

### Application-Level

```c
// Check available memory before allocation
long available = sysconf(_SC_AV_PHYS_PAGES) * sysconf(_SC_PAGESIZE);
if (needed > available * 0.8) {
    // Handle gracefully
    return ENOMEM;
}
```

## OOM Killer Tuning

### OOM Score Adjustment

```bash
# Make process less likely to be killed
echo -900 > /proc/<pid>/oom_score_adj

# Via systemd
[Service]
OOMScoreAdjust=-900
```

### OOM Killer Mode

```bash
# Check mode
cat /proc/sys/vm/oom_kill_allocating_task
# 0 = kill highest-scoring process
# 1 = kill allocating task (if possible)

# Panic on OOM (not recommended)
cat /proc/sys/vm/panic_on_oom
# 0 = use OOM killer
# 1 = panic instead
```

## Recovery Workflow

### Step 1: Stop the Bleeding

```bash
# Identify and kill memory hogs
ps aux --sort=-%mem | head -5
kill -9 <top_memory_hog>

# Or restart service
systemctl restart <service>
```

### Step 2: Free Memory

```bash
# Drop caches
sync
echo 3 > /proc/sys/vm/drop_caches

# Check if system recovers
free -h
```

### Step 3: Investigate Root Cause

```bash
# Review OOM logs
journalctl -k -g "Out of memory"

# Check memory usage trends
# Review monitoring graphs

# Identify memory leaks
pidstat -r 1 60
```

### Step 4: Implement Fixes

- Fix memory leaks
- Increase memory limits
- Add more RAM
- Optimize applications

## Best Practices

1. **Set memory limits** - Prevent runaway processes
2. **Monitor PSI** - Early warning of pressure
3. **Alert on OOM kills** - Immediate notification
4. **Profile applications** - Find memory leaks
5. **Test under load** - Know memory requirements

:::warning Production Warning
OOM kill storms indicate serious memory issues. Don't just add more RAM - find and fix the root cause (usually memory leaks).
:::

## Next Steps

Continue to [Disk, Inode & Network Outages](./io-network-failures) for storage and network failure scenarios.
