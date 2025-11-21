# Failure Scenario: Kernel Panic Analysis

## Overview

Kernel panics are catastrophic failures where the Linux kernel cannot continue operating. Understanding how to diagnose and recover from kernel panics is critical for production systems.

## Symptoms

### Observable Symptoms

- **Console shows panic message** - Stack trace visible
- **System reboots unexpectedly** - Automatic reboot (if configured)
- **No response** - System completely frozen
- **vmcore file created** - If kdump enabled, in `/var/crash/`

### Panic Message Format

```
Kernel panic - not syncing: Fatal exception
CPU: 0 PID: 1234 Comm: process_name
Call Trace:
 [<ffffffff81234567>] function_name+0x123/0x456
 [<ffffffff81234568>] another_function+0x78/0x90
 ...
```

## Investigation Steps

### Step 1: Collect Logs

```bash
# Previous boot kernel messages
journalctl -b -1 -k | tail -100

# All kernel messages from previous boot
journalctl -k -b -1

# Search for panic
journalctl -k | grep -i panic

# Search for oops
journalctl -k | grep -i oops
```

### Step 2: Analyze vmcore (if available)

**Check for vmcore:**
```bash
# List crash dumps
ls -lh /var/crash/

# Check kdump status
systemctl status kdump
```

**Analyze with crash utility:**
```bash
# Install crash utility
apt-get install crash linux-crashdump

# Analyze vmcore
crash /usr/lib/debug/lib/modules/$(uname -r)/vmlinux /var/crash/vmcore

# Inside crash:
crash> bt        # Backtrace
crash> ps        # Process list
crash> log       # Kernel log
crash> kmem -i   # Memory info
crash> mod       # Loaded modules
crash> exit      # Exit
```

### Step 3: Identify Offending Module

**From panic message:**
- Look at stack trace
- Identify function names
- Match to kernel modules

**From vmcore:**
```bash
crash> mod
# Lists loaded modules
# Find module in stack trace
```

**Check taint flags:**
```bash
# In crash
crash> log | grep taint

# Or in dmesg
dmesg | grep taint
```

**Taint flags:**
- `P` - Proprietary module loaded
- `F` - Module force loaded
- `S` - SMP with non-SMP kernel
- `R` - Module force unloaded
- `M` - Machine check error
- `B` - Bad page
- `U` - Unsupported userland
- `D` - Kernel died
- `A` - ACPI table overridden
- `W` - Warning issued
- `C` - Staging driver loaded
- `I` - Workaround for bug
- `O` - Out-of-tree module
- `E` - Unsigned module
- `L` - Soft lockup
- `K` - Kernel live patched

### Step 4: Check Hardware

**IPMI/BMC Logs:**
```bash
# HP iLO
hponcfg -g

# Dell iDRAC
racadm getsel

# Generic IPMI
ipmitool sel list
ipmitool sel elist
```

**Memory Errors:**
```bash
# Check for ECC errors
dmesg | grep -i "ecc\|memory\|mce"

# Check /var/log/mcelog (if available)
cat /var/log/mcelog
```

**Hardware Diagnostics:**
```bash
# Run vendor diagnostics
# HP: hplog, hpadu
# Dell: dell-bios-fan-control, dell-bios-network
```

## Root Cause Analysis

### Common Causes

**1. Hardware Failure:**
- Bad RAM (memory errors)
- Failing CPU
- Storage controller issues
- Power supply problems

**2. Kernel Bugs:**
- Driver bugs
- Kernel code bugs
- Race conditions

**3. Corrupted Data:**
- Filesystem corruption
- Memory corruption
- Kernel data structure corruption

**4. Resource Exhaustion:**
- Out of memory (OOM)
- Stack overflow
- Too many processes

**5. Incompatible Hardware/Drivers:**
- Unsupported hardware
- Buggy drivers
- Firmware issues

## Fix Procedures

### Immediate Fix

**Option 1: Boot Previous Kernel**

```bash
# In GRUB, select previous kernel
# Boot and verify system works
# Investigate panic in previous kernel
```

**Option 2: Disable Problematic Module**

```bash
# Blacklist module
echo "blacklist problematic_module" >> /etc/modprobe.d/blacklist.conf

# Rebuild initramfs
update-initramfs -u

# Reboot
reboot
```

**Option 3: Update Kernel/Drivers**

```bash
# Update kernel
apt-get update
apt-get install linux-image-$(uname -r)

# Or update specific driver
apt-get install --reinstall <driver-package>

# Reboot
reboot
```

### Long-term Fix

**For Hardware Issues:**
- Replace failing hardware
- Update firmware
- Run extended diagnostics

**For Software Issues:**
- Update kernel
- Update drivers
- Apply patches
- Report bugs to kernel developers

## kdump Configuration

### Enable kdump

```bash
# Install kdump
apt-get install linux-crashdump

# Configure crash kernel
# Edit /etc/default/grub.d/kdump-tools.cfg
# Add: crashkernel=512M

# Update GRUB
update-grub

# Enable service
systemctl enable kdump
systemctl start kdump
```

### kdump Configuration

```bash
# /etc/default/kdump-tools
USE_KDUMP=1
KDUMP_SYSCTL="kernel.panic_on_oops=1"
```

### Test kdump

```bash
# Trigger crash (careful!)
echo c > /proc/sysrq-trigger

# Check for vmcore
ls -lh /var/crash/
```

## Prevention

### Kernel Updates

```bash
# Keep kernel updated
apt-get update
apt-get upgrade linux-image-$(uname -r)

# Test updates in staging
```

### Hardware Monitoring

```bash
# Monitor hardware health
# Use smartd for disks
systemctl enable smartd
systemctl start smartd

# Use IPMI for server health
# Set up monitoring alerts
```

### Enable kdump

Always enable kdump on production systems for post-mortem analysis.

### Regular Testing

```bash
# Test recovery procedures
# Practice analyzing vmcores
# Document procedures
```

## Best Practices

1. **Enable kdump** - Essential for debugging
2. **Monitor hardware** - Catch failures early
3. **Keep updated** - Latest stable kernel
4. **Test updates** - In staging first
5. **Document procedures** - For on-call engineers

:::warning Production Warning
Kernel panics indicate serious issues. Always investigate root cause. Don't just reboot and hope it doesn't happen again.
:::

## Next Steps

Continue to [OOM Kill Storm](./oom-storms) for memory-related failure scenarios.
