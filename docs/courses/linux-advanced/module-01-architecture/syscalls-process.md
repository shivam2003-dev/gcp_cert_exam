# System Calls, Process Lifecycle & strace Labs

## Deep Dive: System Calls

### System Call Numbers

Each architecture defines its own set of syscall numbers. These numbers are used by the CPU to identify which kernel function to call. Understanding syscall numbers helps when analyzing low-level system behavior or debugging assembly code.

:::note Architecture Differences
Different architectures (x86_64, ARM, etc.) may have different syscall numbers for the same operation. This is why you need architecture-specific headers. The syscall interface abstracts these differences.
:::

```bash
# x86_64 syscall numbers - see the numeric codes for each syscall
grep -E "^#define __NR_" /usr/include/asm/unistd_64.h | head -20
```

This shows the mapping between syscall names and their numeric codes. For example, `__NR_read` might be `0`, `__NR_write` might be `1`, etc.

```bash
# Map number to name - reverse lookup
ausyscall 1    # Returns: write
ausyscall 2    # Returns: open
ausyscall 3    # Returns: close
```

:::tip Debugging Tip
When you see syscall numbers in crash dumps or assembly code, use `ausyscall` to identify what operation was being performed. This is invaluable for kernel debugging.
:::

### System Call Implementation

**x86_64 Example:**
```asm
mov    $0, %rax        # Syscall number (read = 0)
mov    $fd, %rdi       # First argument (file descriptor)
mov    $buf, %rsi      # Second argument (buffer)
mov    $len, %rdx      # Third argument (length)
syscall                # Trap to kernel
```

The kernel dispatcher performs these steps when a syscall is invoked:

1. **Saves user registers** - Preserves the calling process's state
2. **Switches to kernel stack** - Uses kernel's own stack for execution
3. **Looks up handler in syscall table** - Finds the function to call based on syscall number
4. **Executes handler** - Runs the kernel code that performs the operation
5. **Restores registers** - Returns the process to its previous state
6. **Returns to user space** - Transfers control back to the user program

:::important Performance Consideration
Each syscall involves a context switch from user to kernel space and back. This has overhead (typically 1-10 microseconds). High-frequency syscalls can become a bottleneck. This is why system calls are often batched or avoided when possible (e.g., using `readv()` instead of multiple `read()` calls).
:::

:::warning Security Implication
The syscall table is a critical security boundary. If an attacker can modify the syscall table, they can redirect system calls to malicious code. Modern kernels protect the syscall table by making it read-only after initialization.
:::

## strace: System Call Tracer

### Basic Usage

`strace` is one of the most powerful debugging tools in Linux. It shows you exactly what system calls a process is making, which is often the key to understanding why applications behave the way they do.

```bash
# Trace command execution - see all syscalls made by a command
strace ls /tmp
```

:::note Understanding strace Output
Each line shows a system call:
- `openat(AT_FDCWD, "/tmp", O_RDONLY|O_NONBLOCK|O_CLOEXEC|O_DIRECTORY) = 3`
  - System call: `openat`
  - Arguments: directory path and flags
  - Return value: `3` (file descriptor)

The return value is crucial - negative numbers indicate errors (check `errno`).
:::

```bash
# Trace running process - attach to existing process
strace -p <pid>
```

:::warning Production Overhead
Attaching `strace` to a running process can significantly slow it down. The process must be stopped briefly for each syscall to be logged. Use this sparingly in production, and consider using lower-overhead tools like `perf` for production debugging.
:::

```bash
# Save output to file - essential for analysis
strace -o /tmp/trace.log <command>
```

:::tip Analysis Workflow
Always save strace output to a file. You can then:
- Search for specific syscalls: `grep "open" trace.log`
- Count syscalls: `grep -c "open" trace.log`
- Find slow syscalls: `grep ">" trace.log | sort -k2 -n`
- Analyze patterns: Use scripts to process the log
:::

### Advanced Tracing

As you become more comfortable with strace, you'll need these advanced features for real-world debugging scenarios.

```bash
# Trace with timestamps - see when syscalls happen
strace -t <command>
```

:::tip Timing Analysis
Timestamps help you understand the timing of operations. If you see many syscalls happening at the same time, you might have a performance bottleneck. If syscalls are spread out, the application might be waiting for I/O.
:::

```bash
# Trace with microsecond timestamps - higher precision
strace -tt <command>
```

This is essential when debugging latency-sensitive applications. You can see exactly when each syscall starts and ends.

```bash
# Trace with relative timestamps - see time spent in each syscall
strace -T <command>
```

:::important Performance Debugging
The `-T` flag shows how long each syscall takes. Look for syscalls with high times - these are your bottlenecks. Common culprits:
- `read()` taking > 1ms → slow storage or network
- `connect()` taking > 100ms → network latency
- `open()` taking > 10ms → filesystem or path resolution issues
:::

```bash
# Trace child processes - essential for multi-process applications
strace -f <command>
```

:::note Child Process Tracing
Without `-f`, strace only traces the main process. With `-f`, it traces all forked/cloned children. This is critical for debugging:
- Web servers that fork workers
- Applications using process pools
- Shell scripts that launch commands
:::

```bash
# Filter by syscall type - reduce noise
strace -e trace=network <command>
strace -e trace=file <command>
strace -e trace=process <command>
```

:::tip Reducing Noise
Real applications make thousands of syscalls. Filtering helps you focus on what matters:
- `network`: socket, connect, send, recv
- `file`: open, read, write, close
- `process`: fork, execve, clone, wait
:::

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

This is a common production scenario: a service takes too long to start. strace helps you identify what's causing the delay.

```bash
# Trace service startup - capture all syscalls from all processes
strace -ff -s 128 -o /tmp/service.strace systemctl restart myservice
```

:::important Command Breakdown
- `-ff`: Follow forks (trace all child processes)
- `-s 128`: Show first 128 characters of strings (increase if you need more)
- `-o`: Save to file (creates separate files for each process: `service.strace.PID`)
:::

```bash
# Analyze slow syscalls - find what's taking time
grep -E "open|read|write" /tmp/service.strace | awk '{print $NF}' | sort | uniq -c | sort -rn
```

:::tip Analysis Strategy
This command:
1. Finds all file-related syscalls
2. Extracts the last field (usually the file path or return value)
3. Counts occurrences
4. Sorts by frequency

High counts indicate files being accessed repeatedly - potential optimization target.
:::

:::warning Production Debugging
When debugging slow services in production:
1. Use `-T` to see timing: `strace -T -ff -o trace.log systemctl restart service`
2. Look for syscalls with high times in the output
3. Check for repeated operations (might indicate missing cache or inefficient code)
4. Watch for errors (negative return values)
:::

## Process Lifecycle Deep Dive

### fork() Internals

**Copy-on-Write (COW):**

Copy-on-Write is a memory optimization technique that makes `fork()` very efficient. Instead of immediately copying all memory pages, Linux uses a clever trick:

- **Parent and child initially share physical pages** - Both processes point to the same physical memory
- **Pages marked read-only** - The MMU (Memory Management Unit) marks pages as read-only
- **On write, kernel creates copy** - When either process tries to write, a page fault occurs and the kernel creates a private copy
- **Saves memory for large processes** - Only pages that are actually modified are copied

:::important Performance Impact
COW makes `fork()` very fast even for large processes. A process with 1GB of memory can fork in milliseconds because no copying happens initially. Only when the child (or parent) modifies memory do pages get copied.
:::

```bash
# Monitor fork operations - see when processes are created
strace -e trace=clone,fork,vfork -f <command>
```

:::note Modern Linux Uses clone()
Modern Linux uses `clone()` for both processes and threads. The flags determine what's shared:
- No special flags: Separate process (like old `fork()`)
- `CLONE_VM`: Shared memory (thread)
- `CLONE_FILES`: Shared file descriptors
- `CLONE_FS`: Shared filesystem info
:::

```bash
# Check COW behavior - see which pages are shared vs private
cat /proc/<pid>/smaps | grep -i cow
```

:::tip Understanding smaps Output
The `smaps` file shows detailed memory mappings. Look for:
- `Shared_Clean`: Pages shared with other processes (COW, not yet modified)
- `Shared_Dirty`: Pages shared but modified (COW copy created)
- `Private_Clean`: Private pages (COW copy made, but not yet modified by this process)
- `Private_Dirty`: Private pages that have been modified

High `Shared_Clean` means COW is working well - memory is being shared efficiently.
:::

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
