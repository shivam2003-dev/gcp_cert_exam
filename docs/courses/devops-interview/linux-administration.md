---
sidebar_position: 3
---

# Linux Administration Interview Deck

Production-first Linux diagnostics for SRE/DevOps panels. Assume shell fluency; emphasize forensic depth, not command memorization.

## Rapid Triage Checklist

1. Capture `uptime`, `top -b -n1`, `vmstat 1 5` snapshots.
2. Inspect `dmesg | tail -200` for kernel signals (OOM, disk, NIC).
3. Confirm filesystems (`df -h`, `df -i`) and log directories.
4. Correlate alert timestamps with `journalctl -S "-15min"`.

## Core Questions

### 1. /var at 90%+ Capacity
<details>
<summary>What steps do you take when /var is almost full?</summary>

- Run `sudo du -xhd1 /var | sort -h` to identify culprits (usually logs, package caches, spool).
- Rotate logs via `logrotate -f /etc/logrotate.d/*` or compress `journalctl --vacuum-size=2G`.
- Move archived logs to object storage and symlink if policy allows.
- Long-term fix: add dedicated LV for `/var/log`, enforce size limits, ship logs to ELK/CloudWatch.
</details>

### 2. High CPU Utilization
<details>
<summary>How do you debug sudden CPU spikes?</summary>

- `pidstat 1 10`, `mpstat -P ALL 1 5`, `perf top` to differentiate user vs kernel.
- Check run queue (`vmstat 1` procs column). If I/O wait high, inspect storage stack.
- For noisy neighbors in containers, verify cgroups CPU quota enforcement.
- Capture `perf record` flamegraphs for recurring incidents.
</details>

### 3. SSH Access Broken
<details>
<summary>Workflow when SSH suddenly stops working.</summary>

1. Validate security group / firewall changes (cloud console or `iptables -S`).
2. Use out-of-band console (AWS SSM, Azure Serial Console) to inspect `/var/log/auth.log` or `journalctl -u sshd`.
3. Ensure host keys & authorized_keys intact; check PAM/SSSD.
4. If config corrupted, use SSM Run Command to push known-good `/etc/ssh/sshd_config` and restart service.
</details>

### 4. Bulk User Creation from CSV
<details>
<summary>Describe how you automate compliant user provisioning.</summary>

Parse CSV with `while IFS=, read user uid gid; do ...; done < users.csv`, call `useradd -u "$uid" -g "$gid" -m "$user"`, enforce `/etc/login.defs` password policy, and push SSH keys via `authorized_keys`. Log every action for SOX audits and integrate with IAM where possible.
</details>

### 5. Recovering from Lost PEM File
<details>
<summary>Instance key lost—what now?</summary>

For AWS:
- Stop instance, detach root volume.
- Attach to rescue instance, mount, add new public key to `~/.ssh/authorized_keys`.
- Reattach volume, boot original instance.
Alternative: enable SSM agent earlier to avoid key dependency altogether.
</details>

## Hands-on Drill

Create a script `system_health.sh` that captures CPU, memory, disk, top 5 CPU-consuming processes, compresses output, and ships it to S3/Azure Blob for postmortems.

## Additional References

- Netflix Tech Blog – [Linux performance incident write-ups](https://netflixtechblog.com/)
- Brendan Gregg – [Linux Performance Tools](http://www.brendangregg.com/linuxperf.html)
- Red Hat – [SSHD hardening guide](https://access.redhat.com/documentation/)
