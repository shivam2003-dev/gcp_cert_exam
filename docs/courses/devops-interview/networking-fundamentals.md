---
sidebar_position: 4
---

# Networking Fundamentals Interview Deck

Questions target packet flow intuition, DNS hygiene, and troubleshooting workflows.

## Core Questions

### 1. Explain DNS Flow Simply
<details>
<summary>How do you describe DNS to non-network folks?</summary>

DNS is the phonebook of the internet. Client asks the resolver, which may hit cache; if miss, resolver walks root → TLD → authoritative name servers to resolve the domain, then returns IP plus TTL. We often run internal CoreDNS so services rely on split-horizon DNS.
</details>

### 2. Curl Works with IP but Fails with Domain
<details>
<summary>How do you troubleshoot?</summary>

- Check `/etc/resolv.conf` and `systemd-resolved` status.
- `dig myapp.internal @corp-dns` and `dig +trace` to see delegation.
- Inspect DNSSEC validation if using `stub-resolv`. Often corporate VPN pushes broken DNS servers; fix via scoped resolv.conf or per-namespace CoreDNS override.
</details>

### 3. 502 from Nginx-backed App
<details>
<summary>Walkthrough.</summary>

- 502 usually indicates upstream failure. Check `error.log` for `upstream timed out` vs `connect() failed`.
- Validate backend health (k8s service endpoints, EC2 ASG, etc.).
- Confirm keepalive, buffering, and `proxy_read_timeout` tuned correctly when upstream takes longer.
</details>

### 4. Difference Between 0.0.0.0 and 127.0.0.1
<details>
<summary>Interview-friendly answer.</summary>

`0.0.0.0` means "all IPv4 interfaces" for binding; kernel listens on every NIC. `127.0.0.1` is loopback—traffic never leaves host. Exposing services on 0.0.0.0 inadvertently publishes them externally; default to loopback and front with reverse proxy.
</details>

### 5. Public vs Private Subnets
<details>
<summary>How do you enforce difference in AWS?</summary>

Public subnet has route to an Internet Gateway; private subnet routes through NAT Gateway or no outbound path. Use separate NACLs/security groups, disable auto-assign public IP on private subnets, and log via VPC Flow Logs.
</details>

## Incident Playbook

1. Capture packet trace with `tcpdump -i eth0 host <ip> -w flow.pcap`.
2. Use `ss -tulpn` to confirm listeners.
3. Inspect load balancer health-check logs.
4. Validate TLS termination path (cert expiry, cipher mismatches).

## Additional References

- Cloudflare Blog – [Deep dives on HTTP codes](https://blog.cloudflare.com/)
- AWS Builders Library – [Timeouts, retries, and exponential backoff](https://aws.amazon.com/builders-library/)
- Julia Evans – [Networking zines](https://wizardzines.com/)
