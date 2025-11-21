# Failure Scenario: OOM Kill Storm

## Symptoms
- Multiple services killed by OOM within minutes
- `journalctl -k` shows repeated `Out of memory` entries
- Memory graphs show sawtooth pattern

## Investigation

1. Review OOM logs:
   ```bash
   journalctl -k -g "Out of memory"
   ```
2. Identify cgroup victims:
   ```bash
   cat /sys/fs/cgroup/system.slice/*/memory.events | grep oom
   ```
3. Check swap behavior (`vmstat 1`)
4. Inspect application memory leaks (`pidstat -r`, `smem`)

## Fix
- Raise memory limits or add nodes
- Cap noisy neighbors with `MemoryMax`
- Reduce cache pressure (drop caches, tune `vm.vfs_cache_pressure`)

## Prevention
- Configure `MemoryHigh` and `MemoryMax` per service
- Use memory QoS on Kubernetes (Guaranteed pods for critical services)
- Alert on rising `memory.events oom_kill`
