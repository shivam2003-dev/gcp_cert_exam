# CPU Troubleshooting Labs

## Scenario 1: Runaway Process Saturating CPU

**Symptoms**
- Load average spikes
- `top` shows single PID consuming >300% CPU on 4-core box

**Investigation**
```bash
# Identify offender
pidstat -u 1 5

# Inspect threads
ps -Lp <pid> -o pid,tid,pcpu,comm

# Trace syscalls
strace -p <pid> -c
```

**Fix**
- Throttle with `cpulimit` or `systemd-run -p CPUQuota`
- Apply hotfix or restart service

**Prevention**
- Add CPU quotas via cgroups
- Implement circuit breakers in application

## Scenario 2: High System CPU (sys%)

**Symptoms**
- `%sy` in `top` > 40%
- Interrupt storms

**Investigation**
```bash
# Check softirq/hardirq time
mpstat -P ALL 1

# Identify IRQ affinity
cat /proc/interrupts | column -t | head

# Trace kernel hotspots
perf top -G
```

**Fix**
- Rebalance IRQ affinity with `irqbalance` or manual `echo <mask> > /proc/irq/<n>/smp_affinity`
- Update NIC driver/firmware

## Scenario 3: CPU Starvation in Contention

**Symptoms**
- PSI `full` values spike
- Latency-sensitive services miss deadlines

**Investigation**
```bash
# Pressure metrics
cat /proc/pressure/cpu

# Cgroup CPU weights
systemd-cgls --cpu
systemctl status <service> --no-pager -l
```

**Fix**
- Increase `CPUWeight` for critical units
- Isolate CPUs with `isolcpus` kernel parameter or `cpuset` cgroup

## Tools Recap

- `pidstat`, `mpstat`, `sar -P`
- `perf`, `flamegraphs`
- `/proc/pressure/cpu`
- `systemd` resource controls

Next: [Memory Management & Tuning](../module-03-memory/virtual-memory).
