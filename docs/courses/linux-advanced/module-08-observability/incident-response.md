# Incident Response Workflow

## Where to Start When Linux is Slow

1. **Validate alert** – is it customer-impacting?
2. **Capture baseline** – `uptime`, `top`, `vmstat 1`, `iostat 1`
3. **Identify dominant resource** – CPU, memory, IO, network
4. **Drill down** – Process-level, cgroup-level, hardware-level

### Quick Triage Command Set

```bash
uptime
vmstat 1 5
mpstat -P ALL 1 3
iostat -xz 1
sar -n DEV 1 5
```

## Reading Logs Effectively

- `journalctl -p err -b`
- `journalctl -t kernel -n 200`
- `ausearch` for security incidents

### Log Filtering Tips

```bash
journalctl -u kubelet -S "-10min"
journalctl --grep "OOM" -o short-precise
```

## Unresponsive Systems

- Use magic SysRq: `echo w > /proc/sysrq-trigger` for stack traces
- Capture `vmcore` via kdump for kernel hangs
- If console accessible, use `ps -eo pid,state,wchan,cmd`

## Zombie & Hung IO Handling

- Identify parent PIDs and restart gracefully
- For hung IO, gather `sysrq-t` and `sysrq-w` stacks

Next: [Log & Metric Playbooks](./log-analysis).
