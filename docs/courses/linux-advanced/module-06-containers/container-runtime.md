# Container Runtime Internals

## How Docker Works Internally

1. Docker CLI talks to dockerd via REST API
2. dockerd uses containerd
3. containerd spawns runc
4. runc creates container by configuring namespaces/cgroups

```
docker → containerd → runc → Linux kernel
```

### Inspecting Runtime State

```bash
# List containers via containerd
ctr containers list

# Inspect runc state
sudo runc list
sudo runc state <container-id>
```

## Building Containers Without Docker

```bash
# Create rootfs
debootstrap --variant=minbase bookworm /srv/chroot/bookworm http://deb.debian.org/debian

# Run with unshare
sudo unshare -fpnmU --mount-proc chroot /srv/chroot/bookworm /bin/bash
```

### systemd-nspawn

```bash
sudo systemd-nspawn -D /srv/chroot/bookworm -b
```

## Container Filesystems

- OverlayFS layers (lowerdir, upperdir, workdir)
- Copy-on-write semantics

```bash
mount | grep overlay
sudo ls /var/lib/docker/overlay2 | head
```

## Troubleshooting Containers

- Inspect logs: `journalctl -u docker`, `containerd`, `kubelet`
- Check cgroup assignments: `systemd-cgls /sys/fs/cgroup/system.slice/docker.service`
- Debug namespace by entering container: `nsenter --target <pid> --mount --uts --ipc --net --pid`

Next: [Resource Isolation Failures](./resource-isolation).
