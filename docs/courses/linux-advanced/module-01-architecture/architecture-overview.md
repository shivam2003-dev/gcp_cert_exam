# Linux Architecture & Internals

## User Space vs Kernel Space

Linux isolates user applications from kernel code:

| Layer | Description | Tools |
|-------|-------------|-------|
| User Space | Processes, libraries, shells, services | `ps`, `ldd`, `strace` |
| Kernel Space | Scheduler, memory manager, drivers, networking | `sysctl`, `/proc`, `perf` |

**Key Concepts**
- **Ring 3 vs Ring 0**: x86 protection rings limit access to privileged instructions.
- **Syscalls**: User code requests kernel services via `syscall` instruction.
- **Context switches**: CPU switches between processes or kernel threads, saving registers and MMU state.

### Inspecting Boundaries

```bash
# Show system call for `ls`
strace -e trace=execve ls >/dev/null

# Identify syscall table for architecture
grep "sys_call_table" /boot/System.map-$(uname -r)
```

## System Call Flow

1. User process invokes libc wrapper (e.g., `read()`)
2. Wrapper places syscall number in `%rax` (x86_64) and arguments in registers
3. `syscall` instruction traps into kernel
4. Kernel dispatcher looks up handler in syscall table
5. Kernel performs privileged operation
6. Return value placed in `%rax`; control returns to user space

### Tracing Syscalls

```bash
# Trace noisy service startup
strace -ff -s 128 -o /tmp/ssh.strace systemctl restart sshd

# Filter by specific PID
strace -p <pid> -e trace=network
```

## Process Lifecycle

1. **fork()** – clones parent address space
2. **execve()** – replaces image with new program
3. **wait()** – parent waits for child exit
4. **exit()** – process terminates, becomes zombie until waited

```bash
# Visualize process hierarchy
pstree -a -p

# Track exec events with auditd
audisp-targz -f /var/log/audit/audit.log | grep execve
```

## Scheduler Overview

- Linux uses **Completely Fair Scheduler (CFS)** for normal tasks
- Scheduler maintains red-black tree ordered by virtual runtime
- Periodically selects task with lowest vruntime

```bash
# Inspect scheduler statistics
cat /proc/sched_debug | head

# View per-CPU scheduler latency targets
sysctl kernel.sched_latency_ns kernel.sched_min_granularity_ns
```

## Signals & Interrupts

- **Signals**: software interrupts delivering events to processes (`SIGTERM`, `SIGKILL`)
- **Hardware interrupts**: triggered by devices, handled by kernel interrupt handlers

```bash
# Pending and blocked signals
cat /proc/$(pidof sshd)/status | egrep "Sig(Blk|Ign|Cgt)"

# Send custom signal
kill -USR1 <pid>
```

## Kernel Architecture

- **Monolithic kernel** with loadable modules (`.ko`)
- Subsystems: scheduler, MMU, VFS, block, net, security
- Communication via function calls inside kernel; no message passing overhead

```bash
# List loaded modules
lsmod | head

# Check module parameters
modinfo vfio_pci | egrep "(filename|parm)"
```

## Key Filesystems

- `/proc` – pseudo-files exposing kernel internals
- `/sys` – sysfs, configuration knobs for devices and kernel subsystems
- `/dev` – device nodes representing block/char devices

```bash
# Explore process info
ls /proc/$$
cat /proc/$$/limits

# Tune runtime parameters
sudo sysctl -w kernel.printk="4 4 1 7"
```

## Takeaways

- Understand where code executes: user vs kernel
- Syscalls are your window into kernel behavior—trace them during troubleshooting
- `/proc` and `/sys` expose nearly all kernel internals without recompiling
- Mastering scheduler concepts is mandatory before touching CPU tuning

Next up: [System Calls, Process Lifecycle & strace Labs](./syscalls-process).
