# Packet Flow & Tracing

## Packet Journey (Inbound)

1. NIC receives frame → DMA to memory
2. Interrupt fires (NAPI polls)
3. Packet enters kernel RX queue
4. Netfilter PREROUTING hook
5. Routing decision: INPUT vs FORWARD
6. Socket receive queue
7. Application `recv()`

## Tracing Packets

### tcpdump

```bash
sudo tcpdump -i eth0 'port 443' -nn -vv

# Capture to file
sudo tcpdump -i any -w /tmp/incident.pcap
```

### ss (socket statistics)

```bash
ss -tni 'sport = :443'
ss -uap
```

### dropwatch

```bash
sudo dropwatch -l kas
```

### perf/nettrace

```bash
perf trace -e net:* -p <pid>
```

## conntrack Debugging

```bash
sudo conntrack -L | head

# Delete stuck entry
sudo conntrack -D -s <src> -d <dst> -p tcp --dport 443
```

## MTU & Fragmentation

```bash
ip link show dev eth0
ping -c3 -M do -s 8972 <host>  # Path MTU discovery
```

## TCP Retransmissions

```bash
ss -i dst <ip> | grep -E 'retrans|rto'

# Kernel metrics
netstat -s | grep retrans
```

## NIC Offloads

```bash
ethtool -k eth0 | egrep 'rx-checksumming|tx-checksumming|tcp-segmentation'
```

Disable offloads for debugging only.

Next: [Network Troubleshooting Playbooks](./network-troubleshooting).
