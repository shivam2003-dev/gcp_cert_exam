# System Calls, Process Lifecycle & strace Labs

## Deep Dive: System Calls

### System Call Numbers

Each architecture defines syscall numbers:

```bash
# x86_64 syscall numbers
grep -E "^#define __NR_" /usr/include/asm/unistd_64.h | head -20

# Map number to name
ausyscall 1    # Returns: write
ausyscall 2    # Returns: open
ausyscall 3    # Returns: close
```

### System Call Implementation

**x86_64 Example:**
```asm
mov    $0, %rax        # Syscall number (read = 0)
mov    $fd, %rdi       # First argument (file descriptor)
mov    $buf, %rsi      # Second argument (buffer)
mov    $len, %rdx      # Third argument (length)
syscall                # Trap to kernel
```

The kernel dispatcher:
1. Saves user registers
2. Switches to kernel stack
3. Looks up handler in syscall table
4. Executes handler
5. Restores registers
6. Returns to user space

## strace: System Call Tracer

### Basic Usage

```bash
# Trace command execution
strace ls /tmp

# Trace running process
strace -p <pid>

# Save output to file
strace -o /tmp/trace.log <command>
```

### Advanced Tracing

```bash
# Trace with timestamps
strace -t <command>

# Trace with microsecond timestamps
strace -tt <command>

# Trace with relative timestamps
strace -T <command>

# Trace child processes
strace -f <command>

# Filter by syscall type
strace -e trace=network <command>
strace -e trace=file <command>
strace -e trace=process <command>
```

### Performance Analysis

```bash
# Summary statistics
strace -c <command>

# Show time spent in syscalls
strace -T <command>

# Count syscalls
strace -c -e trace=open,openat <command>
```

### Real-World Example: Debugging Slow Service

```bash
# Trace service startup
strace -ff -s 128 -o /tmp/service.strace systemctl restart myservice

# Analyze slow syscalls
grep -E "open|read|write" /tmp/service.strace | awk '{print $NF}' | sort | uniq -c | sort -rn
```

## Process Lifecycle Deep Dive

### fork() Internals

**Copy-on-Write (COW):**
- Parent and child initially share physical pages
- Pages marked read-only
- On write, kernel creates copy
- Saves memory for large processes

```bash
# Monitor fork operations
strace -e trace=clone,fork,vfork -f <command>

# Check COW behavior
cat /proc/<pid>/smaps | grep -i cow
```

### execve() Process

1. Load ELF binary
2. Map segments (text, data, bss)
3. Load dynamic linker
4. Resolve symbols
5. Jump to entry point

```bash
# Trace execve
strace -e trace=execve <command>

# Inspect ELF binary
readelf -h <binary>
ldd <binary>  # Show shared libraries
```

### Process Termination

```bash
# Monitor exit
strace -e trace=exit,exit_group <command>

# Check exit status
echo $?

# Zombie processes
ps aux | awk '$8 ~ /Z/ {print}'
```

## Process Inspection Tools

### /proc Filesystem

```bash
# Process command line
cat /proc/<pid>/cmdline | tr '\0' ' '

# Environment
cat /proc/<pid>/environ | tr '\0' '\n'

# Open files
ls -l /proc/<pid>/fd/

# Memory mappings
cat /proc/<pid>/maps

# Status
cat /proc/<pid>/status

# I/O statistics
cat /proc/<pid>/io
```

### ps Deep Dive

```bash
# Detailed process info
ps -eo pid,ppid,cmd,%mem,%cpu,state,etime

# Thread view
ps -eLf

# Process tree
ps -ejH

# Custom format
ps -eo pid,cmd,wchan:20,stat
```

## Signal Handling

### Signal Delivery

1. Kernel receives signal (from process, hardware, or kernel)
2. Checks signal mask (blocked signals deferred)
3. Delivers to process
4. Process handles via signal handler or default action

```bash
# Check pending signals
cat /proc/<pid>/status | grep Sig

# Block signals
trap '' SIGTERM SIGINT

# Custom signal handler
trap 'echo "Caught SIGTERM"' SIGTERM
```

### Signal Masks

```bash
# View signal mask
cat /proc/<pid>/status | grep SigBlk

# Set signal mask in C
sigprocmask(SIG_BLOCK, &mask, NULL);
```

## Process Limits

### Resource Limits

```bash
# View limits
ulimit -a

# Per-process limits
cat /proc/<pid>/limits

# Set limits
ulimit -n 4096  # File descriptors
ulimit -u 1000  # Processes
```

### cgroups Limits

```bash
# CPU limit
echo "50000 100000" > /sys/fs/cgroup/cpu.max

# Memory limit
echo "1G" > /sys/fs/cgroup/memory.max
```

## Production Scenarios

### Scenario 1: Process Hanging on I/O

```bash
# Identify blocked process
ps -eo pid,state,wchan,cmd | grep ' D '

# Check what it's waiting for
cat /proc/<pid>/wchan

# Trace I/O operations
strace -e trace=read,write -p <pid>
```

### Scenario 2: High Fork Rate

```bash
# Monitor fork rate
pidstat -r 1 | grep -E "PID|fork"

# Limit fork rate
echo "user hard nproc 100" >> /etc/security/limits.conf
```

### Scenario 3: Zombie Process Accumulation

```bash
# Find zombies
ps aux | awk '$8 ~ /Z/ {print $2, $3}'

# Find parent
ps -o pid,ppid,cmd -p <zombie_pid>

# Reap zombies
kill -CHLD <parent_pid>
```

## Best Practices

1. **Use strace sparingly** - High overhead, use for debugging
2. **Understand COW** - Helps optimize fork-heavy applications
3. **Monitor process limits** - Prevent resource exhaustion
4. **Handle signals properly** - Clean shutdowns, proper error handling
5. **Inspect /proc regularly** - Rich debugging information

:::tip Production Insight
strace is your window into what processes are actually doing. Use it to understand why services are slow or failing.
:::

## Next Steps

Continue to [Boot Sequence & Systemd Deep Dive](./boot-systemd) to understand how Linux boots and systemd works.
