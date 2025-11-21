# Resource Isolation & Failure Scenarios

## Scenario 1: Container Memory Starvation

### Symptoms

- Container processes killed by OOM
- `memory.current` near `memory.max` in cgroup
- Application errors about memory
- Container restarts frequently

### Investigation

**Step 1: Check Memory Usage**

```bash
# Container memory usage
docker stats <container>

# cgroup memory stats
cat /sys/fs/cgroup/kubepods.slice/<pod>/memory.current
cat /sys/fs/cgroup/kubepods.slice/<pod>/memory.max

# Memory events (OOM kills)
cat /sys/fs/cgroup/kubepods.slice/<pod>/memory.events
# Look for: oom_kill
```

**Step 2: Check OOM Logs**

```bash
# Kernel OOM messages
journalctl -k -g "Out of memory" | grep -i container

# Docker events
docker events --since 1h | grep -i oom
```

**Step 3: Analyze Memory Pressure**

```bash
# PSI for container cgroup
cat /sys/fs/cgroup/kubepods.slice/<pod>/memory.pressure

# System memory pressure
cat /proc/pressure/memory
```

### Root Cause Analysis

**Common Causes:**
1. **Memory limit too low** - Insufficient for workload
2. **Memory leak** - Application leaking memory
3. **Memory spike** - Temporary high usage
4. **Shared memory** - Not accounted in limit

### Solution

**Immediate Fix:**

```bash
# Increase memory limit
docker update --memory=2g <container>

# Or via systemd
systemctl set-property myservice.service MemoryMax=2G
```

**Long-term Fix:**
- Fix memory leaks in application
- Increase memory limits appropriately
- Use memory QoS (MemoryHigh) for soft limits
- Monitor memory usage trends

### Prevention

- Set appropriate memory limits
- Monitor memory usage continuously
- Alert on memory pressure (PSI)
- Use MemoryHigh for soft limits

## Scenario 2: CPU Throttling

### Symptoms

- Container performance degrades
- High CPU throttling in `cpu.stat`
- Application timeouts
- Slow response times

### Investigation

```bash
# Container CPU usage
docker stats <container>

# cgroup CPU stats
cat /sys/fs/cgroup/<slice>/cpu.stat
# Look for: throttled_usec (time throttled)

# CPU pressure
cat /sys/fs/cgroup/<slice>/cpu.pressure
```

### Root Cause Analysis

**Common Causes:**
1. **CPU limit too low** - Insufficient CPU
2. **CPU contention** - Too many containers
3. **CPU quota exceeded** - Burst usage
4. **CPU weight too low** - Not getting fair share

### Solution

**Immediate Fix:**

```bash
# Increase CPU limit
docker update --cpus=2.0 <container>

# Or adjust CPU quota
echo "200000 100000" > /sys/fs/cgroup/<slice>/cpu.max
# 200ms quota per 100ms period = 200% CPU
```

**Long-term Fix:**
- Increase CPU limits
- Reduce number of containers per host
- Use CPU weights for fair sharing
- Profile application CPU usage

### Prevention

- Set appropriate CPU limits
- Monitor CPU throttling
- Use CPU weights for fairness
- Alert on high throttling

## Scenario 3: I/O Throttling

### Symptoms

- Slow disk I/O in container
- High I/O wait time
- Application timeouts on I/O
- Container performance issues

### Investigation

```bash
# Container I/O stats
docker stats <container>

# cgroup I/O stats
cat /sys/fs/cgroup/<slice>/io.stat

# I/O pressure
cat /sys/fs/cgroup/<slice>/io.pressure
```

### Root Cause Analysis

**Common Causes:**
1. **I/O limit too low** - Insufficient bandwidth
2. **I/O contention** - Too many containers
3. **Slow storage** - Underlying storage slow
4. **I/O weight too low** - Not getting fair share

### Solution

**Immediate Fix:**

```bash
# Increase I/O limits
echo "8:0 rbps=52428800 wbps=52428800" > /sys/fs/cgroup/<slice>/io.max
# 50MB/s read and write

# Or via Docker
docker update --device-read-bps /dev/sda:50mb <container>
docker update --device-write-bps /dev/sda:50mb <container>
```

**Long-term Fix:**
- Increase I/O limits
- Use faster storage
- Reduce I/O contention
- Profile application I/O patterns

### Prevention

- Set appropriate I/O limits
- Monitor I/O throttling
- Use I/O weights for fairness
- Alert on I/O pressure

## Scenario 4: Namespace Leaks

### Symptoms

- Cannot create new containers
- Many orphaned namespaces
- System resource exhaustion
- Container creation fails

### Investigation

```bash
# Network namespaces
ip netns list

# Count namespaces
find /proc/*/ns/ -type l | wc -l

# Find orphaned namespaces
# Compare with running containers
docker ps -q | wc -l
ip netns list | wc -l
```

### Root Cause Analysis

**Common Causes:**
1. **Container not cleaned up** - Namespace not deleted
2. **Kubernetes pod leaks** - Pods not cleaned up
3. **Manual namespace creation** - Not tracked
4. **Kernel bug** - Namespace not freed

### Solution

**Immediate Fix:**

```bash
# Clean up network namespaces
for ns in $(ip netns list | awk '{print $1}'); do
  # Check if namespace is in use
  if ! docker ps -q | xargs docker inspect | grep -q "$ns"; then
    sudo ip netns delete "$ns"
  fi
done

# Restart Docker (cleans up)
sudo systemctl restart docker
```

**Long-term Fix:**
- Fix container cleanup
- Monitor namespace count
- Implement namespace cleanup jobs
- Update kernel if bug

### Prevention

- Monitor namespace count
- Alert on high namespace count
- Implement cleanup jobs
- Fix container lifecycle management

## Scenario 5: cgroup Hierarchy Issues

### Symptoms

- Cannot set cgroup limits
- Processes not in expected cgroup
- Resource limits not working
- cgroup operations fail

### Investigation

```bash
# Check cgroup version
mount | grep cgroup

# Check cgroup hierarchy
systemd-cgls

# Process cgroup
cat /proc/<pid>/cgroup

# cgroup permissions
ls -l /sys/fs/cgroup/
```

### Root Cause Analysis

**Common Causes:**
1. **cgroup v1/v2 mismatch** - Mixed versions
2. **Permission issues** - Cannot write to cgroup
3. **Hierarchy issues** - Processes in wrong cgroup
4. **systemd conflicts** - Manual cgroup management

### Solution

**Immediate Fix:**

```bash
# Check cgroup version
# Use appropriate interface

# Fix permissions
sudo chmod 755 /sys/fs/cgroup/<path>

# Move process to correct cgroup
echo <pid> > /sys/fs/cgroup/<path>/cgroup.procs
```

**Long-term Fix:**
- Standardize on cgroup v2
- Use systemd for cgroup management
- Fix permission issues
- Document cgroup hierarchy

### Prevention

- Use cgroup v2 when available
- Let systemd manage cgroups
- Monitor cgroup operations
- Document cgroup structure

## Debugging Tools

### nsenter

```bash
# Enter all namespaces
nsenter --target <pid> --mount --uts --ipc --net --pid -- bash

# Enter specific namespace
nsenter --target <pid> --net -- bash
nsenter --target <pid> --pid -- bash
```

### cgroup Inspection

```bash
# Find process cgroup
cat /proc/<pid>/cgroup

# Inspect cgroup
systemd-cgls <cgroup-path>

# Resource usage
systemd-cgtop
```

### Container Inspection

```bash
# Docker inspect
docker inspect <container>

# Container stats
docker stats <container>

# Container logs
docker logs <container>
```

## Best Practices

1. **Set appropriate limits** - Based on workload
2. **Monitor PSI** - Early warning of pressure
3. **Use soft limits** - MemoryHigh, CPU weights
4. **Clean up namespaces** - Prevent leaks
5. **Document limits** - Know what's configured

:::tip Production Insight
Resource isolation issues often manifest as performance problems. Monitor PSI continuously and set appropriate limits based on workload characteristics.
:::

## Next Steps

You've completed Module 6! Move to [Module 7: Systemd & Service Management](../module-07-systemd/systemd-architecture).
