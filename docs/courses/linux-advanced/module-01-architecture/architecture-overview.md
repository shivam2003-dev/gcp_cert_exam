# Linux Architecture & Internals

## Overview

Understanding Linux architecture is fundamental to troubleshooting production systems. This module covers the separation between user and kernel space, how system calls bridge this gap, and the kernel's internal organization.

## User Space vs Kernel Space

Linux enforces a strict boundary between user applications and kernel code using hardware protection mechanisms.

### Protection Rings

On x86/x86_64 architecture:
- **Ring 3 (User Mode)**: Where all user applications run
- **Ring 0 (Kernel Mode)**: Where the kernel and device drivers execute

**Key Differences:**

| Aspect | User Space | Kernel Space |
|--------|------------|--------------|
| **Memory Access** | Virtual addresses only | Can access physical memory |
| **CPU Instructions** | Restricted set | Full instruction set |
| **I/O Operations** | Must use syscalls | Direct hardware access |
| **Interrupts** | Cannot handle | Handles all interrupts |
| **Scheduling** | Scheduled by kernel | Runs in interrupt context or kernel threads |

### Why This Separation?

1. **Security**: Prevents user programs from crashing the system
2. **Stability**: Kernel bugs don't directly affect user programs
3. **Hardware Protection**: Prevents unauthorized hardware access
4. **Resource Management**: Kernel controls all system resources

## System Calls: The Bridge

System calls are the **only** way user programs can request kernel services.

### How System Calls Work

```
User Process
    ↓
libc wrapper (e.g., read())
    ↓
Assembly: mov $0, %rax; syscall
    ↓
CPU trap to kernel (Ring 0)
    ↓
Kernel syscall handler
    ↓
Kernel performs operation
    ↓
Return value in %rax
    ↓
Back to user space (Ring 3)
```

### Common System Calls

```bash
# List all syscalls for architecture
ausyscall --dump | head -20
```

**Categories:**
- **File operations**: `open`, `read`, `write`, `close`, `stat`
- **Process management**: `fork`, `execve`, `wait`, `exit`
- **Network**: `socket`, `bind`, `connect`, `send`, `recv`
- **Memory**: `mmap`, `munmap`, `brk`
- **Signals**: `kill`, `sigaction`, `sigprocmask`

### Inspecting System Calls

The `strace` tool is essential for understanding what system calls your applications are making. This is particularly useful when debugging performance issues or understanding application behavior.

```bash
# Trace syscalls for a process
strace -p <pid>
```

:::note Understanding strace Output
When you run `strace -p <pid>`, you'll see every system call the process makes in real-time. Each line shows:
- The system call name (e.g., `read`, `write`, `open`)
- Arguments passed to the syscall
- Return value or error code
- Time taken (if using `-T` flag)
:::

```bash
# Count syscalls - useful for performance analysis
strace -c -p <pid>
```

:::tip Performance Analysis
The `-c` flag provides a summary showing which syscalls are called most frequently and how much time is spent in each. This helps identify bottlenecks - if you see thousands of `open()` calls, your application might be opening files inefficiently.
:::

```bash
# Trace specific syscalls only - reduces noise
strace -e trace=network -p <pid>
strace -e trace=file -p <pid>
```

:::warning Production Overhead
`strace` has significant overhead (can slow down processes by 10-100x). Use it sparingly in production. For production debugging, consider using `perf` or eBPF tools which have much lower overhead.
:::

## Kernel Architecture Overview

Linux uses a **monolithic kernel** with **loadable modules**.

### Kernel Components

1. **Process Scheduler** - Manages CPU time allocation
2. **Memory Manager** - Virtual memory, paging, swapping
3. **Virtual File System (VFS)** - Unified interface for filesystems
4. **Network Stack** - TCP/IP, sockets, netfilter
5. **Device Drivers** - Hardware abstraction
6. **Security Modules** - SELinux, AppArmor, capabilities

### Kernel Space Layout

```
Kernel Space (High Memory)
├── Kernel Code (Text)
├── Kernel Data
├── Device Drivers
├── Kernel Modules
└── Kernel Stack (per process)

User Space (Low Memory)
├── Application Code
├── Libraries (libc, etc.)
├── Heap
├── Stack
└── Memory Mapped Files
```

## Process Lifecycle

### Process Creation

1. **fork()** - Creates child process (copy of parent)
   - Copies address space (Copy-on-Write)
   - Shares file descriptors
   - Returns 0 to child, PID to parent

2. **execve()** - Replaces process image
   - Loads new program
   - Replaces memory segments
   - Resets signal handlers

3. **exit()** - Process termination
   - Releases resources
   - Sends SIGCHLD to parent
   - Becomes zombie until parent calls wait()

### Process States

```bash
# View process states
ps -eo pid,state,comm | head

# States:
# R - Running or runnable
# S - Interruptible sleep (waiting for event)
# D - Uninterruptible sleep (usually I/O)
# T - Stopped (by signal)
# Z - Zombie (terminated, not reaped)
```

### Inspecting Process Lifecycle

Understanding how processes are created and managed is crucial for debugging issues like zombie processes, fork bombs, or processes that won't start.

```bash
# Follow process tree - shows parent-child relationships
pstree -a -p
```

:::important Process Tree Visualization
The process tree shows the hierarchy of all processes. PID 1 (usually systemd) is the root. This is essential when debugging issues like:
- Finding which process spawned a problematic child
- Understanding service dependencies
- Identifying orphaned processes
:::

```bash
# Monitor fork/exec events - see how processes are created
strace -e trace=fork,execve,clone -f <command>
```

:::note Fork vs Clone
Modern Linux uses `clone()` system call for both processes and threads. The flags determine what's shared:
- `CLONE_VM`: Shared memory (threads)
- `CLONE_FILES`: Shared file descriptors
- `CLONE_FS`: Shared filesystem info
:::

```bash
# Check process limits - see resource constraints
cat /proc/<pid>/limits
```

:::tip Production Debugging
When a process fails mysteriously, always check `/proc/<pid>/limits`. Common issues:
- `Max open files` too low → "Too many open files" errors
- `Max processes` too low → Cannot fork new processes
- `Max file size` too low → Cannot write large files
:::

## Signals and Interrupts

### Signals (Software Interrupts)

Signals are notifications sent to processes:

```bash
# List all signals
kill -l

# Common signals:
# SIGTERM (15) - Graceful termination
# SIGKILL (9)  - Immediate kill (cannot be caught)
# SIGINT (2)   - Interrupt (Ctrl+C)
# SIGSTOP (19) - Pause process
# SIGCONT (18) - Resume process
```

### Signal Handling

Signals are the primary mechanism for inter-process communication and process control in Linux. Understanding signal handling is critical for graceful shutdowns and debugging hung processes.

```bash
# Send signal - SIGTERM allows graceful shutdown
kill -TERM <pid>
```

:::important Signal Delivery Order
Signals are delivered asynchronously. If a process is in a system call, the signal handler runs after the syscall completes (unless the syscall is interrupted). This is why `SIGKILL` works when `SIGTERM` doesn't - `SIGKILL` cannot be caught or ignored.
:::

```bash
# Check signal masks - see which signals are blocked or ignored
cat /proc/<pid>/status | grep Sig
```

:::note Signal States
The status shows three signal sets:
- `SigBlk`: Blocked signals (deferred delivery)
- `SigIgn`: Ignored signals
- `SigCgt`: Caught signals (have handlers)
:::

```bash
# Block signals in script - prevents interruption during critical sections
trap '' SIGTERM
```

:::warning Signal Blocking
Blocking signals can prevent graceful shutdown. Always unblock signals after critical sections, or use timeouts to ensure processes don't hang forever.
:::

### Hardware Interrupts

Hardware interrupts are triggered by devices:

```bash
# View interrupt statistics
cat /proc/interrupts | head

# Check IRQ affinity
cat /proc/irq/<irq_num>/smp_affinity
```

## Kernel Boot Process

### Boot Sequence

```
1. BIOS/UEFI Firmware
   ↓
2. Bootloader (GRUB)
   ↓
3. Kernel Loading
   ↓
4. Kernel Initialization
   ↓
5. Init Process (systemd)
   ↓
6. User Space Services
```

### Kernel Initialization Phases

1. **Early Boot**: CPU initialization, memory detection
2. **Driver Loading**: Device discovery, driver initialization
3. **Filesystem Mount**: Root filesystem mount
4. **Init Process**: Launch PID 1 (systemd)

### Inspecting Boot Process

```bash
# Kernel messages
dmesg | head -50

# Boot time analysis
systemd-analyze
systemd-analyze blame

# Kernel parameters
cat /proc/cmdline
```

## Kernel Modules

Kernel modules allow you to extend kernel functionality without recompiling the entire kernel. This is how device drivers and filesystem support are added to Linux.

:::important Module vs Built-in
Some functionality is built into the kernel (cannot be removed), while modules can be loaded/unloaded dynamically. Built-in code is always present, modules are loaded on demand.
:::

```bash
# List loaded modules - shows what kernel extensions are active
lsmod
```

:::tip Understanding lsmod Output
The output shows:
- Module name
- Size in memory
- Reference count (how many processes/modules depend on it)
- Dependencies (what other modules it uses)

High reference counts mean the module is in use and cannot be removed.
:::

```bash
# Module information - see details about a module
modinfo <module_name>
```

This shows the module's description, author, license, parameters, and dependencies. The license is important - GPL modules can only be loaded if the kernel is GPL-compatible.

```bash
# Load module - kernel automatically loads dependencies
modprobe <module_name>
```

:::note modprobe vs insmod
- `modprobe`: Intelligent loader that handles dependencies automatically
- `insmod`: Low-level loader that requires manual dependency handling
Always use `modprobe` unless you have a specific reason not to.
:::

```bash
# Remove module - only works if nothing is using it
modprobe -r <module_name>
```

:::warning Module Removal
Removing a module that's in use will fail. Check with `lsmod` first. Some modules cannot be removed if they're providing critical functionality (like the root filesystem driver).
:::

```bash
# Module parameters - configure module behavior
cat /sys/module/<module_name>/parameters/*
```

:::tip Module Parameters
Many modules accept parameters to configure their behavior. For example, network drivers often accept parameters for interrupt coalescing or queue sizes. Check module documentation or use `modinfo` to see available parameters.
:::

## /proc and /sys Filesystems

### /proc - Process Information

```bash
# Process-specific
/proc/<pid>/cmdline    # Command line
/proc/<pid>/environ    # Environment variables
/proc/<pid>/fd/        # Open file descriptors
/proc/<pid>/maps       # Memory mappings
/proc/<pid>/status     # Process status
/proc/<pid>/stat       # Process statistics
/proc/<pid>/io         # I/O statistics
```

### /sys - Kernel Configuration

```bash
# CPU information
/sys/devices/system/cpu/

# Memory information
/sys/devices/system/node/

# Block devices
/sys/block/

# Network devices
/sys/class/net/
```

## Key Takeaways

1. **User/Kernel Boundary**: Strict separation enforced by hardware protection rings. This is fundamental to Linux security and stability.
2. **System Calls**: The only way user programs can access kernel services. Every file operation, network call, and process management operation goes through syscalls.
3. **Process Lifecycle**: fork → execve → exit. Understanding this helps debug process creation issues, zombie processes, and service startup problems.
4. **Signals**: Software interrupts for process communication. Essential for graceful shutdowns, debugging hung processes, and inter-process coordination.
5. **Kernel Modules**: Extend kernel without recompilation. Most device drivers and filesystem support are modules.
6. **/proc and /sys**: Windows into kernel internals. These pseudo-filesystems provide real-time access to kernel state without requiring special tools.

:::tip Production Insight
Understanding the user/kernel boundary helps you understand why certain operations require privileges and why some debugging tools need root access. When you see "Permission denied" errors, it's often because the operation requires kernel privileges that only root has.
:::

:::warning Security Implication
The user/kernel boundary is a security feature. Kernel bugs can compromise the entire system, while user-space bugs are isolated. This is why kernel security updates are critical.
:::

:::important Debugging Strategy
When troubleshooting production issues, always start by understanding:
1. Is this a user-space or kernel-space problem?
2. What system calls is the application making?
3. Are there any signals being sent/received?
4. What does /proc tell us about the process state?

This systematic approach prevents wasted time debugging in the wrong layer.
:::

## Next Steps

Continue to [System Calls, Process Lifecycle & strace Labs](./syscalls-process) for hands-on system call tracing.
