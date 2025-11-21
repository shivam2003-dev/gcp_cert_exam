# Linux Process Model

## Processes vs Threads

- **Process**: own virtual address space, file descriptor table, credentials
- **Thread**: shares address space/FDs with siblings, scheduled independently
- Linux implements threads via `clone()` with specific flags (`CLONE_VM`, `CLONE_FS`, etc.)

```bash
# Show threads per process
ps -eLf | head

# Map thread IDs to CPU usage
pidstat -t 1 5
```

## Process States

| State | Description | Indicator |
|-------|-------------|-----------|
| R | Running or runnable | `%CPU` > 0 |
| D | Uninterruptible sleep (usually I/O) | disk pressure |
| S | Interruptible sleep | waiting on event |
| T | Stopped | debugging or SIGTSTP |
| Z | Zombie | child not reaped |

```bash
ps -eo pid,ppid,state,comm,wchan | head
```

## Context Switching

- Hardware context (registers, PC) saved/restored on switch
- Frequent switches degrade performance
- Monitor with `vmstat 1` (`cs` column)

```bash
# Sample context switches per process
pidstat -w -p <pid> 1
```

## CPU Affinity & Pinning

```bash
# Display CPU affinity mask
taskset -cp <pid>

# Pin process to specific CPUs
taskset -cp 0,1 <pid>

# Restrict service via systemd
systemctl set-property nginx.service AllowedCPUs=0-3
```

## Real-Time Scheduling

Policies: `SCHED_FIFO`, `SCHED_RR`, `SCHED_DEADLINE`

```bash
# Set RT priority
chrt -r -p 50 <pid>

# View scheduling policy
chrt -p <pid>
```

**Warnings:**
- RT tasks can starve normal tasks; always pin and watchdog them
- Use cgroups to limit runaway RT workloads

## Tools Recap

- `ps`, `pidstat`, `top`, `htop`
- `taskset`, `chrt`, `numactl`
- `/proc/<pid>/sched`, `/proc/<pid>/status`

Next: [CFS Scheduler Internals](./cpu-scheduler).
