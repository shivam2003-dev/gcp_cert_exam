# Namespaces & cgroups Internals

## Overview

Linux containers are built on two fundamental kernel features: **namespaces** for isolation and **cgroups** for resource management. Understanding these is essential for container operations and troubleshooting.

## Linux Namespaces

### What are Namespaces?

Namespaces provide isolation between processes:
- **Process isolation**: Different process trees
- **Network isolation**: Separate network stacks
- **Filesystem isolation**: Different mount points
- **User isolation**: Different UID/GID mappings

### Namespace Types

| Namespace | Flag | Isolates | Tools |
|-----------|------|----------|-------|
| **Mount (mnt)** | CLONE_NEWNS | Mount points | `unshare -m`, `mount` |
| **PID** | CLONE_NEWPID | Process IDs | `unshare -p`, `nsenter -t <pid> -p` |
| **Network (net)** | CLONE_NEWNET | Network devices | `ip netns add`, `unshare -n` |
| **UTS** | CLONE_NEWUTS | Hostname/domain | `hostname`, `unshare -u` |
| **IPC** | CLONE_NEWIPC | System V IPC | `ipcs`, `unshare -i` |
| **User** | CLONE_NEWUSER | UIDs/GIDs | `unshare -U` |
| **Cgroup** | CLONE_NEWCGROUP | cgroup root | `unshare -C` |
| **Time** | CLONE_NEWTIME | Boot time | `unshare -T` |

### Inspecting Namespaces

```bash
# Process namespaces
ls -l /proc/<pid>/ns/

# Namespace IDs
readlink /proc/<pid>/ns/pid
readlink /proc/<pid>/ns/net
readlink /proc/<pid>/ns/mnt

# All processes in namespace
find /proc/*/ns/pid -exec readlink {} \; | sort -u
```

## Creating Namespace Sandboxes

### Using unshare

```bash
# Create new namespaces
sudo unshare --mount --uts --ipc --net --pid --fork /bin/bash

# Inside namespace:
# - New mount namespace
# - New hostname
# - New IPC namespace
# - New network namespace
# - New PID namespace (PID 1 in namespace)
```

### Making Mount Private

```bash
# After unshare, make mounts private
mount --make-rprivate /

# This prevents mount propagation
# Changes inside namespace don't affect host
```

### Creating Network Namespace

```bash
# Create network namespace
sudo ip netns add mynet

# List namespaces
ip netns list

# Execute command in namespace
sudo ip netns exec mynet bash

# Create veth pair
sudo ip link add veth0 type veth peer name veth1
sudo ip link set veth1 netns mynet

# Configure IPs
sudo ip addr add 10.0.0.1/24 dev veth0
sudo ip link set veth0 up
sudo ip netns exec mynet ip addr add 10.0.0.2/24 dev veth1
sudo ip netns exec mynet ip link set veth1 up
```

## cgroups v1 vs v2

### cgroups v1

**Characteristics:**
- Multiple hierarchies per controller
- Controllers: cpu, memory, blkio, devices, etc.
- Mounted at `/sys/fs/cgroup/`

**Structure:**
```
/sys/fs/cgroup/
├── cpu/
├── memory/
├── blkio/
└── ...
```

**Issues:**
- Complex hierarchy
- Inconsistent behavior
- Hard to manage

### cgroups v2

**Characteristics:**
- Unified hierarchy
- Single mount point
- Better delegation
- Default on newer systems

**Structure:**
```
/sys/fs/cgroup/
├── cgroup.controllers
├── cgroup.subtree_control
├── cgroup.procs
└── ...
```

**Benefits:**
- Simpler management
- Consistent behavior
- Better resource guarantees

### Checking cgroup Version

```bash
# Check which version is in use
mount | grep cgroup

# v1: multiple mounts
# v2: single unified mount
```

## cgroup Controllers

### CPU Controller

**v2 Interface:**
```bash
# CPU limit (quota and period in microseconds)
echo "50000 100000" > /sys/fs/cgroup/cpu.max
# 50000 = 50ms quota per 100ms period = 50% CPU

# CPU weight (for fair sharing)
echo 100 > /sys/fs/cgroup/cpu.weight
# Higher weight = more CPU time
```

**v1 Interface:**
```bash
# CPU shares
echo 512 > /sys/fs/cgroup/cpu/cpu.shares

# CPU quota
echo 50000 > /sys/fs/cgroup/cpu/cpu.cfs_quota_us
echo 100000 > /sys/fs/cgroup/cpu/cpu.cfs_period_us
```

### Memory Controller

**v2 Interface:**
```bash
# Memory limit
echo "1G" > /sys/fs/cgroup/memory.max

# Swap limit
echo "512M" > /sys/fs/cgroup/memory.swap.max

# Memory high (soft limit)
echo "800M" > /sys/fs/cgroup/memory.high
```

**v1 Interface:**
```bash
# Memory limit
echo "1G" > /sys/fs/cgroup/memory/memory.limit_in_bytes

# Swap limit
echo "512M" > /sys/fs/cgroup/memory/memory.memsw.limit_in_bytes
```

### I/O Controller

**v2 Interface:**
```bash
# I/O limit (read and write)
echo "8:0 rbps=10485760 wbps=10485760" > /sys/fs/cgroup/io.max

# I/O weight
echo 100 > /sys/fs/cgroup/io.weight
```

**v1 Interface:**
```bash
# Read bandwidth
echo "8:0 10485760" > /sys/fs/cgroup/blkio/blkio.throttle.read_bps_device

# Write bandwidth
echo "8:0 10485760" > /sys/fs/cgroup/blkio/blkio.throttle.write_bps_device
```

## Creating and Managing cgroups

### Manual cgroup Creation (v2)

```bash
# Create cgroup
sudo mkdir /sys/fs/cgroup/mygroup

# Enable controllers
echo "+cpu +memory" > /sys/fs/cgroup/mygroup/cgroup.subtree_control

# Add process
echo $$ > /sys/fs/cgroup/mygroup/cgroup.procs

# Set limits
echo "50000 100000" > /sys/fs/cgroup/mygroup/cpu.max
echo "1G" > /sys/fs/cgroup/mygroup/memory.max
```

### systemd cgroups

systemd automatically manages cgroups:

```bash
# View cgroup hierarchy
systemd-cgls

# View resource usage
systemd-cgtop

# Per-service cgroup
systemd-cgls /system.slice/myservice.service
```

## Debugging Resource Isolation

### Inspecting cgroup Limits

```bash
# Current usage
cat /sys/fs/cgroup/<path>/memory.current
cat /sys/fs/cgroup/<path>/cpu.stat

# Limits
cat /sys/fs/cgroup/<path>/memory.max
cat /sys/fs/cgroup/<path>/cpu.max

# Events (OOM kills, throttling)
cat /sys/fs/cgroup/<path>/memory.events
cat /sys/fs/cgroup/<path>/cpu.stat
```

### Finding Process cgroup

```bash
# Process cgroup path
cat /proc/<pid>/cgroup

# For v2:
# 0::/system.slice/myservice.service

# For v1:
# Multiple lines, one per controller
```

### systemd Resource Controls

```bash
# Set memory limit
systemctl set-property myservice.service MemoryMax=1G

# Set CPU limit
systemctl set-property myservice.service CPUQuota=50%

# View properties
systemctl show myservice.service | grep -E "Memory|CPU"
```

## PSI (Pressure Stall Information)

### What is PSI?

PSI provides early warning of resource pressure:
- **some**: Some tasks waiting for resource
- **full**: All tasks blocked (severe pressure)

### Monitoring PSI

```bash
# CPU pressure
cat /proc/pressure/cpu

# Memory pressure
cat /proc/pressure/memory

# I/O pressure
cat /proc/pressure/io

# Per-cgroup PSI (v2)
cat /sys/fs/cgroup/<path>/memory.pressure
```

### Interpreting PSI

```
some avg10=0.00 avg60=0.00 avg300=0.00 total=0
full avg10=12.05 avg60=5.23 avg300=1.11 total=1234567
```

- `avg10/60/300`: Averages over time windows (seconds)
- `total`: Total stall time (microseconds)
- `some`: Some tasks waiting
- `full`: All tasks blocked

### Using PSI for Alerts

```bash
# Alert thresholds:
# some avg10 > 10%: Warning
# full avg10 > 5%: Critical

# Monitor continuously
watch -n1 'cat /proc/pressure/memory'
```

## Namespace Debugging

### Entering Namespaces

```bash
# Enter all namespaces of process
nsenter --target <pid> --mount --uts --ipc --net --pid -- bash

# Enter specific namespace
nsenter --target <pid> --net -- bash
nsenter --target <pid> --pid -- bash
```

### Finding Namespace Leaks

```bash
# Orphaned network namespaces
ip netns list

# Clean up
sudo ip netns delete <name>

# Orphaned mount namespaces
find /proc/*/ns/mnt -exec readlink {} \; | sort -u | wc -l
```

## Best Practices

1. **Use cgroups v2** - When available, simpler and better
2. **Monitor PSI** - Early warning of resource pressure
3. **Set appropriate limits** - Prevent resource exhaustion
4. **Clean up namespaces** - Prevent leaks
5. **Use systemd** - Automatic cgroup management

:::tip Production Insight
cgroups are essential for resource management. PSI provides early warning before OOM kills or throttling. Monitor PSI continuously.
:::

## Next Steps

Continue to [Container Runtime Internals](./container-runtime) to understand how Docker and containers work.
