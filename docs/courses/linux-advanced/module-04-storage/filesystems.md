# Filesystems & Journaling

## Filesystem Overview

Linux supports many filesystems, each optimized for different use cases. Understanding filesystem internals is essential for performance tuning and recovery.

## Common Filesystems

### ext4

**Characteristics:**
- Default on most Linux distributions
- Journaled filesystem
- Maximum file size: 16TB
- Maximum filesystem size: 1EB

**Best for:**
- General purpose
- Desktop systems
- Most server workloads

### XFS

**Characteristics:**
- High-performance filesystem
- Excellent for large files
- Maximum file size: 8EB
- Maximum filesystem size: 8EB

**Best for:**
- Large files
- High I/O workloads
- Database systems

### Btrfs

**Characteristics:**
- Copy-on-write (COW)
- Built-in snapshots
- Compression
- RAID support

**Best for:**
- Systems needing snapshots
- Development environments
- Backup systems

### ZFS (via ZFS on Linux)

**Characteristics:**
- Advanced features
- Built-in compression
- Snapshots and clones
- RAID-Z

**Best for:**
- Enterprise storage
- Backup systems
- High-reliability requirements

## Filesystem Structure

### ext4 Layout

```
Block Group 0    Block Group 1    Block Group 2    ...
├── Superblock  ├── Superblock   ├── Superblock
├── Group       ├── Group        ├── Group
│   Descriptors │   Descriptors  │   Descriptors
├── Block       ├── Block        ├── Block
│   Bitmap      │   Bitmap       │   Bitmap
├── Inode       ├── Inode        ├── Inode
│   Bitmap      │   Bitmap       │   Bitmap
├── Inode Table ├── Inode Table  ├── Inode Table
└── Data Blocks └── Data Blocks └── Data Blocks
```

### Key Components

**Superblock:**
- Filesystem metadata
- Size, block count, inode count
- Backup superblocks for recovery

**Inode:**
- File metadata (permissions, size, timestamps)
- Pointers to data blocks
- Limited number (determines max files)

**Data Blocks:**
- Actual file data
- Typically 4KB

## Journaling

### What is Journaling?

Journaling ensures filesystem consistency by:
1. Recording changes in journal before applying
2. Applying changes to filesystem
3. Marking journal entry complete

### Journaling Modes (ext4)

**data=ordered (default):**
- Metadata journaled, data flushed before commit
- Good balance of performance and safety
- Ensures if you see a file, its data is on disk

:::tip When to Use ordered Mode
Use `ordered` mode for:
- General-purpose filesystems
- Most production workloads
- When you need good performance with reasonable safety

This is the default for good reason - it works well for most cases.
:::

**data=writeback:**
- Only metadata journaled, data may be after commit
- Faster, less safe
- Can cause files with zero length or corrupted data after crashes

:::warning writeback Mode Risks
`writeback` mode can cause:
- Files appearing to exist but containing old/corrupted data
- Zero-length files after crashes
- Data loss (though filesystem structure remains intact)

Only use if you can tolerate potential data loss and need maximum performance. Not recommended for databases or critical data.
:::

**data=journal:**
- Data and metadata journaled (slow, safest)
- Both file data and filesystem structure can be recovered
- Significantly slower because every write goes through journal twice

:::important When to Use data=journal
Use `data=journal` for:
- Critical data that cannot be lost
- When you can tolerate lower performance
- Small filesystems where the performance impact is acceptable

Most production systems don't use this because the performance penalty is too high.
:::

### Checking Journal Mode

```bash
# Check mode
tune2fs -l /dev/sda1 | grep "Default mount options"

# Change mode (remount required)
tune2fs -o journal_data_writeback /dev/sda1
```

## Filesystem Tools

### mkfs (Make Filesystem)

```bash
# Create ext4
mkfs.ext4 /dev/sda1

# With options
mkfs.ext4 -L mydata -m 0 /dev/sda1
# -L: Label
# -m: Reserved blocks percentage (0 = none)

# Create XFS
mkfs.xfs /dev/sda1

# Create Btrfs
mkfs.btrfs /dev/sda1
```

### tune2fs (ext4 Tuning)

```bash
# View filesystem info
tune2fs -l /dev/sda1

# Change label
tune2fs -L newlabel /dev/sda1

# Change reserved blocks
tune2fs -m 1 /dev/sda1  # 1% reserved

# Enable/disable features
tune2fs -O ^has_journal /dev/sda1  # Disable journal
```

### xfs_admin (XFS Tuning)

```bash
# View info
xfs_admin -l /dev/sda1

# Change label
xfs_admin -L newlabel /dev/sda1
```

## Mount Options

### Common Options

```bash
# /etc/fstab example
UUID=... /data ext4 defaults,noatime,nodiratime 0 2

# Options:
# defaults - rw,suid,dev,exec,auto,nouser,async
# noatime - Don't update access time
# nodiratime - Don't update directory access time
# relatime - Update atime relative to mtime/ctime
# barrier=1 - Write barriers (safety)
# barrier=0 - No barriers (performance, risky)
```

### Performance Options

**noatime:**
- Reduces metadata writes
- Improves performance
- Use when atime not needed

**nodiratime:**
- Don't update directory atime
- Further reduces writes

**relatime:**
- Update atime only if older than mtime/ctime
- Balance between performance and compatibility

## Filesystem Maintenance

### fsck (Filesystem Check)

```bash
# Check ext4 (dry run)
fsck.ext4 -n /dev/sda1

# Check and repair
fsck.ext4 -y /dev/sda1

# Force check
fsck.ext4 -f /dev/sda1

# Check XFS
xfs_repair -n /dev/sda1  # Dry run
xfs_repair /dev/sda1     # Repair
```

### When to Run fsck

- After unclean shutdown
- Periodic checks (monthly)
- Before major operations
- When corruption suspected

### Automatic fsck

```bash
# Check mount count
tune2fs -l /dev/sda1 | grep "Maximum mount count"

# Set to check every 30 mounts
tune2fs -c 30 /dev/sda1

# Check interval
tune2fs -l /dev/sda1 | grep "Check interval"
```

## Inode Management

### Inode Limits

```bash
# Check inode usage
df -i

# Check inode count
tune2fs -l /dev/sda1 | grep "Inode count"

# Create with more inodes
mkfs.ext4 -N 10000000 /dev/sda1
```

### Inode Exhaustion

**Symptoms:**
- "No space left on device" despite free space
- `df -i` shows 100% IUse

**Fix:**
- Delete unnecessary files
- Increase inode count (reformat)
- Use filesystem with dynamic inodes (XFS, Btrfs)

## Filesystem Corruption

### Signs of Corruption

- `EXT4-fs error` in dmesg
- `XFS (dm-0): Metadata corruption` messages
- Files disappearing
- Cannot mount filesystem

### Investigation

```bash
# Check kernel messages
dmesg | grep -i "ext4\|xfs\|corrupt"

# Check filesystem
fsck.ext4 -n /dev/sda1
```

### Recovery Steps

1. **Unmount filesystem** (if possible)
2. **Backup** (block-level if needed)
3. **Run fsck** with repair
4. **Restore from backup** if fsck fails
5. **Check hardware** (bad disk?)

## Performance Tuning

### ext4 Tuning

```bash
# Disable journal (faster, less safe)
tune2fs -O ^has_journal /dev/sda1

# Increase journal size
tune2fs -J size=512 /dev/sda1

# Disable barriers (risky)
mount -o barrier=0 /dev/sda1 /mnt
```

### XFS Tuning

```bash
# Increase log size
xfs_admin -l size=512m /dev/sda1

# Allocate inodes dynamically
# (default, no tuning needed)
```

### Btrfs Tuning

```bash
# Enable compression
mount -o compress=zstd /dev/sda1 /mnt

# Disable COW for specific files
chattr +C /path/to/file
```

## Best Practices

1. **Choose right filesystem** - Based on workload
2. **Monitor inode usage** - Prevent exhaustion
3. **Regular fsck** - Catch corruption early
4. **Use appropriate mount options** - Performance vs safety
5. **Backup regularly** - Before problems occur

:::warning Production Warning
Filesystem corruption can cause data loss. Always have backups and test recovery procedures.
:::

## Next Steps

Continue to [Storage Failure Scenarios & Recovery](./io-troubleshooting) for troubleshooting scenarios.
