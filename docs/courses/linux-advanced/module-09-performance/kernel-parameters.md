# Kernel Parameters & sysctl Deep Dive

## Managing sysctl

```bash
# Temporary
sysctl net.ipv4.tcp_fin_timeout=15

# Persistent
echo 'net.ipv4.tcp_fin_timeout = 15' | sudo tee /etc/sysctl.d/95-tcp-fin-timeout.conf
sysctl --system
```

## Key Categories

### Networking

- `net.ipv4.tcp_max_syn_backlog`
- `net.ipv4.tcp_tw_reuse`
- `net.core.somaxconn`

### Memory

- `vm.overcommit_memory`
- `vm.overcommit_ratio`
- `vm.swappiness`

### Filesystem

- `fs.file-max`
- `fs.inotify.max_user_watches`

### Security

- `kernel.kptr_restrict`
- `kernel.dmesg_restrict`

## Verification

```bash
sysctl -a | grep tcp
```

**Tip:** Use version control for `/etc/sysctl.d`. Track history like application code.

Next: [Security Hardening & Audit](./security-hardening).
