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

```bash
# Trace syscalls for a process
strace -p <pid>

# Count syscalls
strace -c -p <pid>

# Trace specific syscalls only
strace -e trace=network -p <pid>
strace -e trace=file -p <pid>
```

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

```bash
# Follow process tree
pstree -a -p

# Monitor fork/exec events
strace -e trace=fork,execve,clone -f <command>

# Check process limits
cat /proc/<pid>/limits
```

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

```bash
# Send signal
kill -TERM <pid>

# Check signal masks
cat /proc/<pid>/status | grep Sig

# Block signals in script
trap '' SIGTERM
```

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

Kernel modules extend kernel functionality without recompiling:

```bash
# List loaded modules
lsmod

# Module information
modinfo <module_name>

# Load module
modprobe <module_name>

# Remove module
modprobe -r <module_name>

# Module parameters
cat /sys/module/<module_name>/parameters/*
```

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

1. **User/Kernel Boundary**: Strict separation enforced by hardware
2. **System Calls**: Only way to access kernel services
3. **Process Lifecycle**: fork → execve → exit
4. **Signals**: Software interrupts for process communication
5. **Kernel Modules**: Extend kernel without recompilation
6. **/proc and /sys**: Windows into kernel internals

:::tip Production Insight
Understanding the user/kernel boundary helps you understand why certain operations require privileges and why some debugging tools need root access.
:::

## Next Steps

Continue to [System Calls, Process Lifecycle & strace Labs](./syscalls-process) for hands-on system call tracing.
