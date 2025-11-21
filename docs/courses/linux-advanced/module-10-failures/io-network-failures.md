# Failure Scenarios: Disk, Inode & Network Outages

## Disk Full / Inode Exhaustion

### Symptoms
- Writes fail with `ENOSPC`
- `df -h` or `df -i` shows 100%

### Investigation
```bash
df -h
df -i
sudo du -shx /* | sort -h | tail
```

### Fix
- Rotate/compress logs
- Move artifacts to other volumes
- Delete orphaned containers/images
- For inode exhaustion, reformat with higher inode density

## Broken Init / Boot Failure

1. Boot into rescue target (`systemd.unit=rescue.target`)
2. Mount root FS, chroot
3. Reinstall bootloader, regenerate initramfs

```bash
mount /dev/sda2 /mnt
mount --bind /proc /mnt/proc
chroot /mnt
grub2-install /dev/sda
dracut -f
```

## Network Outage Analysis

### Symptoms
- Elevated retransmissions
- Services unreachable

### Investigation
```bash
ping -c3 <gateway>
traceroute <service>
ss -tn state established '( dport = :443 )'
tcpdump -ni eth0 'tcp[tcpflags] & tcp-syn != 0'
```

### Fix
- Restart network services or apply `ip link set eth0 down/up`
- Reroute traffic, failover to secondary NIC
- Coordinate with network team for upstream issues

## CPU & IO Saturation Incidents

- Use `top`, `iostat`, `sar -q`
- Identify noisy neighbors and throttle via cgroups
- For IO, move workloads to faster storage or batch writes

## Prevention
- Disk quota monitoring
- Automated log rotation
- Network redundancy (bonding, multipath)
- Capacity planning based on historical trends
