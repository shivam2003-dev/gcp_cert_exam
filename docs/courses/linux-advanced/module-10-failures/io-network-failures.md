# Failure Scenarios: Disk, Inode & Network Outages

## Overview

This module covers critical failure scenarios related to storage and networking. These are common production incidents requiring immediate response.

## Scenario 1: Disk Full

### Symptoms

- Writes fail with `ENOSPC` (No space left on device)
- `df -h` shows 100% usage
- Applications cannot create files
- Log rotation fails
- Database operations fail

### Investigation

**Step 1: Confirm Disk Usage**

```bash
# Check disk usage
df -h

# Check specific mount point
df -h /var
df -h /home
df -h /tmp
```

**Step 2: Find Space Hogs**

```bash
# Top-level directories
du -shx /* 2>/dev/null | sort -h | tail -20

# Specific directory
du -shx /var/* 2>/dev/null | sort -h | tail -20

# Find large files
find / -type f -size +1G 2>/dev/null

# Find large directories
du -hx / 2>/dev/null | sort -rh | head -20
```

**Step 3: Identify File Types**

```bash
# Log files
find /var/log -type f -size +100M

# Temporary files
du -sh /tmp /var/tmp

# Old files
find /var -type f -mtime +30 -ls

# Core dumps
find / -name "core.*" -type f -ls
```

### Immediate Fix

**Option 1: Clean Logs**

```bash
# Rotate logs
logrotate -f /etc/logrotate.conf

# Compress old logs
find /var/log -name "*.log" -mtime +7 -exec gzip {} \;

# Delete old logs
find /var/log -name "*.log.*" -mtime +30 -delete
```

**Option 2: Clean Temporary Files**

```bash
# Clean /tmp
rm -rf /tmp/*

# Clean /var/tmp
rm -rf /var/tmp/*

# Clean package cache
apt-get clean
yum clean all
```

**Option 3: Remove Old Files**

```bash
# Old kernels
apt-get autoremove
apt-get purge $(dpkg -l | grep '^ii.*linux-image' | awk '{print $2}' | grep -v $(uname -r))

# Old containers
docker system prune -a

# Old snapshots
# (if using LVM/Btrfs)
```

### Long-term Fix

- Implement log rotation
- Set up disk quota monitoring
- Automate cleanup jobs
- Add more storage
- Move data to other volumes

## Scenario 2: Inode Exhaustion

### Symptoms

- `ENOSPC` errors despite free disk space
- `df -i` shows 100% IUse
- Cannot create new files
- Applications fail with "No space left"

### Investigation

```bash
# Check inode usage
df -i

# Find directories with many files
find / -xdev -type f | cut -d "/" -f 2 | sort | uniq -c | sort -rn | head

# Count files per directory
for dir in /*; do
  count=$(find "$dir" -type f 2>/dev/null | wc -l)
  echo "$count $dir"
done | sort -rn | head
```

### Common Causes

**1. Many Small Files:**
- Log files not rotated
- Temporary files accumulating
- Email spool files

**2. Too Few Inodes:**
- Filesystem created with default inode count
- Not enough inodes for workload

### Immediate Fix

```bash
# Delete small files
find /path -type f -size -1k -delete

# Clean up specific directories
# (based on investigation)
```

### Long-term Fix

**Option 1: Reformat with More Inodes**

```bash
# Backup data first!
# Create filesystem with more inodes
mkfs.ext4 -N 20000000 /dev/sda1
# -N = number of inodes
```

**Option 2: Use Filesystem with Dynamic Inodes**

- XFS: Dynamic inode allocation
- Btrfs: Dynamic inode allocation
- ext4: Fixed at creation time

## Scenario 3: Broken Init / Boot Failure

### Symptoms

- System won't boot
- Hangs during boot
- Kernel loads but systemd doesn't start
- Boot errors on screen

### Investigation

**Step 1: Boot to Rescue**

```bash
# In GRUB, add to kernel line:
systemd.unit=rescue.target

# Or use:
systemd.unit=emergency.target
```

**Step 2: Mount Root Filesystem**

```bash
# Check what's mounted
mount

# Mount root read-write
mount -o remount,rw /

# Or mount manually
mount /dev/sda2 /mnt
```

**Step 3: Diagnose**

```bash
# Check systemd logs
journalctl -xb

# Check failed services
systemctl --failed

# Check boot analysis
systemd-analyze blame
```

### Fix Procedures

**Fix 1: Disable Problematic Service**

```bash
# In rescue mode
chroot /mnt
systemctl disable <problematic-service>
systemctl mask <problematic-service>
exit
reboot
```

**Fix 2: Fix Bootloader**

```bash
# In rescue mode
chroot /mnt
grub2-install /dev/sda
update-grub
exit
reboot
```

**Fix 3: Regenerate Initramfs**

```bash
# In rescue mode
chroot /mnt
dracut -f
# Or
update-initramfs -u
exit
reboot
```

**Fix 4: Fix Filesystem**

```bash
# Boot from rescue media
# Check filesystem
fsck -f /dev/sda1

# Repair if needed
fsck -y /dev/sda1
```

## Scenario 4: Network Outage

### Symptoms

- Services unreachable
- High retransmission rate
- Connection timeouts
- Network interface down

### Investigation

**Step 1: Check Interface Status**

```bash
# Interface status
ip link show

# Check if interface is up
ip link show dev eth0 | grep -q "state UP" && echo "UP" || echo "DOWN"

# Interface statistics
ip -s link show dev eth0
```

**Step 2: Test Connectivity**

```bash
# Ping gateway
ping -c3 <gateway>

# Ping external
ping -c3 8.8.8.8

# Traceroute
traceroute <destination>

# DNS resolution
nslookup example.com
dig example.com
```

**Step 3: Check Network Services**

```bash
# NetworkManager status
systemctl status NetworkManager

# Network service status
systemctl status networking

# Check configuration
cat /etc/network/interfaces
nmcli connection show
```

**Step 4: Check Routing**

```bash
# Routing table
ip route show

# Default gateway
ip route | grep default

# Check for routing issues
ip route get <destination>
```

### Fix Procedures

**Fix 1: Restart Network Service**

```bash
# Restart NetworkManager
systemctl restart NetworkManager

# Or restart networking
systemctl restart networking

# Or bring interface down/up
ip link set dev eth0 down
ip link set dev eth0 up
```

**Fix 2: Reconfigure Network**

```bash
# Using ip commands
ip addr add 192.168.1.100/24 dev eth0
ip link set dev eth0 up
ip route add default via 192.168.1.1

# Or fix configuration files
vim /etc/network/interfaces
# Or
nmcli connection modify <connection> ipv4.addresses 192.168.1.100/24
```

**Fix 3: Check Physical Layer**

```bash
# Check cable
# Check switch port
# Check NIC lights
# Test with different cable/port
```

## Scenario 5: CPU & I/O Saturation

### Symptoms

- High load average
- Slow system response
- High CPU or I/O wait
- Applications timing out

### Investigation

```bash
# CPU usage
top
mpstat -P ALL 1 3

# I/O wait
iostat -xz 1 5

# Load average
uptime
sar -q 1 5
```

### Fix Procedures

**For CPU Saturation:**
- Identify CPU hogs
- Throttle or kill processes
- Add more CPUs
- Optimize applications

**For I/O Saturation:**
- Identify I/O hogs
- Move to faster storage
- Optimize I/O patterns
- Increase queue depth

## Prevention Strategies

### Disk Monitoring

```bash
# Alert thresholds
# Disk usage > 80%: Warning
# Disk usage > 90%: Critical
# Inode usage > 80%: Warning
# Inode usage > 90%: Critical
```

### Network Monitoring

```bash
# Monitor interface status
# Alert on interface down
# Monitor packet loss
# Monitor retransmissions
```

### Automated Cleanup

```bash
# Log rotation
# /etc/logrotate.conf
# Automated cleanup jobs
# Cron jobs for temporary files
```

## Best Practices

1. **Monitor continuously** - Catch issues early
2. **Set up alerts** - Proactive notification
3. **Automate cleanup** - Prevent accumulation
4. **Test recovery** - Know procedures
5. **Document procedures** - For on-call engineers

:::tip Production Insight
Storage and network failures are common. Having automated monitoring and cleanup prevents most issues. Always have recovery procedures documented.
:::

## Next Steps

You've completed Module 10 and the entire Linux course! Congratulations on mastering Advanced Linux Engineering.
