# Troubleshooting Playbooks

## High Load Incident

1. `uptime` (load avg vs CPU count)
2. `vmstat 1`, `mpstat -P ALL 1`
3. Determine CPU vs I/O vs memory vs lock contention
4. Drill down with `perf`, `pidstat`, `iostat`
5. Document timeline and actions

## Hung IO Processes

```bash
ps -eo pid,state,wchan,cmd | grep ' D '
cat /proc/$(pid)/stack
```

- Check storage array
- Collect `blktrace`
- Consider remount read-only

## Zombie Processes

- Identify parent: `ps -o pid,ppid,state,cmd -p <zombie>`
- Restart parent or send SIGCHLD
- If PID 1 ignoring, treat as bug

## Escalation Decision Matrix

| Condition | Action |
|-----------|--------|
| Data loss risk | Engage storage/SRE immediately |
| Kernel panic | Capture vmcore, reboot via kdump |
| Security anomaly | Trigger IR playbook |

## Debugging Without Rebooting

- Use SysRq to dump info
- Leverage kdump + kexec for fast reboot with capture
- Avoid reboot unless: kernel panic loop, hardware failure, security patch requiring reboot

Next: [Performance Optimization & Hardening](../module-09-performance/system-tuning).
