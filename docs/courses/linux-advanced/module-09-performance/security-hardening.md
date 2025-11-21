# Security Hardening & Audit

## Kernel Hardening

```bash
sysctl kernel.kptr_restrict=2
sysctl kernel.dmesg_restrict=1
sysctl kernel.randomize_va_space=2
sysctl net.ipv4.conf.all.rp_filter=1
```

## SELinux / AppArmor

```bash
sestatus
semanage boolean -l | head

# Enable for containerized workloads
setenforce 1
```

## Auditd

```bash
# Enable rules
audctl -w /etc/shadow -p wa -k shadow_changes
audctl -a always,exit -F arch=b64 -S execve -k exec_log

# Query
ausearch -k shadow_changes
```

## Hardening Checklist

- Minimal packages (use CIS benchmarks)
- Enforce least privilege (sudoers, capabilities)
- Enable automatic updates or patch pipeline
- Implement file integrity monitoring (AIDE, tripwire)

Next: [Production Failure Scenarios](../module-10-failures/kernel-panic).
