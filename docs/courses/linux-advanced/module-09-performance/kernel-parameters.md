# Kernel Parameters & sysctl Deep Dive

## Overview

Linux kernel behavior is controlled through sysctl parameters. Understanding these parameters is essential for system tuning and troubleshooting.

## Managing sysctl

### Temporary Changes

```bash
# Apply immediately (lost on reboot)
sysctl net.ipv4.tcp_fin_timeout=15

# Apply multiple
sysctl -w net.ipv4.tcp_fin_timeout=15 net.ipv4.tcp_tw_reuse=1
```

### Persistent Changes

```bash
# Method 1: /etc/sysctl.d/ (recommended)
echo 'net.ipv4.tcp_fin_timeout = 15' | sudo tee /etc/sysctl.d/95-tcp-fin-timeout.conf

# Method 2: /etc/sysctl.conf (legacy)
echo 'net.ipv4.tcp_fin_timeout = 15' | sudo tee -a /etc/sysctl.conf

# Apply all sysctl files
sysctl --system

# Or reload specific file
sysctl -p /etc/sysctl.d/95-tcp-fin-timeout.conf
```

### Viewing Current Values

```bash
# All parameters
sysctl -a

# Specific parameter
sysctl net.ipv4.tcp_fin_timeout

# Search
sysctl -a | grep tcp
sysctl -a | grep memory
```

## Key Parameter Categories

### Networking Parameters

#### TCP Tuning

```bash
# Connection backlog
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535

# TIME-WAIT handling
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_tw_recycle=0  # Deprecated, don't use
net.ipv4.tcp_fin_timeout=15

# Keepalive
net.ipv4.tcp_keepalive_time=300
net.ipv4.tcp_keepalive_probes=5
net.ipv4.tcp_keepalive_intvl=15

# Buffer sizes
net.core.rmem_max=134217728
net.core.wmem_max=134217728
net.ipv4.tcp_rmem="4096 87380 134217728"
net.ipv4.tcp_wmem="4096 65536 134217728"

# Congestion control
net.ipv4.tcp_congestion_control=bbr
```

#### IP Forwarding

```bash
# Enable IP forwarding
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

#### Reverse Path Filtering

```bash
# Prevent IP spoofing
net.ipv4.conf.all.rp_filter=1
net.ipv4.conf.default.rp_filter=1
```

### Memory Parameters

#### Overcommit

```bash
# Overcommit mode
vm.overcommit_memory=0
# 0 = heuristic (default)
# 1 = always overcommit
# 2 = never overcommit

# Overcommit ratio
vm.overcommit_ratio=50
# Allow 50% more than RAM + swap
```

#### Swappiness

```bash
# Swap preference
vm.swappiness=10
# 0-100, lower = prefer RAM
```

#### Dirty Pages

```bash
# Dirty page thresholds
vm.dirty_ratio=10
vm.dirty_background_ratio=5

# Writeback timing
vm.dirty_expire_centisecs=3000
vm.dirty_writeback_centisecs=500
```

#### Page Cache

```bash
# Cache pressure
vm.vfs_cache_pressure=50
# Lower = keep more cache
```

### Filesystem Parameters

#### File Descriptors

```bash
# Maximum open files
fs.file-max=2097152

# Inotify watches
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=8192
```

#### aio

```bash
# Async I/O
fs.aio-max-nr=1048576
```

### Kernel Parameters

#### Process Limits

```bash
# Maximum PIDs
kernel.pid_max=131072

# Threads per process
kernel.threads-max=2097152
```

#### Core Dumps

```bash
# Core dump pattern
kernel.core_pattern=/var/crash/core.%e.%p.%t

# Core dump size limit
fs.suid_dumpable=2
```

#### Security

```bash
# Kernel pointer restriction
kernel.kptr_restrict=2
# 0 = no restriction
# 1 = restricted (default)
# 2 = always restricted

# dmesg restriction
kernel.dmesg_restrict=1

# Address space randomization
kernel.randomize_va_space=2
# 0 = disabled
# 1 = conservative
# 2 = full (default)
```

## Parameter Reference Tables

### Networking Parameters

| Parameter | Default | Recommended | Description |
|-----------|---------|-------------|-------------|
| `net.core.somaxconn` | 128 | 65535 | Socket connection backlog |
| `net.ipv4.tcp_max_syn_backlog` | 128 | 65535 | SYN queue size |
| `net.ipv4.tcp_tw_reuse` | 0 | 1 | Reuse TIME-WAIT sockets |
| `net.ipv4.tcp_fin_timeout` | 60 | 15 | TIME-WAIT timeout (seconds) |
| `net.core.rmem_max` | 212992 | 134217728 | Max receive buffer (bytes) |
| `net.core.wmem_max` | 212992 | 134217728 | Max send buffer (bytes) |

### Memory Parameters

| Parameter | Default | Recommended | Description |
|-----------|---------|-------------|-------------|
| `vm.swappiness` | 60 | 10 | Swap preference (0-100) |
| `vm.dirty_ratio` | 40 | 10 | % RAM before blocking writes |
| `vm.dirty_background_ratio` | 10 | 5 | % RAM before background writeback |
| `vm.overcommit_memory` | 0 | 0 | Overcommit mode |
| `vm.vfs_cache_pressure` | 100 | 50 | Cache reclaim pressure |

### Filesystem Parameters

| Parameter | Default | Recommended | Description |
|-----------|---------|-------------|-------------|
| `fs.file-max` | Varies | 2097152 | Max open files |
| `fs.inotify.max_user_watches` | 8192 | 524288 | Max inotify watches |

## Application-Specific Configurations

### Database Server

```bash
# /etc/sysctl.d/99-database.conf
# Memory
vm.swappiness=1
vm.dirty_ratio=5
vm.dirty_background_ratio=2

# Network
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535

# Filesystem
fs.file-max=2097152
```

### Web Server

```bash
# /etc/sysctl.d/99-webserver.conf
# Network
net.core.somaxconn=65535
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_fin_timeout=15

# Filesystem
fs.file-max=2097152
fs.inotify.max_user_watches=524288
```

### High-Performance Computing

```bash
# /etc/sysctl.d/99-hpc.conf
# Process limits
kernel.pid_max=4194304
kernel.threads-max=4194304

# Memory
vm.overcommit_memory=1
vm.overcommit_ratio=100
```

## Verification & Testing

### Verify Changes

```bash
# Check if parameter was applied
sysctl net.ipv4.tcp_fin_timeout

# Compare with default
# Check kernel documentation for defaults
```

### Test Impact

```bash
# Before tuning
./benchmark.sh > before.txt

# Apply tuning
sysctl --system

# After tuning
./benchmark.sh > after.txt

# Compare
diff before.txt after.txt
```

## Common Mistakes

### 1. Setting Conflicting Values

```bash
# Don't do this:
net.ipv4.tcp_rmem="4096 87380 134217728"
net.core.rmem_max=65536  # Too small!

# rmem_max must be >= tcp_rmem max
```

### 2. Not Testing Changes

Always test in staging before production.

### 3. Forgetting to Make Persistent

Temporary changes are lost on reboot.

### 4. Over-Tuning

More tuning != better performance. Find the sweet spot.

## Best Practices

1. **Use /etc/sysctl.d/** - Better organization
2. **Name files descriptively** - 99-service-name.conf
3. **Document why** - Add comments
4. **Version control** - Track changes
5. **Test thoroughly** - Verify improvements

:::tip Production Insight
Use version control for sysctl files. Track changes like application code. This helps with rollback and understanding what changed.
:::

## Next Steps

Continue to [Security Hardening & Audit](./security-hardening) for security-related kernel parameters.
