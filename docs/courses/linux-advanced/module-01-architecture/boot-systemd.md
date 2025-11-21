# Boot Sequence & Systemd Deep Dive

## Boot Chain

1. **Firmware (BIOS/UEFI)** – initializes hardware, loads bootloader
2. **Bootloader (GRUB)** – presents menu, loads kernel + initramfs
3. **Kernel** – initializes drivers, mounts root filesystem
4. **Init (systemd)** – PID 1, orchestrates rest of boot
5. **Targets & Units** – sockets, services, timers, devices

### Inspecting GRUB

```bash
grep "menuentry" /boot/grub2/grub.cfg

# Regenerate config after kernel updates
grub2-mkconfig -o /boot/grub2/grub.cfg
```

### initramfs Inspection

```bash
lsinitrd /boot/initramfs-$(uname -r).img | less
```

## systemd Boot Analysis

```bash
# Total boot time
systemd-analyze

# Slowest services
systemd-analyze blame | head

# Critical path visualization
systemd-analyze critical-chain
```

### unit Dependencies

```bash
# Graph dependencies of unit
systemd-analyze dot sshd.service | dot -Tpng > sshd-deps.png

# Show why unit is waiting
systemctl list-dependencies --reverse network-online.target
```

## journald Internals

- Binary journal files under `/var/log/journal/<machine-id>/`
- Structured fields (e.g., `_PID=`, `_SYSTEMD_UNIT=`)
- Persistent vs volatile storage configurable in `/etc/systemd/journald.conf`

```bash
# Configure persistent logs
sudo mkdir -p /var/log/journal
sudo systemctl restart systemd-journald

# Query logs
journalctl -b -u kubelet
journalctl _PID=1234 -o json-pretty
```

## Boot Failure Workflow

1. Drop to emergency shell (`systemd.unit=emergency.target` kernel argument)
2. Inspect journal of previous boot: `journalctl -b -1`
3. Check failed services: `systemctl --failed`
4. Use `systemctl status <unit>` for details
5. If kernel fails before systemd, boot into rescue initramfs

### Kernel Command-Line Editing

- Interrupt GRUB, edit entry (press `e`)
- Append options to `linux` line: `systemd.unit=rescue.target`, `rd.break`, `selinux=0`

## On-Call Checklist

- Keep `systemd-analyze blame` snapshots for healthy boots
- Document default target and critical dependencies
- Know how to switch default target: `systemctl set-default multi-user.target`
- Understand journald rate limiting: `RateLimitIntervalSec`, `RateLimitBurst`

Next: [Process, CPU & Scheduling Internals](../module-02-cpu/process-model).
