# Network Troubleshooting Playbooks

## Scenario: SYN Flood / Connection Exhaustion

**Symptoms**
- Many sockets in `SYN-RECV`
- `netstat -s | grep listen` shows overflow

**Investigation**
```bash
ss -tn state syn-recv | head

# Monitor backlog
watch -n1 cat /proc/sys/net/ipv4/tcp_max_syn_backlog
```

**Mitigations**
- Increase backlog: `sysctl net.ipv4.tcp_max_syn_backlog=65535`
- Enable SYN cookies: `sysctl net.ipv4.tcp_syncookies=1`
- Rate-limit with nftables

## Scenario: Packet Loss

```bash
# Detect retransmits
ss -tpi | grep retrans

# Capture with packet loss statistics
tcpdump -i eth0 -nn -vv 'tcp[tcpflags] & (tcp-syn|tcp-fin|tcp-rst) != 0'
```

Check NIC counters:
```bash
ip -s link show dev eth0
```

## Scenario: DNS Latency

- Use `systemd-resolve --statistics`
- Inspect `/etc/resolv.conf` ordering
- Capture DNS queries: `tcpdump -ni eth0 port 53`

## On-Call Checklist

- Maintain baseline of `ss -s`, `netstat -s`
- Alert when conntrack table >80%
- Document `sysctl` networking defaults
- Keep `ip a`, `ip route` snapshots

Next: [Linux Containers & Namespaces](../module-06-containers/namespaces-cgroups).
