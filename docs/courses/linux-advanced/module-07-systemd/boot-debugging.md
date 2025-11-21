# Boot Bottlenecks & Service Failures

## Boot Time Optimization

```bash
systemd-analyze blame | head -20
systemd-analyze critical-chain
```

Identify slow services, investigate `ExecStart` scripts, network timeouts.

## Debugging Failed Services

```bash
systemctl status myservice -l
journalctl -u myservice -b

# Show environment passed to unit
systemctl show -p Environment myservice
```

### strace via systemd

```bash
systemctl edit myservice.service
[Service]
ExecStart=
ExecStart=/usr/bin/strace -f -o /tmp/myservice.strace /usr/local/bin/myservice
```

## Boot Rescue

- Append `systemd.unit=rescue.target` to kernel cmdline
- Use `rd.break` to drop into initramfs shell
- Mount root read-write: `mount -o remount,rw /sysroot`

## Crash Recovery Workflow

1. Boot into rescue target
2. Check `journalctl -xb`
3. Disable failing units: `systemctl mask <unit>`
4. Regenerate initramfs if needed: `dracut -f`

Next: [Observability & Troubleshooting](../module-08-observability/incident-response).
