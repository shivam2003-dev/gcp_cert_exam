# Unit Files, journald & Debugging

## Unit File Locations

### System Units

- `/etc/systemd/system/` - System administrator units
- `/usr/lib/systemd/system/` - Package-provided units
- `/run/systemd/system/` - Runtime units

### User Units

- `~/.config/systemd/user/` - User units
- `/etc/systemd/user/` - System-wide user units

### Priority

1. `/etc/systemd/system/` (highest)
2. `/run/systemd/system/`
3. `/usr/lib/systemd/system/` (lowest)

## Unit File Anatomy

### Complete Example

```ini
[Unit]
Description=My Custom Service
Documentation=https://example.com/docs
After=network-online.target
Wants=network-online.target
Requires=db.service
Before=web.service

[Service]
Type=notify
ExecStart=/usr/local/bin/myservice --config /etc/myservice.yaml
ExecStartPre=/usr/bin/prepare-service.sh
ExecStartPost=/usr/bin/post-start.sh
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/bin/kill -TERM $MAINPID
Restart=on-failure
RestartSec=5
TimeoutStartSec=30
TimeoutStopSec=10

# Resource limits
LimitNOFILE=131072
LimitNPROC=4096
MemoryMax=2G
CPUQuota=100%

# Security
User=myservice
Group=myservice
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
NoNewPrivileges=yes
CapabilityBoundingSet=CAP_NET_BIND_SERVICE

# Environment
Environment="VAR1=value1"
EnvironmentFile=-/etc/myservice/env
# - prefix = ignore if file doesn't exist

OOMScoreAdjust=-500

[Install]
WantedBy=multi-user.target
```

### [Unit] Section

**Description:**
- Human-readable description
- Shown in `systemctl status`

**Documentation:**
- URL to documentation
- Shown in `systemctl status`

**Dependencies:**
- `After=`: Start after these units
- `Before=`: Start before these units
- `Requires=`: Strong dependency
- `Wants=`: Weak dependency
- `Requisite=`: Required but doesn't start

**Conflicts:**
- `Conflicts=`: Units that conflict

### [Service] Section

**Type:**
- `simple`: Default, service runs in foreground
- `forking`: Service forks, parent exits
- `oneshot`: Runs once and exits
- `notify`: Service sends notification when ready
- `dbus`: Service registers on D-Bus

**ExecStart:**
- Command to start service
- Can specify multiple (executed sequentially)
- Use `-` prefix to ignore errors

**ExecStartPre/ExecStartPost:**
- Commands before/after ExecStart
- Multiple allowed

**ExecReload:**
- Command to reload service
- Default: `kill -HUP $MAINPID`

**ExecStop:**
- Command to stop service
- Default: `kill -TERM $MAINPID`

**Restart:**
- `no`: Don't restart
- `on-success`: Restart on success
- `on-failure`: Restart on failure
- `on-abnormal`: Restart on abnormal exit
- `on-watchdog`: Restart on watchdog timeout
- `on-abort`: Restart on abort
- `always`: Always restart

**RestartSec:**
- Seconds to wait before restart

**TimeoutStartSec/TimeoutStopSec:**
- Timeout for start/stop

### [Install] Section

**WantedBy:**
- Target that wants this unit
- Creates symlink when enabled

**RequiredBy:**
- Target that requires this unit

**Also:**
- Units to enable/disable together

## Creating and Editing Units

### Creating New Unit

```bash
# Create unit file
sudo vim /etc/systemd/system/myservice.service

# Reload systemd
sudo systemctl daemon-reload

# Enable and start
sudo systemctl enable myservice.service
sudo systemctl start myservice.service
```

### Editing Units

```bash
# Edit unit (creates override)
sudo systemctl edit myservice.service
# Creates: /etc/systemd/system/myservice.service.d/override.conf

# Edit full unit
sudo systemctl edit --full myservice.service

# View unit
systemctl cat myservice.service
```

### Override Files

```bash
# Create override
sudo systemctl edit myservice.service

# Override example:
[Service]
Environment="DEBUG=1"
MemoryMax=4G
```

## journald Deep Dive

### Journal Storage

**Locations:**
- `/var/log/journal/` - Persistent (if exists)
- `/run/log/journal/` - Volatile (if persistent doesn't exist)

**Configuration:**
```bash
# /etc/systemd/journald.conf
[Journal]
Storage=persistent
# Options: volatile, persistent, auto, none

SystemMaxUse=1G
SystemKeepFree=500M
SystemMaxFiles=100
```

### Querying Logs

```bash
# By unit
journalctl -u myservice.service

# By priority
journalctl -p err
journalctl -p warning

# By time
journalctl --since "1 hour ago"
journalctl --since "2024-01-15 10:00:00"
journalctl --since today
journalctl --since yesterday

# By PID
journalctl _PID=1234

# By executable
journalctl /usr/bin/myservice

# Kernel messages
journalctl -k

# Previous boot
journalctl -b -1

# Follow logs
journalctl -u myservice.service -f

# Last N lines
journalctl -u myservice.service -n 100

# Output format
journalctl -u myservice.service -o json-pretty
journalctl -u myservice.service -o verbose
```

### Log Filtering

```bash
# Grep in logs
journalctl -u myservice.service | grep ERROR

# Using journalctl grep
journalctl -u myservice.service --grep="ERROR"

# Multiple units
journalctl -u service1.service -u service2.service

# Exclude units
journalctl --exclude-unit=noisy.service
```

## Crash Recovery

### Core Dumps

```bash
# List core dumps
coredumpctl list

# Info about core dump
coredumpctl info <PID>

# Open in GDB
coredumpctl gdb <PID>

# Dump core
coredumpctl dump <PID> > core.dump
```

### Core Dump Configuration

```bash
# /etc/systemd/coredump.conf
[Coredump]
Storage=external
# Options: none, external, journal

MaxUse=10G
KeepFree=5G
```

## Dependency Debugging

### Finding Dependencies

```bash
# Forward dependencies
systemctl list-dependencies myservice.service

# Reverse dependencies
systemctl list-dependencies --reverse myservice.service

# Why unit is waiting
systemctl show myservice.service | grep -E "After=|Before=|Requires="
```

### Dependency Graph

```bash
# Generate graph
systemd-analyze dot myservice.service | dot -Tsvg > deps.svg

# View in browser
xdg-open deps.svg
```

## Service Debugging

### Checking Service Status

```bash
# Detailed status
systemctl status myservice.service -l

# Show all properties
systemctl show myservice.service

# Show specific property
systemctl show -p ExecStart myservice.service
systemctl show -p Environment myservice.service
```

### Debugging Failed Services

```bash
# Check why service failed
systemctl status myservice.service

# View logs
journalctl -u myservice.service -b --no-pager

# Check dependencies
systemctl list-dependencies myservice.service

# Test service manually
sudo -u myservice /usr/local/bin/myservice --config /etc/myservice.yaml
```

### Using strace

```bash
# Edit unit to use strace
sudo systemctl edit myservice.service

# Add:
[Service]
ExecStart=
ExecStart=/usr/bin/strace -f -o /tmp/myservice.strace /usr/local/bin/myservice

# Reload and start
sudo systemctl daemon-reload
sudo systemctl restart myservice.service

# Analyze trace
cat /tmp/myservice.strace | grep -E "open|read|write"
```

## Best Practices

1. **Use Type=notify** - For services that support it
2. **Set timeouts** - Prevent hanging services
3. **Use Restart=on-failure** - Automatic recovery
4. **Set resource limits** - Prevent resource exhaustion
5. **Document units** - Add Description and Documentation

:::tip Production Insight
Unit files are the foundation of service management. Understanding all options helps you create robust, production-ready services.
:::

## Next Steps

Continue to [Boot Bottlenecks & Service Failures](./boot-debugging) for boot optimization and failure recovery.
