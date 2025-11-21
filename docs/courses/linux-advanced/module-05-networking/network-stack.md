# Linux Network Stack Internals

## Overview

The Linux networking stack is a complex system handling everything from packet reception to application delivery. Understanding its internals is essential for troubleshooting network issues and optimizing performance.

## Network Stack Layers

### Complete Stack

```
Application Layer
    ↓
Socket API (libc)
    ↓
Transport Layer (TCP/UDP)
    ↓
Network Layer (IP)
    ↓
Netfilter Hooks
    ↓
Network Device Driver
    ↓
Hardware (NIC)
```

### Layer Responsibilities

**Application Layer:**
- Makes socket calls (socket, bind, listen, connect, send, recv)
- Uses libc wrappers

**Socket Layer:**
- Manages socket structures
- Handles file descriptors
- Queues data

**Transport Layer:**
- TCP: Reliable, connection-oriented
- UDP: Unreliable, connectionless
- Handles ports, sequencing, flow control

**Network Layer:**
- IP routing
- Fragmentation
- ICMP handling

**Netfilter:**
- Firewall rules (iptables/nftables)
- NAT
- Connection tracking

**Device Driver:**
- Communicates with NIC
- Handles interrupts
- DMA operations

## Socket Buffers (SKB)

### Structure

Each packet is encapsulated in `struct sk_buff`:
- Packet data
- Headers (Ethernet, IP, TCP/UDP)
- Metadata (protocol, source, destination)
- Pointers to next/prev in queue

### SKB Lifecycle

1. **Allocation**: Driver allocates SKB
2. **Population**: Headers and data added
3. **Traversal**: Passes through stack
4. **Processing**: Each layer processes
5. **Deallocation**: Freed after delivery

### Inspecting Socket Buffers

```bash
# Socket statistics
ss -s

# Socket details
ss -tni

# Connection info
ss -tnp
```

## TCP/IP Stack

### TCP States

```
CLOSED
    ↓
LISTEN (server)
    ↓
SYN-SENT (client) / SYN-RECV (server)
    ↓
ESTABLISHED
    ↓
FIN-WAIT-1 → FIN-WAIT-2
    ↓
TIME-WAIT
    ↓
CLOSED
```

### TCP State Inspection

```bash
# All TCP connections
ss -tan

# By state
ss -tan state established
ss -tan state time-wait
ss -tan state syn-recv

# With process info
ss -tanp
```

### TCP Parameters

```bash
# Connection backlog
sysctl net.core.somaxconn
sysctl net.ipv4.tcp_max_syn_backlog

# TIME-WAIT reuse
sysctl net.ipv4.tcp_tw_reuse

# Port range
sysctl net.ipv4.ip_local_port_range

# Keepalive
sysctl net.ipv4.tcp_keepalive_time
sysctl net.ipv4.tcp_keepalive_probes
sysctl net.ipv4.tcp_keepalive_intvl
```

### TCP Tuning

```bash
# Increase buffers
sysctl net.core.rmem_max=134217728
sysctl net.core.wmem_max=134217728
sysctl net.ipv4.tcp_rmem="4096 87380 134217728"
sysctl net.ipv4.tcp_wmem="4096 65536 134217728"

# Fast open
sysctl net.ipv4.tcp_fastopen=3

# Congestion control
sysctl net.ipv4.tcp_congestion_control
# Available: cubic, reno, bbr
```

## Netfilter & nftables

### Netfilter Hooks

```
PREROUTING → Routing Decision → INPUT/FORWARD → OUTPUT → POSTROUTING
```

**Hook Points:**
- **PREROUTING**: Before routing decision
- **INPUT**: Packets destined for local system
- **FORWARD**: Packets being forwarded
- **OUTPUT**: Packets from local system
- **POSTROUTING**: Before leaving system

### nftables (Modern Replacement for iptables)

```bash
# List rules
nft list ruleset

# Add table
nft add table inet filter

# Add chain
nft add chain inet filter input { type filter hook input priority 0; }

# Add rule
nft add rule inet filter input tcp dport 22 accept

# Save rules
nft list ruleset > /etc/nftables.conf
```

### Connection Tracking

```bash
# View connections
conntrack -L

# Count connections
sysctl net.netfilter.nf_conntrack_count
sysctl net.netfilter.nf_conntrack_max

# Delete connection
conntrack -D -s <src_ip> -d <dst_ip> -p tcp --dport <port>
```

## Network Queues

### Queuing Disciplines (qdisc)

Each network interface has a qdisc:

**pfifo_fast (default):**
- Three priority bands
- Simple FIFO per band

**fq_codel:**
- Fair queuing
- CoDel AQM
- Good for mixed traffic

**htb (Hierarchical Token Bucket):**
- Bandwidth limiting
- Traffic shaping

### Inspecting Queues

```bash
# Show qdisc
tc qdisc show dev eth0

# Show class
tc class show dev eth0

# Show filters
tc filter show dev eth0
```

### Configuring Queues

```bash
# Replace with fq_codel
tc qdisc replace dev eth0 root fq_codel

# Add HTB for bandwidth limiting
tc qdisc add dev eth0 root handle 1: htb default 30
tc class add dev eth0 parent 1: classid 1:1 htb rate 100mbit
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 50mbit ceil 100mbit
```

## Network Device Drivers

### Driver Types

- **Kernel drivers**: Built-in or modules
- **DPDK**: Userspace drivers (bypass kernel)
- **XDP**: eBPF-based packet processing

### Inspecting Drivers

```bash
# Driver info
ethtool -i eth0

# Driver statistics
ethtool -S eth0

# Driver parameters
modinfo <driver_name>
```

## Network Interface Statistics

### Interface Stats

```bash
# Basic stats
ip -s link show dev eth0

# Detailed stats
cat /proc/net/dev

# Per-queue stats
cat /sys/class/net/eth0/statistics/*
```

### Key Metrics

- **rx_bytes/rx_packets**: Received
- **tx_bytes/tx_packets**: Transmitted
- **rx_errors/rx_dropped**: Receive errors
- **tx_errors/tx_dropped**: Transmit errors
- **collisions**: Collision count (half-duplex)

## Network Performance

### Measuring Throughput

```bash
# iperf3
iperf3 -s  # Server
iperf3 -c <server>  # Client

# With options
iperf3 -c <server> -t 60 -P 4  # 4 parallel streams
```

### Measuring Latency

```bash
# ping
ping -c 10 <host>

# With statistics
ping -c 100 -i 0.1 <host>

# traceroute
traceroute <host>
```

### Monitoring Network

```bash
# Continuous monitoring
sar -n DEV 1

# Per-interface
ifstat -i eth0 1

# Network connections
ss -s
netstat -s
```

## Best Practices

1. **Monitor network stats** - Catch issues early
2. **Tune TCP parameters** - Based on workload
3. **Use appropriate qdisc** - fq_codel for most cases
4. **Monitor connection tracking** - Prevent exhaustion
5. **Profile network stack** - Use perf, tcpdump

:::tip Production Insight
Network issues often manifest as application timeouts. Understanding the stack helps you identify where the problem is (application, TCP, IP, or hardware).
:::

## Next Steps

Continue to [Packet Flow & Tracing](./packet-flow) to understand how packets flow through the stack.
