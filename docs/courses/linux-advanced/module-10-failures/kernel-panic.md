# Failure Scenario: Kernel Panic Analysis

## Symptoms
- Console shows panic stack trace
- System reboots unexpectedly
- `/var/crash` contains vmcore (if kdump enabled)

## Investigation Steps

1. **Collect logs**
   ```bash
   journalctl -b -1 -k | tail -100
   ```
2. **Analyze vmcore**
   ```bash
   crash /usr/lib/debug/lib/modules/$(uname -r)/vmlinux /var/crash/<vmcore>
   bt
   ps
   ```
3. **Identify offending module** – look at stack frames, taint flags
4. **Check hardware** – IPMI SEL logs, ECC errors

## Tools
- `kdump`, `crash`, `makedumpfile`
- Vendor diagnostics (HP iLO, Dell iDRAC)

## Fix
- Apply kernel patch or driver update
- Disable problematic module: `blacklist module_name`
- Replace hardware if fault persists

## Prevention
- Keep kernel updated
- Enable `kdump`
- Monitor hardware health (smartd, IPMI)
