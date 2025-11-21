# Packet Flow & Tracing

## Packet Journey: Inbound

### Complete Flow

```
1. NIC receives frame
   ↓
2. DMA to kernel memory
   ↓
3. Interrupt fires
   ↓
4. NAPI polling (softirq)
   ↓
5. Packet enters kernel RX queue
   ↓
6. Netfilter PREROUTING hook
   ↓
7. Routing decision
   ├─→ INPUT (local)
   └─→ FORWARD (routed)
   ↓
8. Netfilter INPUT/FORWARD hook
   ↓
9. Transport layer (TCP/UDP)
   ↓
10. Socket receive queue
   ↓
11. Application recv()
```

### Detailed Steps

**Step 1-2: NIC Reception & DMA**
- NIC receives Ethernet frame
- DMA transfers to kernel memory (sk_buff)
- Interrupt raised

**Step 3-4: Interrupt Handling**
- Hardware interrupt handler runs
- Disables interrupts, schedules softirq
- NAPI polling processes packets

**Step 5: RX Queue**
- Packet queued in per-CPU queue
- Processed by softirq context

**Step 6: Netfilter PREROUTING**
- iptables/nftables rules applied
- NAT (if configured)
- Connection tracking

**Step 7: Routing Decision**
- Kernel routing table consulted
- Determines: INPUT or FORWARD

**Step 8: Netfilter INPUT/FORWARD**
- Firewall rules applied
- Final filtering

**Step 9: Transport Layer**
- TCP/UDP processing
- Port matching
- Connection state updates

**Step 10-11: Socket Delivery**
- Queued to socket receive buffer
- Application wakes (if blocked)
- Data copied to user space

## Packet Journey: Outbound

### Complete Flow

```
1. Application send()
   ↓
2. Socket send buffer
   ↓
3. Transport layer (TCP/UDP)
   ↓
4. Netfilter OUTPUT hook
   ↓
5. Routing decision
   ↓
6. Netfilter POSTROUTING hook
   ↓
7. Network device queue
   ↓
8. Device driver
   ↓
9. DMA to NIC
   ↓
10. NIC transmits
```

## Tracing Packets

### tcpdump

```bash
# Basic capture
sudo tcpdump -i eth0

# Filter by port
sudo tcpdump -i eth0 port 443

# Filter by host
sudo tcpdump -i eth0 host 192.168.1.1

# Filter by protocol
sudo tcpdump -i eth0 tcp
sudo tcpdump -i eth0 udp

# Complex filters
sudo tcpdump -i eth0 'tcp port 443 and host 192.168.1.1'

# Save to file
sudo tcpdump -i any -w /tmp/capture.pcap

# Read from file
tcpdump -r /tmp/capture.pcap

# Verbose output
sudo tcpdump -i eth0 -vvv

# Show packet contents
sudo tcpdump -i eth0 -X
```

### ss (Socket Statistics)

```bash
# All sockets
ss -a

# TCP sockets
ss -t

# UDP sockets
ss -u

# Listening sockets
ss -l

# With process info
ss -p

# With numeric addresses
ss -n

# Filter by state
ss -tan state established
ss -tan state time-wait

# Filter by port
ss -tan 'sport = :443'
ss -tan 'dport = :443'

# Detailed info
ss -tni
```

### dropwatch

```bash
# Install
# Ubuntu: apt-get install dropwatch

# Monitor dropped packets
sudo dropwatch -l kas

# Shows:
# - Where packets are dropped
# - Kernel function name
# - Drop count
```

### perf trace

```bash
# Trace network events
sudo perf trace -e net:* -p <pid>

# Trace specific syscalls
sudo perf trace -e syscalls:sys_enter_sendto -p <pid>
sudo perf trace -e syscalls:sys_enter_recvfrom -p <pid>
```

## Connection Tracking (conntrack)

### Viewing Connections

```bash
# List all connections
sudo conntrack -L

# Filter by protocol
sudo conntrack -L -p tcp

# Filter by source
sudo conntrack -L -s 192.168.1.1

# Filter by destination
sudo conntrack -L -d 192.168.1.1

# Show statistics
sudo conntrack -S

# Count connections
sysctl net.netfilter.nf_conntrack_count
sysctl net.netfilter.nf_conntrack_max
```

### Managing Connections

```bash
# Delete specific connection
sudo conntrack -D -s 192.168.1.1 -d 10.0.0.1 -p tcp --dport 443

# Delete all connections
sudo conntrack -F

# Flush connection table
sudo conntrack -F
```

### Connection Tracking Issues

**Symptoms:**
- New connections fail
- `nf_conntrack_count` near `nf_conntrack_max`

**Fix:**
```bash
# Increase limit
sysctl net.netfilter.nf_conntrack_max=262144

# Reduce timeout
sysctl net.netfilter.nf_conntrack_tcp_timeout_established=3600
```

## MTU & Fragmentation

### Maximum Transmission Unit (MTU)

```bash
# Check MTU
ip link show dev eth0
# MTU: 1500

# Change MTU
sudo ip link set dev eth0 mtu 9000  # Jumbo frames

# Path MTU Discovery
ping -c3 -M do -s 8972 <host>
# -M do: Don't fragment
# -s: Packet size
```

### Fragmentation

**When fragmentation occurs:**
- Packet size > MTU
- DF (Don't Fragment) bit not set

**Checking fragmentation:**
```bash
# Fragmentation statistics
netstat -s | grep -i fragment

# IP statistics
cat /proc/net/snmp | grep -i ip
```

## TCP Retransmissions

### Detecting Retransmissions

```bash
# Per-connection
ss -i dst <ip> | grep -E "retrans|rto"

# System-wide
netstat -s | grep -i retrans

# TCP statistics
cat /proc/net/snmp | grep Tcp
```

### Retransmission Causes

1. **Packet loss** - Network congestion
2. **Timeout** - Slow network
3. **Out-of-order** - Route changes
4. **Buffer overflow** - Receiver overwhelmed

### Investigating Retransmissions

```bash
# Capture with tcpdump
sudo tcpdump -i eth0 -w retrans.pcap 'tcp[tcpflags] & (tcp-syn|tcp-ack|tcp-fin|tcp-rst) != 0'

# Analyze in Wireshark
# Look for duplicate ACKs, retransmissions

# Check network quality
ping -c 100 -i 0.1 <host>
# Look for packet loss
```

## NIC Offloads

### Common Offloads

**Checksum offload:**
- Hardware calculates checksums
- Reduces CPU usage

**TCP segmentation offload (TSO):**
- Hardware segments large packets
- Reduces CPU usage

**Large receive offload (LRO):**
- Hardware combines packets
- Can cause issues with some protocols

### Checking Offloads

```bash
# View offload settings
ethtool -k eth0

# Key offloads:
# rx-checksumming: on
# tx-checksumming: on
# tcp-segmentation-offload: on
# large-receive-offload: off
```

### Disabling Offloads (Debugging)

```bash
# Disable TSO
sudo ethtool -K eth0 tso off

# Disable checksum offload
sudo ethtool -K eth0 rx off tx off

# Re-enable
sudo ethtool -K eth0 tso on
sudo ethtool -K eth0 rx on tx on
```

**Warning:** Only disable for debugging. Offloads improve performance.

## Packet Capture Best Practices

### When to Capture

- Network issues (timeouts, packet loss)
- Security incidents
- Performance problems
- Protocol debugging

### Capture Strategy

```bash
# 1. Limit capture size
sudo tcpdump -i eth0 -w capture.pcap -C 100
# Rotates at 100MB

# 2. Limit packet count
sudo tcpdump -i eth0 -c 1000 -w capture.pcap

# 3. Use filters
sudo tcpdump -i eth0 'tcp port 443' -w capture.pcap

# 4. Capture on specific interface
sudo tcpdump -i any -w capture.pcap
# Captures all interfaces
```

### Analyzing Captures

```bash
# Basic analysis
tcpdump -r capture.pcap

# Count packets
tcpdump -r capture.pcap | wc -l

# Filter in analysis
tcpdump -r capture.pcap 'tcp port 443'

# Use Wireshark for GUI analysis
wireshark capture.pcap
```

## Best Practices

1. **Use filters** - Reduce capture size
2. **Monitor conntrack** - Prevent exhaustion
3. **Check MTU** - Avoid fragmentation
4. **Profile retransmissions** - Identify network issues
5. **Understand offloads** - Don't disable unless debugging

:::tip Production Insight
Packet tracing is essential for network troubleshooting. tcpdump and ss are your primary tools. Use filters to focus on relevant traffic.
:::

## Next Steps

Continue to [Network Troubleshooting Playbooks](./network-troubleshooting) for real-world scenarios.
