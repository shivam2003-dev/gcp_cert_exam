# Namespaces & cgroups Internals

## Namespaces

| Namespace | Isolates | Tools |
|-----------|----------|-------|
| `mnt` | Mount points | `unshare -m`, `mount` |
| `pid` | Process IDs | `unshare -p`, `nsenter -t <pid> -p` |
| `net` | Network devices | `ip netns add` |
| `uts` | Hostname/domain | `hostname` |
| `ipc` | System V IPC | `ipcs` |
| `user` | UIDs/GIDs | `unshare -U` |
|

### Creating Namespace Sandbox

```bash
sudo unshare --mount --uts --ipc --net --pid --fork /bin/bash
mount --make-rprivate /
```

## cgroups v1 vs v2

- v1: multiple hierarchies per controller
- v2: unified hierarchy, better delegation

```bash
mount -t cgroup2 none /sys/fs/cgroup
find /sys/fs/cgroup -maxdepth 2 -type f
```

### cgroup Controllers

- CPU: `cpu.max`, `cpu.weight`
- Memory: `memory.max`, `memory.swap.max`
- IO: `io.max`, `io.weight`

```bash
# Create cgroup
echo $$ | sudo tee /sys/fs/cgroup/my.slice/cgroup.procs
sudo bash -c 'echo "50000 100000" > /sys/fs/cgroup/my.slice/cpu.max'
```

## Debugging Resource Isolation

```bash
# Inspect systemd-managed cgroups
systemd-cgls
systemd-cgtop

# Show memory usage
cat /sys/fs/cgroup/system.slice/myservice.service/memory.current
```

## PSI (Pressure Stall Information)

```bash
cat /proc/pressure/memory
cat /proc/pressure/io
```

Use PSI alerts for early warning of resource exhaustion.

Next: [Container Runtime Internals](./container-runtime).
