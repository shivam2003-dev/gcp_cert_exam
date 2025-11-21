# Container Runtime Internals

## How Docker Works Internally

### Architecture

```
Docker CLI
    ↓ (REST API)
dockerd (Docker daemon)
    ↓ (gRPC)
containerd
    ↓ (OCI runtime)
runc
    ↓ (Linux kernel)
Namespaces + cgroups
```

### Components

**Docker CLI:**
- User interface
- Communicates with dockerd via REST API
- Commands: `docker run`, `docker ps`, etc.

**dockerd:**
- Docker daemon
- Manages images, containers, networks
- REST API server
- Communicates with containerd

**containerd:**
- Container runtime
- Manages container lifecycle
- Image management
- gRPC API

**runc:**
- OCI-compliant runtime
- Creates containers using namespaces/cgroups
- Low-level container operations

### Inspecting Runtime State

```bash
# List containers via containerd
sudo ctr containers list

# List images
sudo ctr images list

# Inspect container
sudo ctr containers info <container-id>

# Inspect runc state
sudo runc list
sudo runc state <container-id>
```

## Building Containers Without Docker

### Method 1: Using unshare

```bash
# Create rootfs
sudo debootstrap --variant=minbase bookworm /srv/chroot/bookworm http://deb.debian.org/debian

# Create namespaces and chroot
sudo unshare -fpnmU --mount-proc chroot /srv/chroot/bookworm /bin/bash

# Inside container:
# - New PID namespace (PID 1)
# - New mount namespace
# - New network namespace
# - New UTS namespace
# - New user namespace
```

### Method 2: Using systemd-nspawn

```bash
# Create rootfs
sudo debootstrap bookworm /srv/chroot/bookworm

# Run container
sudo systemd-nspawn -D /srv/chroot/bookworm -b

# Options:
# -D: Directory (rootfs)
# -b: Boot systemd inside
# -M: Machine name
# --network-bridge: Bridge networking
```

### Method 3: Using runc Directly

```bash
# Create OCI bundle
mkdir -p mycontainer/rootfs
# ... populate rootfs ...

# Create config.json
runc spec
# Generates config.json

# Run container
sudo runc run mycontainer
```

## Container Filesystems

### OverlayFS

Docker uses OverlayFS for container layers:

**Structure:**
```
upperdir (writable layer)
    ↓
lowerdir (read-only layers)
    ↓
merged (combined view)
```

**Inspecting OverlayFS:**

```bash
# Find overlay mounts
mount | grep overlay

# Docker overlay directories
sudo ls /var/lib/docker/overlay2/

# Inspect layer
sudo ls /var/lib/docker/overlay2/<layer-id>/
# diff/  - upperdir (changes)
# link   - symlink to layer
# lower  - lower layers
# merged - merged view
```

### Copy-on-Write (COW)

**How it works:**
1. Base image layers are read-only
2. Container gets writable layer (upperdir)
3. Reads come from lower layers
4. Writes go to upperdir
5. Deletes create whiteout files

**Benefits:**
- Space efficient (shared layers)
- Fast container creation
- Layer caching

## Container Networking

### Network Namespaces

Each container gets its own network namespace:

```bash
# Find container network namespace
docker inspect <container> | grep NetworkMode
# Or
ip netns list
# Docker creates namespaces with long IDs

# Enter container network namespace
nsenter --net=/var/run/docker/netns/<namespace-id> -- bash
```

### Docker Network Types

**bridge (default):**
- Containers on same bridge can communicate
- Isolated from host network
- NAT for external access

**host:**
- Container uses host network
- No isolation
- Best performance

**none:**
- No networking
- Manual configuration required

**overlay:**
- Multi-host networking
- For Docker Swarm

### Inspecting Container Networks

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge

# Container network info
docker inspect <container> | jq '.[0].NetworkSettings'
```

## Container Storage

### Storage Drivers

**overlay2 (recommended):**
- Modern, efficient
- Supports many layers
- Default on most systems

**devicemapper:**
- Older, less efficient
- Requires LVM
- Legacy support

**aufs:**
- Older, deprecated
- Not in mainline kernel

### Inspecting Storage

```bash
# Docker storage info
docker system df

# Detailed info
docker system df -v

# Prune unused data
docker system prune -a
```

## Container Lifecycle

### States

1. **Created**: Container created but not started
2. **Running**: Container is running
3. **Paused**: Container paused (SIGSTOP)
4. **Restarting**: Container restarting
5. **Exited**: Container stopped
6. **Dead**: Container failed to start

### Inspecting State

```bash
# Container state
docker ps -a

# Detailed state
docker inspect <container> | jq '.[0].State'

# Container logs
docker logs <container>
docker logs -f <container>  # Follow
```

## Troubleshooting Containers

### Container Won't Start

```bash
# Check logs
docker logs <container>

# Inspect container
docker inspect <container>

# Check events
docker events

# Run with interactive shell
docker run -it <image> /bin/bash
```

### Container Performance Issues

```bash
# Container stats
docker stats

# Per-container stats
docker stats <container>

# Inspect resource limits
docker inspect <container> | jq '.[0].HostConfig'

# Check cgroup
docker inspect <container> | jq '.[0].HostConfig.CgroupParent'
systemd-cgls <cgroup-path>
```

### Network Issues

```bash
# Test connectivity
docker exec <container> ping <host>

# Check DNS
docker exec <container> nslookup <domain>

# Inspect network
docker network inspect <network>

# Enter network namespace
nsenter --net=/var/run/docker/netns/<id> -- bash
```

### Storage Issues

```bash
# Check disk usage
docker system df

# Find large containers
docker ps -s

# Inspect volumes
docker volume ls
docker volume inspect <volume>
```

## Container Security

### Capabilities

```bash
# Drop all capabilities
docker run --cap-drop=ALL <image>

# Add specific capability
docker run --cap-add=NET_ADMIN <image>

# Check capabilities
docker inspect <container> | jq '.[0].HostConfig.CapAdd'
```

### User Namespaces

```bash
# Run as specific user
docker run -u 1000:1000 <image>

# User namespace remapping
# Configure in /etc/docker/daemon.json
{
  "userns-remap": "default"
}
```

### Read-only Root Filesystem

```bash
# Read-only root
docker run --read-only <image>

# With tmpfs for writable areas
docker run --read-only --tmpfs /tmp <image>
```

## Best Practices

1. **Use overlay2** - Best storage driver
2. **Set resource limits** - Prevent resource exhaustion
3. **Use read-only root** - When possible, for security
4. **Drop capabilities** - Principle of least privilege
5. **Monitor containers** - Use docker stats, logs

:::tip Production Insight
Understanding container internals helps you troubleshoot issues. Containers are just processes with namespaces and cgroups. Use standard Linux tools to debug them.
:::

## Next Steps

Continue to [Resource Isolation & Failure Scenarios](./resource-isolation) for troubleshooting container resource issues.
