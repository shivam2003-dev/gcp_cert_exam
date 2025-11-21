# Linux Network Stack Internals

## Layers

```
Application (socket)
↓
Socket API / libc
↓
Protocol stack (TCP/UDP/IP)
↓
Netfilter hooks
↓
NIC driver
↓
Hardware
```

## Socket Buffers (SKB)

- Packets encapsulated in `struct sk_buff`
- Queues: backlog, receive, transmit

```bash
# Inspect TCP parameters
sysctl net.ipv4.tcp_max_syn_backlog
sysctl net.core.netdev_max_backlog
```

## TCP/IP Stack

### TCP States

```
LISTEN → SYN-SENT/SYN-RECV → ESTABLISHED → FIN_WAIT / CLOSE_WAIT → TIME_WAIT
```

```bash
ss -tanp
ss -o state time-wait | head
```

### Tuning Parameters

```bash
sysctl net.ipv4.tcp_tw_reuse=1
sysctl net.ipv4.ip_local_port_range="10000 65000"
```

## Netfilter & nftables

- Hooks: PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING
- Use nftables for modern firewalls

```bash
nft list ruleset

# Track conntrack table size
sysctl net.netfilter.nf_conntrack_count
sysctl net.netfilter.nf_conntrack_max
```

## Network Queues

- **qdisc** (queuing discipline) per interface (`pfifo_fast`, `fq_codel`)
- Configure with `tc`

```bash
# View qdisc
tc -s qdisc show dev eth0

# Apply fq_codel
tc qdisc replace dev eth0 root fq_codel
```

Next: [Packet Flow & Tracing](./packet-flow).
