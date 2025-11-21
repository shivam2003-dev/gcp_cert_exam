# Network Troubleshooting Playbooks

## Scenario 1: SYN Flood / Connection Exhaustion

### Symptoms

- Many sockets in `SYN-RECV` state
- New connections fail or timeout
- `netstat -s | grep listen` shows overflow
- High CPU usage from kernel networking

### Investigation Steps

**Step 1: Identify SYN-RECV Connections**

```bash
# Count SYN-RECV connections
ss -tan state syn-recv | wc -l

# Show SYN-RECV connections
ss -tan state syn-recv | head -20

# Monitor backlog
watch -n1 'ss -tan state syn-recv | wc -l'
```

**Step 2: Check Backlog Settings**

```bash
# Current backlog
sysctl net.core.somaxconn
sysctl net.ipv4.tcp_max_syn_backlog

# Connection queue
ss -ln | grep LISTEN
```

**Step 3: Check for SYN Flood**

```bash
# Capture SYN packets
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0' -c 100

# Check if many SYNs from same source
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0' | awk '{print $3}' | sort | uniq -c | sort -rn
```

### Root Cause Analysis

**Common Causes:**
1. **SYN flood attack** - Malicious traffic
2. **Application not accepting** - Backlog full
3. **Slow accept()** - Application bottleneck
4. **Network issues** - Packets not reaching server

### Solution

**Immediate Fix:**

```bash
# Increase backlog
sysctl net.core.somaxconn=65535
sysctl net.ipv4.tcp_max_syn_backlog=65535

# Enable SYN cookies
sysctl net.ipv4.tcp_syncookies=1

# Rate limit with nftables
nft add rule inet filter input tcp flags syn limit rate 10/second accept
```

**Long-term Fix:**
- Fix application to accept connections faster
- Use connection pooling
- Implement rate limiting
- Use DDoS protection (CloudFlare, etc.)

### Prevention

- Monitor SYN-RECV count
- Alert when backlog > 80%
- Use SYN cookies
- Implement rate limiting

## Scenario 2: Packet Loss

### Symptoms

- High retransmission rate
- Slow network performance
- Application timeouts
- TCP retransmissions visible in `ss`

### Investigation

**Step 1: Detect Retransmissions**

```bash
# Per-connection retransmissions
ss -i dst <ip> | grep -E "retrans|rto"

# System-wide retransmissions
netstat -s | grep -i retrans

# TCP statistics
cat /proc/net/snmp | grep Tcp
# Look for: RetransSegs
```

**Step 2: Check NIC Statistics**

```bash
# Interface statistics
ip -s link show dev eth0

# Look for:
# - rx_errors
# - tx_errors
# - rx_dropped
# - tx_dropped
# - collisions
```

**Step 3: Capture Packets**

```bash
# Capture with packet loss indicators
sudo tcpdump -i eth0 -w loss.pcap 'tcp[tcpflags] & (tcp-syn|tcp-fin|tcp-rst|tcp-ack) != 0'

# Analyze in Wireshark
# Look for:
# - Duplicate ACKs
# - Out-of-order packets
# - Retransmissions
```

**Step 4: Check Network Quality**

```bash
# Ping test
ping -c 100 -i 0.1 <host>
# Look for packet loss percentage

# MTR (traceroute with stats)
mtr <host>
# Shows packet loss per hop
```

### Root Cause Analysis

**Common Causes:**
1. **Network congestion** - Too much traffic
2. **Faulty hardware** - Bad NIC, cable, switch
3. **Driver issues** - Buggy NIC driver
4. **MTU mismatch** - Fragmentation issues
5. **Buffer overflow** - Receive buffers too small

### Solution

**Immediate Fix:**

```bash
# Increase receive buffers
sysctl net.core.rmem_max=134217728
sysctl net.core.rmem_default=87380
sysctl net.ipv4.tcp_rmem="4096 87380 134217728"

# Check and fix MTU
ip link show dev eth0
# Ensure MTU matches network
```

**Long-term Fix:**
- Replace faulty hardware
- Update NIC drivers
- Fix network congestion
- Tune TCP parameters

### Prevention

- Monitor packet loss continuously
- Alert on retransmissions
- Regular network health checks
- Keep drivers updated

## Scenario 3: DNS Latency

### Symptoms

- Slow DNS lookups
- Application timeouts on DNS
- High latency for name resolution

### Investigation

**Step 1: Test DNS Resolution**

```bash
# Time DNS lookup
time nslookup example.com

# Use dig for detailed info
dig example.com

# Check DNS servers
cat /etc/resolv.conf

# Test each DNS server
dig @8.8.8.8 example.com
dig @1.1.1.1 example.com
```

**Step 2: Check systemd-resolved**

```bash
# Statistics
systemd-resolve --statistics

# Flush cache
systemd-resolve --flush-caches

# Check status
systemctl status systemd-resolved
```

**Step 3: Capture DNS Queries**

```bash
# Capture DNS traffic
sudo tcpdump -i eth0 port 53 -nn

# Filter specific queries
sudo tcpdump -i eth0 port 53 -nn 'host example.com'
```

### Root Cause Analysis

**Common Causes:**
1. **Slow DNS servers** - High latency
2. **DNS server down** - No response
3. **DNS cache issues** - Stale entries
4. **Network issues** - Packet loss to DNS
5. **Too many DNS servers** - Sequential queries

### Solution

**Immediate Fix:**

```bash
# Use faster DNS servers
# Edit /etc/resolv.conf
nameserver 8.8.8.8
nameserver 1.1.1.1

# Or use systemd-resolved
# Edit /etc/systemd/resolved.conf
[Resolve]
DNS=8.8.8.8 1.1.1.1
Cache=yes
```

**Long-term Fix:**
- Use local DNS cache (systemd-resolved, dnsmasq)
- Use reliable DNS servers
- Monitor DNS performance
- Implement DNS failover

### Prevention

- Monitor DNS latency
- Use multiple DNS servers
- Implement local caching
- Alert on DNS failures

## Scenario 4: High Connection Count

### Symptoms

- Cannot create new connections
- `ss -s` shows high connection count
- `conntrack_count` near `conntrack_max`
- Applications fail to connect

### Investigation

```bash
# Total connections
ss -s

# Connections by state
ss -tan | awk '{print $1}' | sort | uniq -c

# Connection tracking
sysctl net.netfilter.nf_conntrack_count
sysctl net.netfilter.nf_conntrack_max

# Per-process connections
ss -tanp | awk '{print $6}' | sort | uniq -c | sort -rn
```

### Root Cause Analysis

**Common Causes:**
1. **Connection leaks** - Applications not closing
2. **Too many TIME-WAIT** - Short-lived connections
3. **Connection tracking limit** - Too low
4. **Port exhaustion** - All ports in use

### Solution

**Immediate Fix:**

```bash
# Increase connection tracking
sysctl net.netfilter.nf_conntrack_max=262144

# Reduce TIME-WAIT timeout
sysctl net.ipv4.tcp_tw_timeout=30

# Enable TIME-WAIT reuse
sysctl net.ipv4.tcp_tw_reuse=1

# Increase port range
sysctl net.ipv4.ip_local_port_range="10000 65000"
```

**Long-term Fix:**
- Fix application connection leaks
- Use connection pooling
- Implement connection limits
- Monitor connection count

### Prevention

- Monitor connection count
- Alert when > 80% of limit
- Fix connection leaks
- Use connection pooling

## Scenario 5: Network Interface Down

### Symptoms

- No network connectivity
- Interface shows DOWN
- Applications cannot connect
- `ip link` shows state DOWN

### Investigation

```bash
# Check interface status
ip link show dev eth0

# Check if interface is up
ip link show dev eth0 | grep -q "state UP" && echo "UP" || echo "DOWN"

# Check for errors
ip -s link show dev eth0

# Check kernel messages
dmesg | grep -i eth0
journalctl -k | grep -i eth0
```

### Root Cause Analysis

**Common Causes:**
1. **Interface manually down** - `ip link set down`
2. **Driver issues** - Driver crash
3. **Hardware failure** - NIC failure
4. **Cable unplugged** - Physical issue
5. **Network configuration** - Misconfiguration

### Solution

**Immediate Fix:**

```bash
# Bring interface up
sudo ip link set dev eth0 up

# Restart networking
sudo systemctl restart NetworkManager
# Or
sudo systemctl restart networking

# Reload driver
sudo modprobe -r <driver>
sudo modprobe <driver>
```

**Long-term Fix:**
- Fix driver issues
- Replace faulty hardware
- Fix network configuration
- Implement redundancy

### Prevention

- Monitor interface status
- Alert on interface down
- Use redundant interfaces (bonding)
- Keep drivers updated

## Diagnostic Command Reference

### Quick Network Health Check

```bash
#!/bin/bash
echo "=== Network Health Check ==="
echo "Interface Status:"
ip link show
echo ""
echo "Routing Table:"
ip route
echo ""
echo "DNS Configuration:"
cat /etc/resolv.conf
echo ""
echo "Connection Statistics:"
ss -s
echo ""
echo "Connection Tracking:"
sysctl net.netfilter.nf_conntrack_count net.netfilter.nf_conntrack_max
echo ""
echo "Network Errors:"
ip -s link show | grep -E "errors|dropped"
```

## Best Practices

1. **Monitor continuously** - ss, conntrack, interface stats
2. **Alert on thresholds** - Connection count, packet loss
3. **Document baselines** - Know normal behavior
4. **Test DNS regularly** - Ensure resolution works
5. **Keep drivers updated** - Prevent hardware issues

:::tip Production Insight
Network issues often manifest as application timeouts. Always check network connectivity, DNS, and connection state first before diving into application code.
:::

## Next Steps

You've completed Module 5! Move to [Module 6: Linux Containers & Namespaces](../module-06-containers/namespaces-cgroups).
