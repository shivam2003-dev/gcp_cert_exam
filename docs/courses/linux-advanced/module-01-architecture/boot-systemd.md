# Boot Sequence & Systemd Deep Dive

## Complete Boot Process

### Phase 1: Firmware (BIOS/UEFI)

**BIOS (Legacy):**
- Power-on self-test (POST)
- Initialize hardware
- Load boot sector from MBR

**UEFI (Modern):**
- More sophisticated firmware
- EFI System Partition (ESP)
- Secure Boot support

```bash
# Check boot mode
[ -d /sys/firmware/efi ] && echo "UEFI" || echo "BIOS"

# View EFI variables
efibootmgr -v
```

### Phase 2: Bootloader (GRUB)

GRUB (Grand Unified Bootloader) responsibilities:

1. **Display boot menu**
2. **Load kernel image**
3. **Load initramfs**
4. **Pass kernel parameters**
5. **Transfer control to kernel**

```bash
# GRUB configuration
cat /boot/grub2/grub.cfg | head -50

# Kernel parameters
cat /proc/cmdline

# Edit GRUB (temporary)
# Press 'e' in GRUB menu
```

### Phase 3: Kernel Initialization

Kernel boot sequence:

1. **Early initialization**
   - CPU setup
   - Memory detection
   - Early console

2. **Hardware detection**
   - PCI enumeration
   - Device discovery
   - Driver loading

3. **Filesystem initialization**
   - Mount root filesystem
   - Load initramfs if needed

4. **Init process launch**
   - Start PID 1 (systemd)

```bash
# Kernel messages
dmesg | head -100

# Kernel version
uname -a

# Kernel modules loaded
lsmod
```

### Phase 4: Initramfs

**Purpose:**
- Contains drivers needed to mount root
- Provides rescue shell
- Handles encrypted root

```bash
# List initramfs contents
lsinitrd /boot/initramfs-$(uname -r).img | head

# Extract initramfs
mkdir /tmp/initramfs
cd /tmp/initramfs
zcat /boot/initramfs-$(uname -r).img | cpio -idmv
```

### Phase 5: systemd (PID 1)

systemd takes over and orchestrates boot:

1. **Early boot targets**
2. **Service activation**
3. **Socket activation**
4. **Target units**

## systemd Architecture

### Core Components

**systemd (PID 1):**
- Service manager
- Process supervision
- Dependency management

**systemd-logind:**
- Session management
- User login tracking
- Power management

**systemd-journald:**
- Centralized logging
- Structured logs
- Log rotation

**systemd-networkd (optional):**
- Network configuration
- DHCP client
- Link management

**systemd-resolved (optional):**
- DNS resolution
- LLMNR/mDNS

### systemd Design Principles

1. **Parallelization**: Services start in parallel when possible
2. **Socket activation**: Services start on demand
3. **Dependency management**: Automatic ordering
4. **Cgroup integration**: Resource management
5. **State tracking**: Knows service state

## systemd Targets

Targets are collections of units (like runlevels):

```bash
# List targets
systemctl list-units --type=target

# Current target
systemctl get-default

# Switch target
systemctl isolate multi-user.target

# Set default
systemctl set-default multi-user.target
```

### Common Targets

- **poweroff.target**: System shutdown
- **rescue.target**: Single-user mode
- **multi-user.target**: Multi-user without GUI
- **graphical.target**: Multi-user with GUI
- **reboot.target**: System reboot

## Unit Types

### Service Units

```ini
[Unit]
Description=My Service
After=network-online.target
Requires=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/myservice
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Socket Units

Activate services on connection:

```ini
[Socket]
ListenStream=8080
Accept=yes

[Install]
WantedBy=sockets.target
```

### Timer Units

Cron-like scheduling:

```ini
[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

## Boot Time Analysis

### systemd-analyze

```bash
# Total boot time
systemd-analyze

# Time per service
systemd-analyze blame | head -20

# Critical path
systemd-analyze critical-chain

# Dependency graph
systemd-analyze dot multi-user.target | dot -Tsvg > boot.svg
```

### Identifying Slow Services

```bash
# Services taking longest
systemd-analyze blame | head -10

# Check service logs
journalctl -u <slow-service> -b --no-pager

# Service startup time
systemctl show <service> -p ExecMainStartTimestamp
```

## journald Internals

### Journal Storage

```bash
# Journal location
ls -lh /var/log/journal/

# Journal configuration
cat /etc/systemd/journald.conf

# Make persistent
mkdir -p /var/log/journal
systemctl restart systemd-journald
```

### Querying Logs

```bash
# By unit
journalctl -u myservice

# By priority
journalctl -p err

# By time
journalctl --since "1 hour ago"
journalctl --since "2024-01-15 10:00:00" --until "2024-01-15 11:00:00"

# By PID
journalctl _PID=1234

# By executable
journalctl /usr/bin/myservice

# Kernel messages
journalctl -k

# Previous boot
journalctl -b -1
```

### Log Rotation

```bash
# Journal size limits
cat /etc/systemd/journald.conf | grep -E "SystemMaxUse|SystemKeepFree"

# Manual rotation
journalctl --rotate
```

## Boot Failure Scenarios

### Scenario 1: Kernel Panic During Boot

**Symptoms:**
- Boot stops with kernel panic message
- No systemd start

**Investigation:**
```bash
# Boot with older kernel
# Edit GRUB, select previous kernel

# Check kernel logs
dmesg | grep -i panic

# Check hardware
journalctl -k | grep -i error
```

**Fix:**
- Boot with previous kernel
- Update kernel or drivers
- Check hardware (memory, disk)

### Scenario 2: systemd Fails to Start

**Symptoms:**
- Kernel loads but systemd doesn't start
- Hangs at boot

**Investigation:**
```bash
# Boot to emergency shell
# Add to kernel cmdline: systemd.unit=emergency.target

# Check systemd logs
journalctl -b -1 | grep systemd

# Check for failed units
systemctl --failed
```

**Fix:**
- Disable problematic units
- Check filesystem integrity
- Verify systemd binary

### Scenario 3: Service Dependency Loop

**Symptoms:**
- Services fail to start
- Dependency errors in logs

**Investigation:**
```bash
# Check dependencies
systemctl list-dependencies <service>

# Visualize graph
systemd-analyze dot <service> | dot -Tsvg > deps.svg
```

**Fix:**
- Break circular dependency
- Use `Wants=` instead of `Requires=`
- Adjust `Before=`/`After=` directives

## Boot Optimization

### Reduce Boot Time

1. **Disable unnecessary services**
   ```bash
   systemctl disable <service>
   ```

2. **Use socket activation**
   - Services start on demand

3. **Parallelize startup**
   - systemd does this automatically

4. **Optimize initramfs**
   - Remove unnecessary drivers

5. **Use faster storage**
   - SSD instead of HDD

### Boot Time Targets

- **Desktop**: < 30 seconds
- **Server**: < 15 seconds
- **Embedded**: < 10 seconds

## Emergency and Rescue Modes

### Emergency Mode

```bash
# Boot to emergency
# Add to kernel cmdline: systemd.unit=emergency.target

# Mount root read-write
mount -o remount,rw /
```

### Rescue Mode

```bash
# Boot to rescue
# Add to kernel cmdline: systemd.unit=rescue.target

# Full system available
# Network may not be up
```

### Single User Mode

```bash
# Boot to single user
# Add to kernel cmdline: systemd.unit=rescue.target

# Or from GRUB
# Add 'single' to kernel line
```

## Best Practices

1. **Monitor boot time** - Track trends
2. **Document custom units** - Know what you've added
3. **Test boot changes** - In staging first
4. **Keep journal persistent** - For debugging
5. **Understand dependencies** - Before modifying units

:::tip Production Insight
Boot time is a key metric. Fast boots mean faster recovery from failures. Use systemd-analyze regularly to identify bottlenecks.
:::

## Next Steps

You've completed Module 1! Move to [Module 2: Process, CPU & Scheduling Internals](../module-02-cpu/process-model).
