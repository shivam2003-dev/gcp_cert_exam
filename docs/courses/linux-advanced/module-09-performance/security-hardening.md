# Security Hardening & Audit

## Overview

Security hardening is essential for production Linux systems. This module covers kernel hardening, mandatory access controls, and audit logging.

## Kernel Hardening

### Kernel Pointer Restriction

```bash
# Restrict kernel pointer access
sysctl kernel.kptr_restrict=2
# 0 = no restriction
# 1 = restricted (default)
# 2 = always restricted

# Prevents information leaks through /proc/kallsyms
```

### dmesg Restriction

```bash
# Restrict dmesg access
sysctl kernel.dmesg_restrict=1
# 0 = all users can read
# 1 = only root can read

# Prevents information leaks through dmesg
```

### Address Space Layout Randomization (ASLR)

```bash
# Enable ASLR
sysctl kernel.randomize_va_space=2
# 0 = disabled
# 1 = conservative (stack only)
# 2 = full (default)

# Makes exploitation harder
```

### Reverse Path Filtering

```bash
# Prevent IP spoofing
sysctl net.ipv4.conf.all.rp_filter=1
sysctl net.ipv4.conf.default.rp_filter=1
# 0 = disabled
# 1 = strict (default)
# 2 = loose

# Validates source IP addresses
```

### ICMP Redirects

```bash
# Disable ICMP redirects
sysctl net.ipv4.conf.all.accept_redirects=0
sysctl net.ipv4.conf.default.accept_redirects=0

# Prevent route manipulation attacks
```

### Source Routing

```bash
# Disable source routing
sysctl net.ipv4.conf.all.accept_source_route=0
sysctl net.ipv4.conf.default.accept_source_route=0

# Prevents source routing attacks
```

### SYN Cookies

```bash
# Enable SYN cookies
sysctl net.ipv4.tcp_syncookies=1
# 0 = disabled
# 1 = enabled (default)

# Protects against SYN flood attacks
```

## SELinux

### Overview

SELinux (Security-Enhanced Linux) provides mandatory access control (MAC).

### Checking Status

```bash
# Check SELinux status
sestatus

# Check mode
getenforce
# Enforcing, Permissive, or Disabled
```

### Modes

**Enforcing:**
- SELinux policies enforced
- Violations denied and logged

**Permissive:**
- Policies checked but not enforced
- Violations logged only
- Useful for troubleshooting

**Disabled:**
- SELinux completely disabled
- Not recommended

### Managing SELinux

```bash
# Set mode
setenforce 1  # Enforcing
setenforce 0  # Permissive

# Make persistent
# Edit /etc/selinux/config
SELINUX=enforcing
```

### SELinux Contexts

```bash
# View file context
ls -Z /var/www/html

# View process context
ps -Z

# Change context
chcon -t httpd_sys_content_t /var/www/html
```

### Troubleshooting SELinux

```bash
# Check for denials
ausearch -m avc -ts recent

# Generate policy module
audit2allow -M mymodule < /var/log/audit/audit.log
semodule -i mymodule.pp

# Temporarily allow
setsebool -P httpd_can_network_connect 1
```

## AppArmor

### Overview

AppArmor provides application-level MAC (alternative to SELinux).

### Status

```bash
# Check status
aa-status

# List profiles
aa-status | grep profiles
```

### Profiles

```bash
# List loaded profiles
aa-status

# Enable profile
aa-enforce /etc/apparmor.d/usr.sbin.mysqld

# Disable profile
aa-disable /etc/apparmor.d/usr.sbin.mysqld

# Complain mode (log only)
aa-complain /etc/apparmor.d/usr.sbin.mysqld
```

## Auditd

### Overview

auditd provides comprehensive audit logging for security events.

### Configuration

```bash
# Main config
/etc/audit/auditd.conf

# Rules
/etc/audit/rules.d/audit.rules
```

### Key Configuration Options

```bash
# /etc/audit/auditd.conf
max_log_file = 50
num_logs = 5
space_left = 100
admin_space_left = 50
```

### Audit Rules

```bash
# Watch file
auditctl -w /etc/shadow -p wa -k shadow_changes

# Watch directory
auditctl -w /etc/ -p wa -k etc_changes

# System call auditing
auditctl -a always,exit -F arch=b64 -S execve -k exec_log

# Make persistent
# Add to /etc/audit/rules.d/audit.rules
```

### Querying Audit Logs

```bash
# Search by key
ausearch -k shadow_changes

# Search by time
ausearch -ts recent
ausearch -ts 01/15/2024 10:00:00

# Search by user
ausearch -ua 1000

# Search by system call
ausearch -sc execve

# Generate report
aureport
aureport -u  # User report
aureport -l  # Login report
```

## File Integrity Monitoring

### AIDE (Advanced Intrusion Detection Environment)

```bash
# Install
apt-get install aide

# Initialize database
aideinit

# Check integrity
aide --check

# Update database
aide --update
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

### Tripwire

```bash
# Install
apt-get install tripwire

# Initialize database
tripwire --init

# Check integrity
tripwire --check

# Update database
tripwire --update
```

## Firewall Configuration

### iptables

```bash
# Basic rules
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4
```

### nftables

```bash
# Create table
nft add table inet filter

# Create chain
nft add chain inet filter input { type filter hook input priority 0; }

# Add rules
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input tcp dport 80 accept
nft add rule inet filter input tcp dport 443 accept
nft add rule inet filter input drop

# Save
nft list ruleset > /etc/nftables.conf
```

## SSH Hardening

### Configuration

```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Protocol 2
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
```

### Key Management

```bash
# Generate key
ssh-keygen -t ed25519 -C "user@host"

# Copy to server
ssh-copy-id user@server

# Disable password auth after key setup
```

## System Hardening Checklist

### Basic Hardening

- [ ] Disable unnecessary services
- [ ] Remove unused packages
- [ ] Keep system updated
- [ ] Configure firewall
- [ ] Harden SSH
- [ ] Enable auditd
- [ ] Configure log rotation
- [ ] Set up file integrity monitoring

### Advanced Hardening

- [ ] Enable SELinux/AppArmor
- [ ] Configure kernel parameters
- [ ] Implement least privilege
- [ ] Use capabilities instead of root
- [ ] Encrypt sensitive data
- [ ] Implement network segmentation
- [ ] Set up intrusion detection
- [ ] Regular security audits

## Compliance Standards

### CIS Benchmarks

```bash
# Install CIS-CAT
# Run assessment
cis-cat-full -b -s

# Apply recommendations
# Review and test before applying
```

### STIG (Security Technical Implementation Guide)

```bash
# Install OpenSCAP
apt-get install openscap-scanner

# Run STIG scan
oscap xccdf eval --profile stig --results stig-results.xml /usr/share/xml/scap/ssg/content/ssg-rhel7-xccdf.xml
```

## Best Practices

1. **Defense in depth** - Multiple security layers
2. **Least privilege** - Minimum required access
3. **Regular updates** - Keep system patched
4. **Monitor continuously** - Audit logs, alerts
5. **Test changes** - Verify security improvements

:::warning Security Warning
Security hardening can break applications. Test thoroughly in staging before applying to production. Monitor logs after changes.
:::

## Next Steps

You've completed Module 9! Move to [Module 10: Production Failure Scenarios](../module-10-failures/kernel-panic).
