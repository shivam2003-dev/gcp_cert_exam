# Linux Process Model

## Overview

Understanding how Linux manages processes is essential for performance tuning and troubleshooting. This module covers process creation, scheduling, and CPU management.

## Processes vs Threads

### Process

A **process** is an independent execution unit with:
- Own virtual address space
- Own file descriptor table
- Own credentials (UID, GID)
- Own signal handlers

### Thread

A **thread** shares with siblings:
- Virtual address space
- File descriptors
- Credentials
- Signal handlers

But has:
- Own stack
- Own CPU registers
- Own thread ID (TID)

### Linux Implementation

Linux implements threads using `clone()` system call:

```c
// Process (separate address space)
clone(..., 0, ...);

// Thread (shared address space)
clone(..., CLONE_VM | CLONE_FS | CLONE_FILES, ...);
```

### Inspecting Threads

```bash
# Show threads
ps -eLf | head

# Threads per process
ps -eo pid,nlwp,comm | sort -k2 -rn | head

# Per-thread CPU usage
pidstat -t 1 5
```

## Process States

### State Transitions

```
NEW → RUNNING → (BLOCKED) → RUNNING → ZOMBIE
```

### Detailed States

| State | Code | Description |
|-------|------|-------------|
| **Running** | R | Executing or ready to run |
| **Sleeping (Interruptible)** | S | Waiting for event (can be woken by signal) |
| **Sleeping (Uninterruptible)** | D | Waiting for I/O (cannot be interrupted) |
| **Stopped** | T | Suspended by signal (SIGSTOP, SIGTSTP) |
| **Zombie** | Z | Terminated, waiting for parent to reap |
| **Dead** | X | Process is being destroyed |

### Inspecting States

```bash
# Process states
ps -eo pid,state,comm | head

# Detailed state info
ps -eo pid,state,wchan,cmd | head

# Count by state
ps -eo state | sort | uniq -c
```

### Understanding wchan

`wchan` shows what kernel function process is waiting in:

```bash
ps -eo pid,state,wchan,cmd | grep ' D '

# Common wchan values:
# futex_wait_queue_me - Waiting on mutex
# io_schedule - Waiting for I/O
# poll_schedule_timeout - Waiting in poll/select
```

## Context Switching

### What is Context Switching?

When CPU switches from one process to another:
1. Save current process state (registers, PC, stack pointer)
2. Load new process state
3. Switch page tables (if different process)
4. Resume execution

### Context Switch Overhead

- **Cost**: ~1-10 microseconds per switch
- **Impact**: High switch rate degrades performance
- **Measurement**: `vmstat` shows `cs` (context switches per second)

```bash
# Monitor context switches
vmstat 1 5

# Per-process context switches
pidstat -w 1 5

# Detailed scheduler stats
cat /proc/sched_debug | grep csw
```

### Reducing Context Switches

1. **CPU affinity** - Pin processes to CPUs
2. **Reduce thread count** - Fewer threads = fewer switches
3. **Optimize locking** - Reduce contention
4. **Use lock-free algorithms** - When possible

## Process Priorities

### Nice Values

- Range: -20 (highest) to +19 (lowest)
- Default: 0
- Only affects CPU time, not I/O

```bash
# View nice value - see current priority of processes
ps -eo pid,ni,comm | head
```

:::note Understanding Nice Values
The `ni` column shows the nice value. Negative values (like -10) mean higher priority. Positive values (like +10) mean lower priority. Most processes have nice value 0 (normal priority).
:::

```bash
# Set nice value - start command with lower priority
nice -n 10 <command>
```

This starts a command with nice value 10, meaning it will get less CPU time than normal processes. Useful for background tasks that shouldn't interfere with interactive work.

```bash
# Change nice value of running process
renice 10 <pid>
```

:::important Renice Limitations
You can only increase nice values (lower priority) without root. To decrease nice values (raise priority), you need root privileges. This prevents users from monopolizing CPU.
:::

```bash
# Real-time priority - for time-critical tasks
chrt -r -p 50 <pid>
```

:::warning Real-Time Priority Danger
Real-time priorities can starve normal processes. A misbehaving RT task can make the system unresponsive. Always:
- Set CPU affinity for RT tasks
- Use watchdog timers
- Monitor RT task behavior
- Limit RT task count
:::

### Priority Classes

1. **SCHED_NORMAL** (CFS) - Default, uses nice values
2. **SCHED_FIFO** - Real-time, first-in-first-out
3. **SCHED_RR** - Real-time, round-robin
4. **SCHED_DEADLINE** - Deadline-based scheduling

```bash
# Check scheduling policy
chrt -p <pid>

# Set FIFO priority
chrt -f -p 50 <pid>
```

## CPU Affinity

### What is CPU Affinity?

Binding processes to specific CPUs to:
- Reduce cache misses
- Improve NUMA locality
- Isolate workloads

### Setting Affinity

CPU affinity pins processes to specific CPUs. This can improve performance by:
- Reducing cache misses (data stays in CPU cache)
- Improving NUMA locality (using local memory)
- Isolating workloads (preventing interference)

```bash
# View current affinity - see which CPUs process can run on
taskset -cp <pid>
```

The output shows a CPU mask. For example, `pid 1234's current affinity list: 0-3` means the process can run on CPUs 0, 1, 2, or 3.

```bash
# Set affinity (CPUs 0,1) - restrict to specific CPUs
taskset -cp 0,1 <pid>
```

:::important Affinity Considerations
Setting CPU affinity can help performance, but be careful:
- Don't overload a single CPU
- Consider NUMA topology (use CPUs on same NUMA node)
- Monitor CPU utilization to ensure balanced load
:::

```bash
# Start with affinity - set from the beginning
taskset -c 0,1 <command>
```

:::tip Production Use Cases
CPU affinity is useful for:
- Database servers (pin to specific CPUs)
- Real-time applications (isolate from other workloads)
- High-performance computing (minimize cache misses)
- Virtualization (pin VMs to specific CPUs)
:::

### systemd CPU Affinity

```bash
# Limit service to specific CPUs
systemctl set-property myservice.service AllowedCPUs=0-3

# Check
systemctl show myservice.service | grep AllowedCPUs
```

## Process Limits

### Per-Process Limits

```bash
# View limits
ulimit -a

# Per-process limits
cat /proc/<pid>/limits

# Set limits
ulimit -n 4096  # File descriptors
ulimit -u 1000  # Processes
ulimit -m 2097152  # Memory (KB)
```

### System-Wide Limits

```bash
# /etc/security/limits.conf
* soft nofile 4096
* hard nofile 8192
root soft nproc unlimited
root hard nproc unlimited
```

## Process Inspection

### /proc/&lt;pid&gt;/

The `/proc/<pid>/` directory is a goldmine of information about running processes. Every file in this directory provides real-time information about the process.

```bash
# Command line - see how process was started
cat /proc/<pid>/cmdline | tr '\0' ' '
```

:::note Null-Terminated Strings
The `cmdline` file uses null bytes (`\0`) to separate arguments, not spaces. That's why we use `tr '\0' ' '` to make it readable. This preserves arguments that contain spaces.
:::

```bash
# Environment - see environment variables passed to process
cat /proc/<pid>/environ | tr '\0' '\n'
```

:::tip Debugging Tip
Environment variables often contain configuration, secrets, or paths. If a process isn't behaving as expected, check its environment - it might be missing a required variable or have an incorrect value.
:::

```bash
# Status - human-readable process information
cat /proc/<pid>/status
```

This file contains formatted information including:
- Process state (running, sleeping, zombie)
- Memory usage (RSS, virtual memory)
- Signal masks
- Capabilities
- Thread count

```bash
# Statistics - machine-readable process stats
cat /proc/<pid>/stat
```

:::important stat File Format
The `stat` file is a single line with space-separated fields. Field positions are fixed:
- Field 1: PID
- Field 2: Process name
- Field 3: State
- Field 14: User time
- Field 15: System time
- Field 22: Start time

Use `man proc` for the complete field list. Scripts often parse this file for performance monitoring.
:::

```bash
# Memory maps - see what memory the process is using
cat /proc/<pid>/maps
```

:::tip Memory Analysis
The `maps` file shows:
- Virtual address ranges
- Permissions (read, write, execute)
- What each range maps to (file, heap, stack, anonymous)
- Device and inode (for file-backed mappings)

This is essential for debugging memory issues, finding memory leaks, or understanding why a process uses so much memory.
:::

```bash
# Open files - see what files the process has open
ls -l /proc/<pid>/fd/
```

:::warning File Descriptor Leaks
If you see many file descriptors, the process might have a leak. Each entry is a symlink to the actual file. You can see:
- Regular files
- Sockets (showing network connections)
- Pipes
- Device files

High FD counts can cause "Too many open files" errors.
:::

```bash
# I/O statistics - see disk I/O performed by process
cat /proc/<pid>/io
```

:::important I/O Monitoring
This shows:
- `rchar`: Characters read (from read() syscalls)
- `wchar`: Characters written
- `syscr`: Read syscalls
- `syscw`: Write syscalls
- `read_bytes`: Actual bytes read from storage
- `write_bytes`: Actual bytes written to storage

The difference between `rchar` and `read_bytes` shows page cache hits (data read from cache, not disk).
:::

### Advanced Inspection

```bash
# Process tree
pstree -a -p

# Resource usage
pidstat -p <pid> 1 5

# Thread details
ps -Lp <pid> -o pid,tid,pcpu,state,wchan
```

## Process Lifecycle Events

### Monitoring Creation

```bash
# Trace fork/clone
strace -e trace=clone,fork,vfork -f <command>

# Monitor with auditd
auditctl -w /proc -p x -k process_creation
ausearch -k process_creation
```

### Monitoring Termination

```bash
# Exit events
strace -e trace=exit,exit_group <command>

# Zombie detection
watch -n1 'ps aux | awk "\$8 ~ /Z/ {print}"'
```

## Production Scenarios

### Scenario 1: Too Many Threads

**Symptoms:**
- High context switch rate
- Poor performance
- High CPU usage

**Investigation:**
```bash
# Count threads
ps -eo nlwp,pid,comm | sort -rn | head

# Thread CPU usage
pidstat -t 1 5
```

**Fix:**
- Reduce thread pool size
- Use async I/O instead of threads
- Implement work queues

### Scenario 2: Process Stuck in D State

**Symptoms:**
- Process unkillable
- High load average
- I/O wait high

**Investigation:**
```bash
# Find D state processes
ps -eo pid,state,wchan,cmd | grep ' D '

# Check what it's waiting for
cat /proc/<pid>/stack
```

**Fix:**
- Fix underlying I/O issue
- Restart storage service
- Replace failing hardware

### Scenario 3: Zombie Accumulation

**Symptoms:**
- Many Z state processes
- PID exhaustion possible

**Investigation:**
```bash
# Find zombies
ps aux | awk '$8 ~ /Z/ {print}'

# Find parent
ps -o pid,ppid,cmd -p <zombie_pid>
```

**Fix:**
- Fix parent to call wait()
- Restart parent process
- Send SIGCHLD to parent

## Best Practices

1. **Monitor process states** - Catch issues early
2. **Limit thread count** - Prevent context switch storms
3. **Use CPU affinity** - For latency-sensitive workloads
4. **Set appropriate priorities** - Balance fairness and performance
5. **Handle signals properly** - Clean shutdowns

:::tip Production Insight
Understanding process states helps you diagnose why systems are slow. D state processes indicate I/O issues, high context switches indicate CPU contention.
:::

## Next Steps

Continue to [CFS Scheduler & CPU Diagnostics](./cpu-scheduler) to understand how Linux schedules processes.
