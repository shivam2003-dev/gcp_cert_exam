# VPC Fundamentals

## Overview

A **Virtual Private Cloud (VPC)** is a virtual network dedicated to your Google Cloud project. It provides connectivity for your Compute Engine VM instances, GKE clusters, App Engine applications, and other resources.

## Key Concepts

### VPC Network

A VPC network is a global resource that consists of:
- **Subnets** - Regional IP address ranges
- **Routes** - Define how traffic is directed
- **Firewall rules** - Control traffic to and from resources
- **VPC peering** - Connect VPCs together

:::tip Exam Tip
VPC networks are global resources, but subnets are regional. This means a single VPC can span multiple regions, with subnets in each region.
:::

### Subnets

A **subnet** is a segment of a VPC network's IP address range where you can place groups of resources. Each subnet is associated with a region.

**Subnet Characteristics:**
- Regional (not zonal)
- Must have a unique IP range within the VPC
- Can span multiple zones in a region
- Automatically creates routes

### Subnet Modes

Google Cloud offers two subnet modes:

1. **Auto Mode VPC**
   - Automatically creates subnets in each region
   - Uses predefined IP ranges
   - Good for getting started quickly

2. **Custom Mode VPC**
   - You create and manage subnets manually
   - Full control over IP ranges
   - Recommended for production

:::warning Common Pitfall
Auto mode VPCs have fixed IP ranges that may conflict with on-premises networks. Use custom mode for production deployments that need specific IP ranges.
:::

## Creating a VPC

### Auto Mode VPC

```bash
# Create auto mode VPC (simplest)
gcloud compute networks create VPC_NAME \
  --subnet-mode=auto
```

### Custom Mode VPC

```bash
# Create custom mode VPC
gcloud compute networks create VPC_NAME \
  --subnet-mode=custom

# Create subnet in a region
gcloud compute networks subnets create SUBNET_NAME \
  --network=VPC_NAME \
  --region=us-central1 \
  --range=10.0.0.0/24
```

## IP Address Ranges

### Private IP Ranges (RFC 1918)

- `10.0.0.0/8` (10.0.0.0 to 10.255.255.255)
- `172.16.0.0/12` (172.16.0.0 to 172.31.255.255)
- `192.168.0.0/16` (192.168.0.0 to 192.168.255.255)

:::note Remember
Google Cloud uses RFC 1918 private IP addresses. These ranges are not routable on the public internet.
:::

### Subnet Sizing

When planning subnets:
- **Minimum size:** /29 (8 IP addresses, but only 4 usable)
- **Recommended minimum:** /28 (16 IP addresses, 11 usable)
- **Common sizes:** /24 (256 addresses) or /20 (4096 addresses)

**Reserved IPs:**
- First 4 IPs are reserved (network, gateway, broadcast, etc.)
- Last IP is reserved for broadcast

## VPC Network Types

### Default VPC

Every project gets a **default VPC network**:
- Auto mode
- Subnets in all regions
- Default firewall rules
- Can be deleted (not recommended)

### Custom VPC

Create custom VPCs for:
- Better IP address management
- Network isolation
- Compliance requirements
- Multi-region deployments

## VPC Peering

VPC peering allows you to connect VPC networks so resources can communicate using private IP addresses.

**Types of Peering:**
- **Internal VPC Peering** - Between VPCs in the same or different projects
- **VPC Network Peering** - Connects VPCs across projects/organizations

```bash
# Create VPC peering connection
gcloud compute networks peerings create PEERING_NAME \
  --network=VPC_NAME \
  --peer-network=PEER_VPC_NAME \
  --peer-project=PEER_PROJECT_ID
```

:::tip Exam Tip
VPC peering is useful for connecting production and development environments or sharing resources between projects.
:::

## Routes

Routes define the paths that network traffic takes from a VM instance to other destinations.

**Default Routes:**
- **Default route** - Routes traffic to the internet gateway
- **Subnet route** - Routes traffic within the subnet
- **Local route** - Routes traffic within the VPC

**Custom Routes:**
- Can create custom routes for specific destinations
- Useful for VPN or interconnect scenarios

## Best Practices

1. **Use custom mode VPCs** for production
2. **Plan IP ranges carefully** to avoid conflicts
3. **Use descriptive names** for VPCs and subnets
4. **Document your network architecture**
5. **Use VPC peering** instead of public IPs when possible
6. **Implement least privilege** with firewall rules

## Common Commands

```bash
# List VPC networks
gcloud compute networks list

# Describe a VPC network
gcloud compute networks describe VPC_NAME

# List subnets
gcloud compute networks subnets list

# Describe a subnet
gcloud compute networks subnets describe SUBNET_NAME \
  --region=REGION

# Delete a subnet
gcloud compute networks subnets delete SUBNET_NAME \
  --region=REGION

# Delete a VPC network (must delete all subnets first)
gcloud compute networks delete VPC_NAME
```

## Next Steps

Continue to [Firewall Rules](./firewall-rules) to learn how to control traffic to and from your resources.
