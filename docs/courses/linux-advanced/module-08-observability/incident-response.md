# Incident Response Workflow

## Overview

When Linux systems fail or perform poorly, a systematic approach to incident response is critical. This module covers the complete workflow from initial alert to resolution.

## Incident Response Framework

### Phase 1: Alert Validation

**Questions to Ask:**
1. Is this a real incident or false positive?
2. What is the customer impact?
3. What is the severity level?
4. Is this affecting production?

**Validation Steps:**
```bash
# Quick health check
uptime
systemctl --failed
df -h
free -h
```

### Phase 2: Initial Triage

**Goal:** Understand the scope and impact

**Key Metrics to Capture:**
- Load average vs CPU count
- Memory usage and swap
- Disk I/O wait
- Network connectivity
- Service status

## Where to Start When Linux is Slow

### Step 1: Capture Baseline Metrics

```bash
#!/bin/bash
# Quick system snapshot
echo "=== System Snapshot ===" > /tmp/incident_snapshot.txt
date >> /tmp/incident_snapshot.txt
echo "" >> /tmp/incident_snapshot.txt

echo "=== Uptime & Load ===" >> /tmp/incident_snapshot.txt
uptime >> /tmp/incident_snapshot.txt
echo "" >> /tmp/incident_snapshot.txt

echo "=== CPU Usage ===" >> /tmp/incident_snapshot.txt
mpstat -P ALL 1 3 >> /tmp/incident_snapshot.txt
echo "" >> /tmp/incident_snapshot.txt

echo "=== Memory ===" >> /tmp/incident_snapshot.txt
free -h >> /tmp/incident_snapshot.txt
vmstat 1 3 >> /tmp/incident_snapshot.txt
echo "" >> /tmp/incident_snapshot.txt

echo "=== I/O ===" >> /tmp/incident_snapshot.txt
iostat -xz 1 3 >> /tmp/incident_snapshot.txt
echo "" >> /tmp/incident_snapshot.txt

echo "=== Network ===" >> /tmp/incident_snapshot.txt
sar -n DEV 1 3 >> /tmp/incident_snapshot.txt
echo "" >> /tmp/incident_snapshot.txt

echo "=== Top Processes ===" >> /tmp/incident_snapshot.txt
top -b -n1 | head -20 >> /tmp/incident_snapshot.txt
```

### Step 2: Identify Dominant Resource

**CPU Bound:**
- Load average > CPU count
- High %CPU in top
- Low I/O wait

**Memory Bound:**
- High memory usage
- Swap activity (si/so in vmstat)
- OOM kills

**I/O Bound:**
- High %wa in top
- High await in iostat
- Processes in D state

**Network Bound:**
- High network utilization
- Packet loss
- Connection issues

### Step 3: Drill Down Analysis

**For CPU Issues:**
```bash
# Find CPU hogs - identify processes consuming CPU
top -b -n1 | head -20
pidstat -u 1 5
```

:::tip CPU Analysis Strategy
When investigating CPU issues:
1. Check load average vs CPU count (load > CPUs = overloaded)
2. Identify top CPU consumers
3. Check if it's user CPU (%usr) or system CPU (%sys)
4. High %sys indicates kernel overhead (drivers, interrupts, syscalls)
5. Profile with `perf` to find hot functions
:::

```bash
# Profile with perf - see what code is consuming CPU
perf top
perf record -a -g sleep 10
perf report
```

:::important perf Overhead
`perf` has much lower overhead than `strace` (typically < 5%). It's safe to use in production for short periods. Use sampling (default) rather than full tracing for lower overhead.
:::

**For Memory Issues:**
```bash
# Memory usage
free -h
vmstat 1 5

# Per-process memory
pidstat -r 1 5
smem -r -k

# Check for leaks
cat /proc/meminfo | grep -E "MemAvailable|SwapFree|Dirty"
```

**For I/O Issues:**
```bash
# I/O statistics
iostat -xz 1 5

# Per-process I/O
iotop -ao

# Blocked processes
ps -eo pid,state,wchan,cmd | grep ' D '
```

**For Network Issues:**
```bash
# Network statistics
ss -s
netstat -s

# Interface statistics
ip -s link show
sar -n DEV 1 5

# Connection tracking
sysctl net.netfilter.nf_conntrack_count
```

## Quick Triage Command Set

### Essential Commands

```bash
# System overview
uptime                    # Load average
free -h                  # Memory
df -h                    # Disk space
ss -s                    # Network connections

# Resource usage
vmstat 1 5               # Memory, CPU, I/O
mpstat -P ALL 1 3        # Per-CPU stats
iostat -xz 1 5           # I/O stats
sar -n DEV 1 5           # Network stats

# Process information
top -b -n1               # Top processes
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# Service status
systemctl --failed
systemctl list-units --state=failed
```

## Reading Logs Effectively

### Kernel Logs

```bash
# Recent kernel messages
dmesg | tail -50

# Kernel errors
journalctl -k -p err

# Previous boot kernel messages
journalctl -k -b -1

# Search for specific errors
journalctl -k | grep -i "error\|panic\|oops"
```

### systemd Logs

```bash
# All errors since boot
journalctl -p err -b

# Specific service
journalctl -u myservice.service -b

# Last 100 lines
journalctl -u myservice.service -n 100

# Follow logs
journalctl -u myservice.service -f

# Time range
journalctl -u myservice.service --since "1 hour ago"
journalctl -u myservice.service --since "2024-01-15 10:00:00" --until "2024-01-15 11:00:00"
```

### Application Logs

```bash
# Standard locations
/var/log/messages
/var/log/syslog
/var/log/application.log

# Using journalctl
journalctl -t application_name

# Using grep
grep -i error /var/log/application.log
tail -f /var/log/application.log
```

### Log Filtering Tips

```bash
# Filter by unit and time
journalctl -u kubelet -S "-10min"

# Grep in logs
journalctl -u myservice.service | grep ERROR

# Using journalctl grep
journalctl -u myservice.service --grep="ERROR"

# Multiple filters
journalctl -u service1 -u service2 --grep="error" -p err

# JSON output for parsing
journalctl -u myservice.service -o json | jq 'select(.PRIORITY >= 3)'
```

## Unresponsive Systems

### Symptoms

- No response to SSH
- Commands hang
- System appears frozen
- High load average

### Investigation Steps

**Step 1: Check if System is Accessible**

```bash
# Try basic commands
uptime
ps aux

# Check if processes are running
ps -eo pid,state,comm | head
```

**Step 2: Use Magic SysRq**

```bash
# Enable SysRq (if not enabled)
echo 1 > /proc/sys/kernel/sysrq

# Get task info
echo t > /proc/sysrq-trigger  # Show all tasks
echo w > /proc/sysrq-trigger   # Show blocked tasks
echo m > /proc/sysrq-trigger   # Show memory info
echo s > /proc/sysrq-trigger   # Sync filesystems
echo u > /proc/sysrq-trigger   # Unmount filesystems
```

**Step 3: Capture Kernel State**

```bash
# If kdump enabled, trigger crash dump
echo c > /proc/sysrq-trigger

# Check for existing vmcore
ls -lh /var/crash/
```

**Step 4: Check Process States**

```bash
# Find blocked processes
ps -eo pid,state,wchan,cmd | grep ' D '

# Check what they're waiting for
for pid in $(ps -eo pid,state | awk '$2=="D" {print $1}'); do
  echo "PID $pid:"
  cat /proc/$pid/wchan
  cat /proc/$pid/stack
done
```

## Zombie & Hung I/O Handling

### Identifying Zombies

```bash
# Find zombie processes
ps aux | awk '$8 ~ /Z/ {print}'

# Count zombies
ps aux | awk '$8 ~ /Z/ {count++} END {print count}'

# Find parent of zombie
ps -o pid,ppid,state,cmd -p <zombie_pid>
```

### Handling Zombies

```bash
# Option 1: Restart parent
systemctl restart <parent-service>

# Option 2: Send SIGCHLD to parent
kill -CHLD <parent_pid>

# Option 3: If parent is PID 1, this is a bug
# Report to kernel developers
```

### Hung I/O Processes

**Symptoms:**
- Processes in D state
- High I/O wait
- Cannot kill processes

**Investigation:**
```bash
# Find D state processes
ps -eo pid,state,wchan,cmd | grep ' D '

# Check what they're waiting for
cat /proc/<pid>/wchan
cat /proc/<pid>/stack

# Check I/O statistics
iostat -xz 1 5

# Check for I/O errors
dmesg | grep -i "i/o error"
journalctl -k | grep -i "i/o error"
```

**Recovery:**
```bash
# Option 1: Fix underlying I/O issue
# Check storage health
smartctl -a /dev/sda

# Option 2: Remount filesystem read-only
mount -o remount,ro /dev/sda1 /mnt

# Option 3: As last resort, reboot
# (loses unsaved data)
```

## Incident Documentation

### What to Document

1. **Timeline:**
   - When incident started
   - When detected
   - Actions taken
   - Resolution time

2. **Symptoms:**
   - What was observed
   - Error messages
   - Affected services

3. **Investigation:**
   - Commands run
   - Logs reviewed
   - Metrics captured

4. **Root Cause:**
   - What caused the issue
   - Why it happened

5. **Resolution:**
   - What fixed it
   - Prevention steps

### Incident Report Template

```markdown
## Incident Report

**Date:** 2024-01-15
**Time:** 14:30 UTC
**Severity:** High
**Duration:** 15 minutes

### Symptoms
- High load average (8.0 on 4-core system)
- Application timeouts
- Customer impact: Yes

### Investigation
1. Captured system snapshot
2. Identified CPU-bound process
3. Profiled with perf
4. Found infinite loop in application

### Root Cause
Application bug causing infinite loop in processing logic

### Resolution
- Killed runaway process
- Restarted application
- Applied hotfix

### Prevention
- Add CPU limits via cgroups
- Implement circuit breakers
- Add monitoring alerts
```

## Best Practices

1. **Capture baselines first** - Know normal state
2. **Document everything** - Timeline, commands, findings
3. **Use systematic approach** - Don't skip steps
4. **Communicate clearly** - Keep stakeholders informed
5. **Learn from incidents** - Post-mortem and improvements

:::tip Production Insight
A systematic approach to incident response reduces mean time to resolution (MTTR). Always capture baselines first, then drill down methodically.
:::

## Next Steps

Continue to [Log & Metric Playbooks](./log-analysis) for advanced log analysis techniques.
