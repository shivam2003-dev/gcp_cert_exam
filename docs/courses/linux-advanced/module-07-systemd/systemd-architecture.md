# systemd Architecture

## Overview

systemd is the modern init system and service manager for Linux. Understanding its architecture is essential for managing services, debugging boot issues, and optimizing system performance.

## Core Components

### systemd (PID 1)

**Responsibilities:**
- Process supervision
- Service management
- Dependency resolution
- cgroup management
- Socket activation

**Key Features:**
- Parallel service startup
- Dependency management
- Automatic restarts
- Resource limits via cgroups

### systemd-logind

**Responsibilities:**
- Session management
- User login tracking
- Power management
- Seat management

**Key Features:**
- Tracks user sessions
- Handles suspend/resume
- Manages idle sessions

### systemd-journald

**Responsibilities:**
- Centralized logging
- Structured logs
- Log rotation
- Log forwarding

**Key Features:**
- Binary journal format
- Structured fields
- Persistent storage
- Forwarding to syslog

### systemd-networkd (Optional)

**Responsibilities:**
- Network configuration
- Link management
- DHCP client
- Static IP configuration

### systemd-resolved (Optional)

**Responsibilities:**
- DNS resolution
- LLMNR/mDNS
- DNS caching
- DNSSEC validation

## Unit Types

### Service Units

Manage long-running processes:

```bash
# List services
systemctl list-units --type=service

# Service states
systemctl list-units --type=service --state=running
systemctl list-units --type=service --state=failed
```

### Socket Units

Socket units enable on-demand service activation. Instead of services running continuously, they start only when a connection arrives.

```bash
# List sockets - see all socket units
systemctl list-units --type=socket
```

:::important Socket Activation Benefits
Socket activation provides:
- **Resource efficiency**: Services only run when needed
- **Faster boot**: Services don't need to start at boot
- **Automatic restart**: If service crashes, socket remains active
- **Parallel startup**: Multiple services can start simultaneously

This is how systemd achieves fast boot times - services start on demand rather than all at boot.
:::

```bash
# Socket activation
# Service starts when socket receives connection
```

:::tip How Socket Activation Works
1. systemd creates and listens on the socket
2. When a connection arrives, systemd accepts it
3. systemd starts the associated service
4. systemd hands the socket to the service
5. Service handles the connection

The client doesn't notice any delay - the connection is queued until the service is ready.
:::

### Target Units

Group other units (like runlevels):

```bash
# List targets
systemctl list-units --type=target

# Common targets:
# - multi-user.target
# - graphical.target
# - rescue.target
# - emergency.target
```

### Timer Units

Cron-like scheduling:

```bash
# List timers
systemctl list-units --type=timer

# Timer states
systemctl list-timers
```

### Other Unit Types

- **device**: Device units
- **mount**: Filesystem mounts
- **automount**: Auto-mounting
- **swap**: Swap devices
- **slice**: cgroup slices
- **scope**: Transient units

## Targets (Runlevels)

### Common Targets

**multi-user.target:**
- Multi-user without GUI
- Equivalent to runlevel 3

**graphical.target:**
- Multi-user with GUI
- Equivalent to runlevel 5

**rescue.target:**
- Single-user mode
- Minimal services

**emergency.target:**
- Emergency shell
- Very minimal

**shutdown.target:**
- System shutdown

**reboot.target:**
- System reboot

### Target Management

```bash
# Current target
systemctl get-default

# Set default target
systemctl set-default multi-user.target

# Switch target
systemctl isolate multi-user.target

# List target dependencies
systemctl list-dependencies multi-user.target
```

## Dependency Management

### Dependency Types

**Requires:**
- Strong dependency
- If dependency fails, unit fails

**Wants:**
- Weak dependency
- Unit starts even if dependency fails

**Requisite:**
- Required but doesn't start dependency
- Fails if dependency not running

**After:**
- Start after dependency
- Doesn't create dependency

**Before:**
- Start before dependency
- Reverse of After

### Inspecting Dependencies

```bash
# Forward dependencies
systemctl list-dependencies myservice.service

# Reverse dependencies
systemctl list-dependencies --reverse myservice.service

# Dependency graph
systemd-analyze dot myservice.service | dot -Tsvg > deps.svg
```

## cgroup Integration

### Automatic cgroup Management

systemd automatically creates cgroups for units:

```bash
# View cgroup hierarchy
systemd-cgls

# Resource usage
systemd-cgtop

# Per-unit cgroup
systemd-cgls /system.slice/myservice.service
```

### Resource Controls

```bash
# Memory limit
systemctl set-property myservice.service MemoryMax=1G

# CPU limit
systemctl set-property myservice.service CPUQuota=50%

# I/O limit
systemctl set-property myservice.service IOWeight=100

# View properties
systemctl show myservice.service | grep -E "Memory|CPU|IO"
```

## Socket Activation

### How It Works

1. Socket unit listens on port
2. Connection arrives
3. systemd starts service
4. Service handles connection
5. Service can exit or stay running

### Example

```ini
# /etc/systemd/system/mysocket.socket
[Socket]
ListenStream=8080
Accept=yes

[Install]
WantedBy=sockets.target
```

```ini
# /etc/systemd/system/myservice.service
[Unit]
Requires=mysocket.socket

[Service]
ExecStart=/usr/bin/myservice
```

## Best Practices

1. **Use targets** - Group related services
2. **Set dependencies** - Ensure correct order
3. **Use socket activation** - Start services on demand
4. **Set resource limits** - Prevent resource exhaustion
5. **Monitor services** - Use systemctl status

:::tip Production Insight
systemd's dependency management and parallel startup significantly improve boot times. Understanding dependencies helps you debug service failures.
:::

## Next Steps

Continue to [Unit Files & Journald](./unit-files) to learn about unit file configuration and logging.
