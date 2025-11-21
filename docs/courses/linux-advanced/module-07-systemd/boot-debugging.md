# Boot Bottlenecks & Service Failures

## Boot Time Analysis

### systemd-analyze

```bash
# Total boot time
systemd-analyze

# Time per service
systemd-analyze blame | head -20

# Critical path (slowest chain)
systemd-analyze critical-chain

# Critical path for specific service
systemd-analyze critical-chain myservice.service

# Boot graph
systemd-analyze plot > boot.svg
```

### Understanding Output

**systemd-analyze:**
```
Startup finished in 2.345s (kernel) + 5.678s (userspace) = 8.023s
```

**systemd-analyze blame:**
```
5.234s myservice.service
2.123s network-online.target
1.456s dbus.service
```

**systemd-analyze critical-chain:**
```
multi-user.target @8.023s
└─myservice.service @5.234s +2.789s
  └─network-online.target @2.445s +2.789s
    └─NetworkManager-wait-online.service @2.123s +322ms
```

## Identifying Slow Services

### Common Bottlenecks

1. **Network timeouts** - Waiting for network
2. **Slow ExecStart** - Long-running startup scripts
3. **Dependency chains** - Sequential dependencies
4. **Filesystem checks** - fsck on large filesystems
5. **Hardware initialization** - Slow device detection

### Investigation Steps

```bash
# 1. Identify slow services
systemd-analyze blame | head -10

# 2. Check service logs
journalctl -u <slow-service> -b --no-pager

# 3. Check dependencies
systemctl list-dependencies <slow-service>

# 4. Test service manually
sudo systemctl start <slow-service>
time systemctl start <slow-service>
```

## Boot Time Optimization

### Quick Wins

**Disable unnecessary services:**
```bash
# List enabled services
systemctl list-unit-files --state=enabled

# Disable service
sudo systemctl disable <service>

# Mask service (prevent enabling)
sudo systemctl mask <service>
```

**Use socket activation:**
- Services start on demand
- Reduces boot time
- Better resource usage

**Parallelize dependencies:**
- Use `Wants=` instead of `Requires=`
- Remove unnecessary `After=` dependencies
- Use `Type=notify` for faster startup

### Advanced Optimization

**Reduce filesystem checks:**
```bash
# Increase mount count before check
tune2fs -c 100 /dev/sda1

# Use fast boot option
# Add to /etc/fstab: noatime,nodiratime
```

**Optimize initramfs:**
```bash
# Remove unnecessary drivers
# Edit /etc/dracut.conf.d/
# Regenerate
dracut -f
```

**Use faster storage:**
- SSD instead of HDD
- NVMe instead of SATA
- Faster filesystem (XFS for large files)

## Debugging Failed Services

### Service Failure Symptoms

- Service in `failed` state
- `systemctl status` shows error
- Service won't start
- Boot hangs on service

### Investigation Workflow

**Step 1: Check Status**

```bash
# Detailed status
systemctl status myservice.service -l

# Show all properties
systemctl show myservice.service
```

**Step 2: Check Logs**

```bash
# Service logs
journalctl -u myservice.service -b --no-pager

# Last 100 lines
journalctl -u myservice.service -n 100

# Follow logs
journalctl -u myservice.service -f
```

**Step 3: Check Dependencies**

```bash
# Dependencies
systemctl list-dependencies myservice.service

# Why waiting
systemctl show myservice.service | grep -E "After=|Before=|Requires="
```

**Step 4: Test Manually**

```bash
# Run as service user
sudo -u myservice /usr/local/bin/myservice --config /etc/myservice.yaml

# Check permissions
ls -l /usr/local/bin/myservice
ls -l /etc/myservice.yaml

# Check environment
systemctl show -p Environment myservice.service
```

### Common Failure Causes

1. **Missing executable** - File doesn't exist
2. **Permission denied** - Wrong permissions
3. **Missing dependencies** - Libraries not found
4. **Configuration errors** - Invalid config
5. **Port already in use** - Another service using port
6. **Resource limits** - Memory/CPU limits too low

## Boot Rescue Procedures

### Emergency Mode

**Access:**
- Interrupt GRUB boot
- Edit kernel line
- Add: `systemd.unit=emergency.target`

**In Emergency Mode:**
```bash
# Mount root read-write
mount -o remount,rw /

# Check what's wrong
journalctl -xb

# Fix issues
systemctl disable <problematic-service>
systemctl mask <problematic-service>

# Reboot
reboot
```

### Rescue Mode

**Access:**
- Add to kernel line: `systemd.unit=rescue.target`

**In Rescue Mode:**
- More services available
- Network may not be up
- Can fix most issues

### Single User Mode

**Access:**
- Add to kernel line: `single`
- Or: `systemd.unit=rescue.target`

**Use Cases:**
- Password recovery
- Filesystem repair
- Service debugging

## Boot Failure Scenarios

### Scenario 1: Service Dependency Loop

**Symptoms:**
- Boot hangs
- Services waiting for each other
- Circular dependency

**Investigation:**
```bash
# Check dependencies
systemctl list-dependencies myservice.service

# Visualize graph
systemd-analyze dot myservice.service | dot -Tsvg > deps.svg
```

**Fix:**
- Break circular dependency
- Use `Wants=` instead of `Requires=`
- Remove unnecessary dependencies

### Scenario 2: Filesystem Mount Failure

**Symptoms:**
- Boot stops at mount
- `systemd-analyze` shows mount timeout
- Filesystem errors in logs

**Investigation:**
```bash
# Check mount status
systemctl status <mount-unit>

# Check filesystem
fsck -n /dev/sda1

# Check /etc/fstab
cat /etc/fstab
```

**Fix:**
- Fix filesystem: `fsck -y /dev/sda1`
- Fix /etc/fstab entry
- Use `nofail` option for non-critical mounts

### Scenario 3: Network Timeout

**Symptoms:**
- Services waiting for network
- `network-online.target` timeout
- Slow boot

**Investigation:**
```bash
# Check network service
systemctl status NetworkManager-wait-online.service

# Check network configuration
ip addr show
ip route show
```

**Fix:**
- Fix network configuration
- Increase timeout: `systemctl edit NetworkManager-wait-online.service`
- Remove network dependency if not needed

## Crash Recovery Workflow

### Step 1: Boot to Rescue

```bash
# Boot with rescue.target
# Add to kernel: systemd.unit=rescue.target
```

### Step 2: Diagnose

```bash
# Check logs
journalctl -xb

# Check failed services
systemctl --failed

# Check boot analysis
systemd-analyze blame
```

### Step 3: Fix Issues

```bash
# Disable problematic service
systemctl disable <service>

# Mask service
systemctl mask <service>

# Fix configuration
vim /etc/systemd/system/<service>.service

# Regenerate initramfs if needed
dracut -f
```

### Step 4: Reboot and Verify

```bash
# Reboot
reboot

# After boot, verify
systemctl status <service>
systemd-analyze
```

## Best Practices

1. **Monitor boot time** - Track trends
2. **Optimize dependencies** - Remove unnecessary
3. **Use socket activation** - Start on demand
4. **Set timeouts** - Prevent hanging
5. **Test boot changes** - In staging first

:::tip Production Insight
Boot time is a key metric. Fast boots mean faster recovery. Use systemd-analyze regularly to identify bottlenecks.
:::

## Next Steps

You've completed Module 7! Move to [Module 8: Observability & Troubleshooting](../module-08-observability/incident-response).
