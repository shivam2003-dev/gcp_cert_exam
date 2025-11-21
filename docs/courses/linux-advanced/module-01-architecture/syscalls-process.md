# System Calls, Process Lifecycle & strace Labs

## Deep Dive: System Calls

### Syscall Table Inspection

```bash
# x86_64 syscall numbers
awk '$3 ~ /sys_/ {printf "%04d %s\n", NR-1, $3}' /usr/include/asm/unistd_64.h | head

# Map syscall numbers to names dynamically
ausyscall --dump | head
```

### Tracing Techniques

```bash
# Trace only open/close/read/write
strace -e trace=%file -p <pid>

# Count syscalls and latency
strace -c -p <pid>

# Capture slow syscalls for services
systemd-run --scope -p CPUWeight=10 strace -T -tt -ff -o /tmp/httpd.strace systemctl restart httpd
```

### Syscall Latency Budgeting

- Identify syscalls exceeding SLO (e.g., `read` > 1ms)
- Pair `strace -T` with `perf trace` for high-frequency events

```bash
perf trace -p <pid> --event=syscalls:sys_enter_write --max-stack=5
```

## Process Lifecycle Labs

### Fork Bomb Defense

```bash
# Limit user processes
ulimit -u 4096
vim /etc/security/limits.d/90-nproc.conf
```

### Zombie Hunting

```bash
ps -el | awk '$2 == "Z" {print}'

# Identify parent
ps -o pid,ppid,state,cmd -p <zombie-pid>

# Reap by restarting parent or sending SIGCHLD
kill -s SIGCHLD <parent-pid>
```

### Signals in Practice

```bash
trap 'echo "Caught SIGTERM"' TERM
sleep 600 &
kill -TERM %1
```

## Boot Process Flow

```
UEFI → firmware init
↓
GRUB (bootloader) loads kernel + initramfs
↓
Kernel decompresses, initializes subsystems, mounts root
↓
Init system (systemd) PID 1
↓
Targets, services, sockets
```

### Boot Investigation Commands

```bash
# Boot time summary
systemd-analyze

# Critical path
systemd-analyze critical-chain

# Boot logs for previous boot
journalctl -b -1 -p warning
```

## systemd Internals

### Unit Anatomy

```ini
[Unit]
Description=Custom Daemon
After=network-online.target

[Service]
Type=notify
ExecStart=/usr/local/bin/customd
Restart=on-failure
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

### Dependency Debugging

```bash
# Visual graph
systemd-analyze dot multi-user.target | dot -Tsvg > boot.svg

# Why is a unit failing?
systemctl status myservice.service -l
journalctl -u myservice.service -b
```

## Scheduling Work Internals

- systemd launches services using `fork/exec`
- Kernel scheduler (CFS) assigns CPU time
- `nice` and `cgroup` weights influence vruntime

```bash
# Inspect unit cgroup
systemd-cgls /system.slice/sshd.service

# Adjust CPU shares
systemctl set-property nginx.service CPUWeight=500
```

## strace Incident Playbook

1. Capture baseline strace when system is healthy
2. During incident, strace misbehaving PID
3. Compare syscall mix and latency
4. Identify blocking resources (files, sockets, futexes)

```bash
# Identify futex contention
strace -p <pid> -e trace=futex -T

# Attach to hung process tree
for pid in $(pgrep -P <parent>); do strace -p $pid & done
```

## Checklist

- [ ] Understand user vs kernel transitions
- [ ] Comfortable tracing syscalls and interpreting output
- [ ] Have boot-time troubleshooting procedure
- [ ] Know how to inspect and patch systemd unit behavior

Next module: [Process, CPU & Scheduling Internals](../module-02-cpu/process-model).
