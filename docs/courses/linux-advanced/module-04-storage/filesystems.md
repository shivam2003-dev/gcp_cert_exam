# Filesystems & Journaling

## ext4 vs XFS vs Btrfs

| Feature | ext4 | XFS | Btrfs |
|---------|------|-----|-------|
| Maturity | Very stable | Very stable | Mature but complex |
| Max file | 16TB | 8EB | 16EB |
| Journaling | Ordered/writeback/data | Metadata | Copy-on-write |
| Best for | General purpose | Large files, parallel workloads | Snapshot-heavy, dev |

## Journaling Modes (ext4)

```bash
# Check mode
tune2fs -l /dev/sda1 | grep 'Journal'
```

- `ordered` (default): metadata journaled, data flushed before commit
- `writeback`: metadata journaled, data may be after commit
- `data=journal`: data + metadata journaled (slow, safest)

## Filesystem Tools

### fsck

```bash
# Check ext4
e2fsck -f /dev/sda1

# Check XFS
xfs_repair -n /dev/sdb1   # -n for dry-run
```

### Mount Options

```bash
UUID=... /data ext4 defaults,noatime,nodiratime 0 2
UUID=... /logs xfs defaults,noatime,logbsize=256k 0 2
```

## Diagnosing Filesystem Issues

### Corruption Signs
- `EXT4-fs error` in dmesg
- `XFS (dm-0): Metadata corruption` messages

```bash
journalctl -k -g 'EXT4'
```

### Recovery Workflow

1. Mount read-only if corruption suspected
2. Take block-level backup (dd, snapshots)
3. Run fsck/xfs_repair
4. Restore from backup if needed

### Inode Exhaustion

```bash
# Check inode usage
df -i
```

Fix by cleaning small files, increasing inode count when formatting (`mkfs -N`).

## IO Latency Debugging

```bash
# Per-device latency
iostat -x 1 | awk '{print $1,$10,$11}'

# Per-process latency
pidstat -d 1 5
```

Next: [Storage Failure Scenarios & Recovery](./io-troubleshooting).
