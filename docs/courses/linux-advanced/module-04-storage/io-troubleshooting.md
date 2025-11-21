# Storage Failure Scenarios & Recovery

## Scenario: Hung I/O (D State)

**Symptoms**
- Processes stuck in `D` state
- Load average high
- `%wa` in `iostat` > 50%

**Investigation**
```bash
# Identify blocked tasks
ps -eo pid,state,wchan,cmd | grep ' D '

# Trace blocked syscalls
strace -p <pid>

# Check dmesg for disk errors
journalctl -k -g 'blk'
```

**Fix**
- Failing disk → replace or failover
- Storage array issues → involve storage team
- Filesystem hung → remount/read-only and repair

## Scenario: Disk Full / Inode Exhaustion

```bash
df -h
(df -i)
```

- Clean temporary dirs, rotate logs
- Use `du -shx * | sort -h`
- For inode exhaustion, find directories with millions of tiny files

## Scenario: Latency Spikes on NVMe

- Check thermal throttling: `smartctl -a /dev/nvme0`
- Monitor queue depth: `cat /sys/block/nvme0n1/queue/nr_requests`
- Ensure firmware up to date

## Tools Playbook

- `iostat`, `pidstat -d`, `dstat`
- `blktrace` + `blkparse`
- `fio` for synthetic load testing
- `smartctl`, `nvme smart-log`

Next: [Networking Internals](../module-05-networking/network-stack).
