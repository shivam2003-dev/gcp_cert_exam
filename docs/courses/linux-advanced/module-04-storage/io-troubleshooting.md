# Storage Failure Scenarios & Recovery

## Scenario 1: Hung I/O (D State Processes)

### Symptoms

- Processes stuck in `D` (uninterruptible sleep) state
- High load average
- High `%wa` in `top`
- System becomes unresponsive
- Cannot kill processes (even SIGKILL)

### Investigation Steps

**Step 1: Identify Blocked Processes**

When processes are stuck in D state, they're waiting for I/O operations to complete. This is often the first sign of storage problems.

```bash
# Find D state processes - these are blocked on I/O
ps -eo pid,state,wchan,cmd | grep ' D '
```

:::important Understanding D State
Processes in D state (uninterruptible sleep) are:
- Waiting for I/O operations (disk, network storage)
- Cannot be killed (even SIGKILL won't work)
- Blocking the system if there are many of them

This is different from S state (interruptible sleep) where processes can be woken by signals.
:::

```bash
# Check what they're waiting for - see the kernel function
cat /proc/<pid>/wchan
# Common: io_schedule, blkdev_issue_flush, etc.
```

:::tip Understanding wchan
The `wchan` (wait channel) shows the kernel function the process is waiting in:
- `io_schedule`: Waiting for I/O
- `blkdev_issue_flush`: Waiting for disk flush
- `futex_wait_queue_me`: Waiting on lock (not I/O)
- `poll_schedule_timeout`: Waiting in poll/select

If you see I/O-related functions, the storage subsystem is the problem.
:::

**Step 2: Check I/O Statistics**

```bash
# I/O wait time
iostat -x 1 5

# Per-process I/O
iotop -ao

# Block device errors
dmesg | grep -i "i/o error\|timeout\|reset"
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

# Try to remount read-only
mount -o remount,ro /dev/sda1 /mnt
```

### Root Cause Analysis

**Common Causes:**
1. **Failing disk** - Hardware failure
2. **Storage array issues** - RAID problems
3. **Network storage timeout** - NFS/iSCSI issues
4. **Filesystem corruption** - Metadata issues
5. **I/O scheduler hang** - Kernel bug

### Solution

**Immediate Actions:**

```bash
# 1. Check if remount helps
mount -o remount,ro /dev/sda1 /mnt

# 2. If possible, failover to backup
# (for HA systems)

# 3. As last resort, reboot
# (loses unsaved data)
```

**Long-term Fix:**
- Replace failing hardware
- Fix storage array
- Update drivers/kernel
- Fix filesystem corruption

### Prevention

- Monitor disk health (S.M.A.R.T.)
- Use RAID for redundancy
- Monitor I/O latency
- Regular filesystem checks

## Scenario 2: Disk Full / Inode Exhaustion

### Symptoms

- Writes fail with `ENOSPC` (No space left on device)
- `df -h` shows 100% usage
- Applications cannot create files

### Investigation

```bash
# Check disk usage
df -h

# Check inode usage
df -i

# Find large files
du -shx /* 2>/dev/null | sort -h | tail -20

# Find large directories
du -shx /var/* 2>/dev/null | sort -h | tail -20
```

### Finding Space Hogs

```bash
# Top 10 largest files
find / -type f -exec du -Sh {} + 2>/dev/null | sort -rh | head -10

# Top 10 largest directories
du -hx / 2>/dev/null | sort -rh | head -10

# Find files larger than 1GB
find / -type f -size +1G 2>/dev/null

# Find by file type
find /var/log -name "*.log" -size +100M
```

### Inode Exhaustion

```bash
# Check inode usage
df -i

# If 100% IUse, find directories with many files
find / -xdev -type f | cut -d "/" -f 2 | sort | uniq -c | sort -rn | head

# Count files per directory
for dir in /*; do
  count=$(find "$dir" -type f 2>/dev/null | wc -l)
  echo "$count $dir"
done | sort -rn | head
```

### Solution

**Immediate Fix:**

```bash
# Clean temporary files
rm -rf /tmp/*
rm -rf /var/tmp/*

# Rotate/compress logs
logrotate -f /etc/logrotate.conf

# Remove old packages
apt-get autoremove
apt-get autoclean

# Remove old kernels
apt-get purge $(dpkg -l | grep '^ii.*linux-image' | awk '{print $2}' | grep -v $(uname -r))
```

**For Inode Exhaustion:**

```bash
# Delete small files
find /path -type f -size -1k -delete

# Reformat with more inodes (data loss!)
# mkfs.ext4 -N 20000000 /dev/sda1
```

### Prevention

- Monitor disk usage (alert at 80%)
- Monitor inode usage (alert at 80%)
- Automatic log rotation
- Regular cleanup jobs
- Use filesystems with dynamic inodes (XFS, Btrfs)

## Scenario 3: Latency Spikes on NVMe

### Symptoms

- Intermittent high I/O latency
- Applications experience stalls
- `iostat` shows high `await`

### Investigation

```bash
# Check I/O latency
iostat -x 1 5

# Check for thermal throttling
nvme smart-log /dev/nvme0 | grep temperature

# Check queue depth
cat /sys/block/nvme0n1/queue/nr_requests

# Profile I/O
blktrace -d /dev/nvme0n1 -o trace
blkparse trace | grep "Q" | head
```

### Root Causes

1. **Thermal throttling** - Overheating
2. **Queue depth too low** - Not utilizing device
3. **Firmware bugs** - Update firmware
4. **Driver issues** - Update kernel/driver

### Solution

```bash
# Increase queue depth
echo 1024 > /sys/block/nvme0n1/queue/nr_requests

# Check cooling
sensors

# Update firmware
nvme fw-download /dev/nvme0 -f firmware.bin
nvme fw-commit /dev/nvme0 -s 1
```

## Scenario 4: Filesystem Corruption

### Symptoms

- Cannot mount filesystem
- Files disappearing
- `EXT4-fs error` in dmesg
- `XFS (dm-0): Metadata corruption`

### Investigation

```bash
# Check kernel messages
dmesg | grep -i "ext4\|xfs\|corrupt\|error"

# Try to mount read-only
mount -o ro /dev/sda1 /mnt

# Check filesystem
fsck.ext4 -n /dev/sda1  # Dry run
```

### Recovery Steps

**Step 1: Backup (if possible)**

```bash
# Block-level backup
dd if=/dev/sda1 of=/backup/sda1.img bs=1M

# Or use filesystem snapshot
# (if available)
```

**Step 2: Attempt Repair**

```bash
# ext4
fsck.ext4 -y /dev/sda1

# XFS
xfs_repair /dev/sda1

# Btrfs
btrfs check --repair /dev/sda1
# (Use with caution!)
```

**Step 3: If Repair Fails**

```bash
# Restore from backup
dd if=/backup/sda1.img of=/dev/sda1 bs=1M

# Or recover files
# (using photorec, testdisk, etc.)
```

### Prevention

- Regular filesystem checks
- Use journaling
- Unmount cleanly
- Monitor disk health
- Use ECC memory (prevents corruption)

## Scenario 5: Slow I/O Performance

### Symptoms

- Low throughput (rkB/s, wkB/s)
- High latency (await)
- Applications slow

### Investigation

```bash
# Check I/O stats
iostat -x 1 5

# Check I/O size
# Small I/O = low throughput

# Check queue utilization
cat /sys/block/sda/queue/nr_requests
iostat -x 1 | grep %util
```

### Common Causes

1. **Small I/O size** - Not utilizing device
2. **Low queue depth** - Not enough parallelism
3. **Wrong scheduler** - Not optimal for device
4. **Slow storage** - HDD vs SSD
5. **Misaligned partitions** - Performance penalty

### Solution

```bash
# Increase queue depth
echo 512 > /sys/block/sda/queue/nr_requests

# Change scheduler
echo kyber > /sys/block/sda/queue/scheduler

# Increase read-ahead
blockdev --setra 2048 /dev/sda

# Check alignment
fdisk -l /dev/sda
# Start sector should be divisible by 8 (for 4KB sectors)
```

## Diagnostic Tools Reference

### Quick I/O Health Check

```bash
#!/bin/bash
echo "=== I/O Health Check ==="
echo "Disk Usage:"
df -h
echo ""
echo "I/O Statistics:"
iostat -x 1 3
echo ""
echo "Top I/O Processes:"
iotop -ao -n 1 -b | head -10
echo ""
echo "Block Device Errors:"
dmesg | grep -i "i/o error" | tail -5
```

### Advanced Diagnostics

```bash
# Full I/O trace
blktrace -d /dev/sda -o trace
blkparse trace > trace.txt

# Analyze with btt
btt -i trace

# Check for I/O errors
smartctl -l error /dev/sda
```

## Best Practices

1. **Monitor continuously** - iostat, disk usage
2. **Alert on thresholds** - 80% disk, high latency
3. **Regular maintenance** - fsck, cleanup
4. **Test recovery** - Know your procedures
5. **Document procedures** - For on-call engineers

:::tip Production Insight
Storage issues often manifest as system hangs. Always check I/O wait and process states first. D state processes indicate I/O problems.
:::

## Next Steps

You've completed Module 4! Move to [Module 5: Networking Internals](../module-05-networking/network-stack).
