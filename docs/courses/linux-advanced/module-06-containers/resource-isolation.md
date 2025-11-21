# Resource Isolation & Failure Scenarios

## Scenario: Container Memory Starvation

**Symptoms**
- cgroup `memory.current` near `memory.max`
- OOM killer targeting container processes

**Investigation**
```bash
cat /sys/fs/cgroup/kubepods.slice/<pod>/memory.current
journalctl -k -g "cgroup" | tail
```

**Fix**
- Increase pod/container memory limit
- Enable memory QoS (`MemoryHigh`)
- Optimize application

## Scenario: CPU Throttling

```bash
cat /sys/fs/cgroup/<slice>/cpu.stat
# Look for high throttled_usec
```

Adjust `cpu.max` or `CPUQuota`.

## Namespace Leaks

- Orphaned network namespaces: `ip netns list`
- Clean with `ip netns delete <name>`

## Debugging with nsenter

```bash
nsenter --target <pid> --mount --uts --ipc --net --pid -- bash
```

## cgroup v2 Hierarchy Tips

- Use `systemd-run --scope` to experiment quickly
- Remember `cgroup.procs` accepts PIDs only at leaf nodes

Next: [Systemd & Service Management](../module-07-systemd/systemd-architecture).
