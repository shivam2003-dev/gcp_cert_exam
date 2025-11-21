# Troubleshooting Playbooks

## Overview

This module provides step-by-step playbooks for common production incidents. Each playbook includes symptoms, investigation steps, root cause analysis, and resolution procedures.

## High Load Incident

### Symptoms

- Load average > CPU count
- System feels slow
- Applications timing out
- High CPU usage

### Investigation Workflow

**Step 1: Confirm Load Average**

```bash
# Check load average
uptime
# Output: load average: 8.50, 7.23, 6.45
# If 4 CPUs, load > 4 indicates overload

# Check CPU count
nproc
lscpu | grep "^CPU(s):"
```

**Step 2: Identify Resource Bottleneck**

```bash
# CPU usage
mpstat -P ALL 1 3

# Memory pressure
vmstat 1 5
# Look for: si, so (swap in/out)

# I/O wait
iostat -xz 1 5
# Look for: %util, await

# Network
sar -n DEV 1 5
```

**Step 3: Determine Contention Type**

**CPU Contention:**
- High %usr or %sys in mpstat
- Load average > CPU count
- Low I/O wait

**I/O Contention:**
- High %wa in top
- High await in iostat
- Processes in D state

**Memory Contention:**
- High si/so in vmstat (swapping)
- Low free memory
- OOM kills

**Lock Contention:**
- High context switches
- Processes waiting on futex
- Low CPU usage but high load

**Step 4: Drill Down**

**For CPU Issues:**
```bash
# Find CPU hogs
top -b -n1 | head -20
pidstat -u 1 5

# Profile with perf
perf top
perf record -a -g sleep 10
perf report
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

**For Memory Issues:**
```bash
# Memory usage
free -h
vmstat 1 5

# Per-process memory
pidstat -r 1 5
smem -r -k
```

**Step 5: Document Timeline**

```bash
# Create incident log
echo "=== High Load Incident ===" > /tmp/incident.log
date >> /tmp/incident.log
uptime >> /tmp/incident.log
top -b -n1 | head -20 >> /tmp/incident.log
```

### Resolution

**Immediate Actions:**
- Identify and throttle offending process
- Restart misbehaving service
- Add more resources (if possible)

**Long-term Fix:**
- Fix root cause (bug, misconfiguration)
- Optimize application
- Add monitoring and alerts
- Implement resource limits

## Hung I/O Processes

### Symptoms

- Processes stuck in D state
- Cannot kill processes (even SIGKILL)
- High I/O wait
- System unresponsive

### Investigation

**Step 1: Identify Blocked Processes**

```bash
# Find D state processes
ps -eo pid,state,wchan,cmd | grep ' D '

# Count blocked processes
ps -eo state | grep ' D ' | wc -l

# Check what they're waiting for
for pid in $(ps -eo pid,state | awk '$2=="D" {print $1}'); do
  echo "PID $pid:"
  cat /proc/$pid/wchan
  echo "Stack:"
  cat /proc/$pid/stack | head -5
done
```

**Step 2: Check I/O Statistics**

```bash
# I/O wait time
iostat -xz 1 5

# Per-device statistics
iostat -d 1 5

# Check for I/O errors
dmesg | grep -i "i/o error"
journalctl -k | grep -i "i/o error"
```

**Step 3: Check Storage Health**

```bash
# S.M.A.R.T. status
smartctl -a /dev/sda

# Check for errors
smartctl -l error /dev/sda

# NVMe health
nvme smart-log /dev/nvme0
```

**Step 4: Check Filesystem**

```bash
# Filesystem errors
dmesg | grep -i "ext4\|xfs\|error"
journalctl -k | grep -i "filesystem"

# Try to remount read-only
mount -o remount,ro /dev/sda1 /mnt
```

### Resolution

**Immediate Actions:**

```bash
# Option 1: Fix underlying I/O issue
# Check storage array status
# Check network storage (NFS, iSCSI)

# Option 2: Remount read-only (if possible)
mount -o remount,ro /dev/sda1 /mnt

# Option 3: As last resort, reboot
# (loses unsaved data)
reboot
```

**Long-term Fix:**
- Replace failing hardware
- Fix storage array issues
- Update drivers
- Fix filesystem corruption

## Zombie Processes

### Symptoms

- Many Z state processes
- PID exhaustion possible
- System may become unresponsive

### Investigation

**Step 1: Find Zombies**

```bash
# List zombies
ps aux | awk '$8 ~ /Z/ {print}'

# Count zombies
ps aux | awk '$8 ~ /Z/ {count++} END {print count}'

# Zombie details
ps -eo pid,ppid,state,cmd | grep ' Z '
```

**Step 2: Find Parent**

```bash
# For each zombie, find parent
for pid in $(ps -eo pid,state | awk '$2=="Z" {print $1}'); do
  echo "Zombie PID: $pid"
  ps -o pid,ppid,state,cmd -p $pid
  parent=$(ps -o ppid -p $pid -h)
  echo "Parent PID: $parent"
  ps -o pid,cmd -p $parent
done
```

**Step 3: Check Parent Status**

```bash
# Is parent still running?
ps -p <parent_pid>

# Is parent PID 1?
# If yes, this is a kernel bug
```

### Resolution

**Option 1: Restart Parent**

```bash
# Find parent service
systemctl status <parent-service>

# Restart parent
systemctl restart <parent-service>
```

**Option 2: Send SIGCHLD**

```bash
# Send SIGCHLD to parent
kill -CHLD <parent_pid>

# This should cause parent to reap zombies
```

**Option 3: If Parent is PID 1**

This is a kernel bug. Report to kernel developers with:
- Kernel version
- Steps to reproduce
- Relevant logs

## Escalation Decision Matrix

### When to Escalate

| Condition | Severity | Action |
|-----------|----------|--------|
| **Data loss risk** | Critical | Engage storage/SRE immediately |
| **Kernel panic** | Critical | Capture vmcore, reboot via kdump |
| **Security breach** | Critical | Trigger IR playbook, isolate system |
| **Production down** | High | Page on-call, start war room |
| **Performance degradation** | Medium | Investigate, document, fix |
| **Non-critical service down** | Low | Fix during maintenance window |

### Escalation Contacts

**Storage Team:**
- For storage array issues
- For filesystem corruption
- For disk failures

**Network Team:**
- For network outages
- For routing issues
- For DNS problems

**Security Team:**
- For security incidents
- For unauthorized access
- For compliance issues

**SRE Team:**
- For production outages
- For capacity issues
- For architecture problems

## Debugging Without Rebooting

### Magic SysRq

```bash
# Enable SysRq
echo 1 > /proc/sys/kernel/sysrq

# Useful SysRq commands:
echo t > /proc/sysrq-trigger  # Show all tasks
echo w > /proc/sysrq-trigger   # Show blocked tasks
echo m > /proc/sysrq-trigger   # Show memory info
echo s > /proc/sysrq-trigger   # Sync filesystems
echo u > /proc/sysrq-trigger   # Unmount filesystems
echo o > /proc/sysrq-trigger   # Reboot (use carefully!)
```

### kdump for Kernel Crashes

```bash
# Check if kdump is enabled
systemctl status kdump

# Trigger crash dump (for testing)
echo c > /proc/sysrq-trigger

# Analyze vmcore
crash /usr/lib/debug/lib/modules/$(uname -r)/vmlinux /var/crash/vmcore
```

### When to Reboot

**Reboot Required:**
- Kernel panic loop
- Hardware failure
- Security patch requiring reboot
- System completely unresponsive

**Avoid Reboot:**
- Can fix without reboot
- Data loss risk
- Customer impact
- Can work around issue

## Production Incident Checklist

### Initial Response

- [ ] Validate alert (real incident?)
- [ ] Assess customer impact
- [ ] Capture baseline metrics
- [ ] Identify affected services
- [ ] Notify stakeholders

### Investigation

- [ ] Identify resource bottleneck
- [ ] Check logs for errors
- [ ] Review recent changes
- [ ] Check monitoring dashboards
- [ ] Document findings

### Resolution

- [ ] Implement fix
- [ ] Verify resolution
- [ ] Monitor for recurrence
- [ ] Document resolution
- [ ] Update runbooks

### Post-Incident

- [ ] Conduct post-mortem
- [ ] Identify root cause
- [ ] Document lessons learned
- [ ] Update procedures
- [ ] Implement prevention

## Best Practices

1. **Follow playbooks** - Don't skip steps
2. **Document everything** - Timeline, actions, findings
3. **Communicate clearly** - Keep stakeholders informed
4. **Learn from incidents** - Improve processes
5. **Practice regularly** - Run incident drills

:::tip Production Insight
Having well-documented playbooks reduces mean time to resolution. Practice these playbooks regularly and update them based on real incidents.
:::

## Next Steps

You've completed Module 8! Move to [Module 9: Performance Optimization & Hardening](../module-09-performance/system-tuning).
