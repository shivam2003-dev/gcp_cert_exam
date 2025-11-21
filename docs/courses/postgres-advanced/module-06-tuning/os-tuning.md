# OS Tuning

## Overview

Operating system tuning can significantly impact PostgreSQL performance. This chapter covers kernel and filesystem tuning.

## Kernel Parameters

### vm.swappiness

Controls tendency to swap.

```bash
# Check current value
cat /proc/sys/vm/swappiness

# Set to 1 (minimize swapping)
echo 1 > /proc/sys/vm/swappiness

# Make permanent
echo 'vm.swappiness = 1' >> /etc/sysctl.conf
```

**Guidelines:**
- **0-10:** Minimize swapping (good for databases)
- **60:** Default (too high for databases)
- **100:** Aggressive swapping (bad for databases)

### vm.dirty_ratio

Percentage of memory that can be dirty before writing.

```bash
# Default: 20%
# For databases with lots of RAM, can increase
echo 'vm.dirty_ratio = 15' >> /etc/sysctl.conf
```

### vm.dirty_background_ratio

Percentage of memory for background writes.

```bash
echo 'vm.dirty_background_ratio = 5' >> /etc/sysctl.conf
```

### shmmax and shmall

Shared memory settings (usually auto-configured).

```bash
# Check
ipcs -l

# Usually fine with defaults on modern systems
```

## Filesystem Tuning

### Mount Options

**ext4:**
```bash
# /etc/fstab
/dev/sda1 /data ext4 noatime,nodiratime,data=writeback 0 2
```

**XFS:**
```bash
/dev/sda1 /data xfs noatime 0 2
```

**Options:**
- `noatime` - Don't update access time
- `nodiratime` - Don't update directory access time
- `data=writeback` - Faster, less safe (ext4)

### Huge Pages

Enable huge pages for better memory management:

```bash
# Check huge page size
grep Hugepagesize /proc/meminfo

# Calculate needed huge pages
# shared_buffers / huge_page_size
# Example: 4GB / 2MB = 2048 pages

# Set
echo 2048 > /proc/sys/vm/nr_hugepages

# Make permanent
echo 'vm.nr_hugepages = 2048' >> /etc/sysctl.conf
```

**PostgreSQL configuration:**
```conf
huge_pages = try
```

## Network Tuning

### TCP Settings

```bash
# Increase TCP buffer sizes
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem = 4096 87380 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem = 4096 65536 16777216' >> /etc/sysctl.conf
```

## Limits

### File Descriptors

```bash
# Check current limit
ulimit -n

# Increase
echo '* soft nofile 65536' >> /etc/security/limits.conf
echo '* hard nofile 65536' >> /etc/security/limits.conf
```

## Best Practices

1. **Minimize swapping** - Set swappiness low
2. **Use noatime** - Reduce filesystem overhead
3. **Enable huge pages** - Better memory management
4. **Tune network** - For high connection counts
5. **Increase file descriptors** - For many connections

:::tip Production Insight
OS tuning is often overlooked but can provide significant performance improvements, especially for I/O and memory management.
:::

## Next Steps

You've completed Module 6! Move to [Module 7: Monitoring, Troubleshooting & Observability](../module-07-monitoring/intro).
