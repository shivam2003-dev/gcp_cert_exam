# Linux I/O Stack

## Stack Overview

```
Application → libc → VFS → Filesystem → Block Layer → Device Driver → Hardware
```

### Key Components
- **VFS**: abstract filesystem ops (`open`, `read`, `write`)
- **Block Layer**: request queue, I/O scheduler
- **Drivers**: talk to hardware (NVMe, SAS, RAID)

## Block Devices

```bash
lsblk -o NAME,TYPE,SIZE,MODEL

# Detailed topology
sudo udevadm info --query=all --name=/dev/nvme0n1
```

### I/O Schedulers

- mq-deadline (default for NVMe)
- kyber (low latency)
- bfq (desktop workloads)

```bash
echo mq-deadline | sudo tee /sys/block/sda/queue/scheduler
```

## Measuring I/O

### iostat

```bash
iostat -x 1
```

Watch `await`, `svctm`, `%util`.

### iotop

```bash
sudo iotop -ao
```

Find top writers/readers over time.

### blktrace

```bash
sudo blktrace -d /dev/nvme0n1 -o - | blkparse -i - | head
```

Low-level trace of block requests.

## Filesystem Cache

- Page cache stores recent file data
- `drop_caches` only for testing

```bash
sync; echo 3 | sudo tee /proc/sys/vm/drop_caches
```

## Direct I/O & AIO

```bash
# Bypass page cache
fio --name=test --filename=/data/file --rw=randread --bs=4k --ioengine=libaio --direct=1
```

## Tuning Parameters

```bash
# Queue depth
cat /sys/block/nvme0n1/queue/nr_requests

# Read-ahead
blockdev --getra /dev/nvme0n1
blockdev --setra 256 /dev/nvme0n1
```

Next: [Filesystems & Journaling](./filesystems).
