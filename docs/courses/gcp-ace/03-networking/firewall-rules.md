# Firewall Rules

## Overview

**Firewall rules** control traffic to and from VM instances based on specified configurations. They are stateful, meaning return traffic is automatically allowed.

## Key Concepts

### Firewall Rule Components

1. **Direction** - Ingress (inbound) or Egress (outbound)
2. **Priority** - Lower numbers = higher priority (0-65534)
3. **Action** - Allow or Deny
4. **Targets** - Which instances the rule applies to
5. **Source/Destination** - IP ranges or tags
6. **Protocols and Ports** - TCP, UDP, ICMP, and specific ports

:::tip Exam Tip
Firewall rules are stateful. If you allow ingress traffic on port 80, the corresponding egress traffic is automatically allowed for the response.
:::

### Default Firewall Rules

Every VPC network has default firewall rules:

1. **default-allow-internal** - Allows all internal traffic (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
2. **default-allow-ssh** - Allows SSH (port 22) from anywhere
3. **default-allow-rdp** - Allows RDP (port 3389) from anywhere
4. **default-allow-icmp** - Allows ICMP (ping) from anywhere

:::warning Common Pitfall
Default firewall rules allow SSH and RDP from anywhere (0.0.0.0/0). This is a security risk. Create more restrictive rules for production.
:::

## Creating Firewall Rules

### Basic Ingress Rule

```bash
# Allow HTTP traffic from anywhere
gcloud compute firewall-rules create allow-http \
  --network=VPC_NAME \
  --allow=tcp:80 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=web-server
```

### Rule with Multiple Ports

```bash
# Allow HTTP and HTTPS
gcloud compute firewall-rules create allow-web \
  --network=VPC_NAME \
  --allow=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=web-server
```

### Rule with Specific Source IP

```bash
# Allow SSH only from office IP
gcloud compute firewall-rules create allow-ssh-office \
  --network=VPC_NAME \
  --allow=tcp:22 \
  --source-ranges=203.0.113.0/24 \
  --target-tags=ssh-allowed
```

### Egress Rule

```bash
# Allow outbound traffic to specific IP range
gcloud compute firewall-rules create allow-egress \
  --network=VPC_NAME \
  --direction=EGRESS \
  --allow=tcp:443 \
  --destination-ranges=10.0.0.0/8 \
  --target-tags=database-client
```

## Firewall Rule Priority

When multiple rules apply, the rule with the **lowest priority number** takes precedence.

```bash
# High priority rule (deny takes precedence)
gcloud compute firewall-rules create deny-http \
  --network=VPC_NAME \
  --action=deny \
  --rules=tcp:80 \
  --priority=1000 \
  --source-ranges=0.0.0.0/0

# Lower priority rule (won't apply if deny rule matches)
gcloud compute firewall-rules create allow-http-specific \
  --network=VPC_NAME \
  --allow=tcp:80 \
  --priority=2000 \
  --source-ranges=203.0.113.0/24
```

:::note Remember
Priority 0 is the highest priority. Deny rules should have lower priority numbers than allow rules to take effect.
:::

## Using Tags

**Network tags** allow you to apply firewall rules to specific VM instances.

### Apply Tag to VM

```bash
# Create VM with tag
gcloud compute instances create web-server \
  --zone=us-central1-a \
  --tags=web-server,http-server

# Add tag to existing VM
gcloud compute instances add-tags INSTANCE_NAME \
  --zone=ZONE \
  --tags=web-server
```

### Firewall Rule Using Tags

```bash
# Rule applies only to VMs with web-server tag
gcloud compute firewall-rules create allow-web-traffic \
  --network=VPC_NAME \
  --allow=tcp:80,tcp:443 \
  --target-tags=web-server
```

## Service Accounts as Targets

You can also target firewall rules to service accounts:

```bash
# Rule applies to VMs using specific service account
gcloud compute firewall-rules create allow-internal-api \
  --network=VPC_NAME \
  --allow=tcp:8080 \
  --source-ranges=10.0.0.0/8 \
  --target-service-accounts=api-service@PROJECT_ID.iam.gserviceaccount.com
```

## Common Firewall Patterns

### Web Server Pattern

```bash
# Allow HTTP/HTTPS from internet
gcloud compute firewall-rules create allow-web \
  --network=VPC_NAME \
  --allow=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=web-server

# Allow SSH from specific IP
gcloud compute firewall-rules create allow-ssh-web \
  --network=VPC_NAME \
  --allow=tcp:22 \
  --source-ranges=YOUR_OFFICE_IP/32 \
  --target-tags=web-server
```

### Database Server Pattern

```bash
# Allow database traffic only from app servers
gcloud compute firewall-rules create allow-db \
  --network=VPC_NAME \
  --allow=tcp:3306 \
  --source-ranges=10.0.1.0/24 \
  --target-tags=database-server

# Deny all other traffic to database
gcloud compute firewall-rules create deny-db-external \
  --network=VPC_NAME \
  --action=deny \
  --rules=tcp:3306 \
  --priority=1000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=database-server
```

## Viewing and Managing Rules

```bash
# List all firewall rules
gcloud compute firewall-rules list

# Describe a specific rule
gcloud compute firewall-rules describe RULE_NAME

# Update a rule
gcloud compute firewall-rules update allow-http \
  --source-ranges=203.0.113.0/24

# Delete a rule
gcloud compute firewall-rules delete RULE_NAME
```

## Best Practices

1. **Use least privilege** - Only allow necessary ports and IP ranges
2. **Remove default rules** - Delete or modify default-allow-* rules
3. **Use tags** - Organize rules by application tier
4. **Document rules** - Use descriptive names and descriptions
5. **Test rules** - Verify connectivity after creating rules
6. **Use priority** - Set appropriate priorities for deny rules
7. **Review regularly** - Audit firewall rules periodically

:::warning Common Pitfall
Firewall rules apply at the network level, not the instance level. You cannot have different firewall rules for different VMs in the same subnet unless you use tags or service accounts.
:::

## Troubleshooting

### Check Applied Rules

```bash
# List rules for a specific network
gcloud compute firewall-rules list --filter="network:VPC_NAME"

# Check which rules apply to a VM
gcloud compute instances describe INSTANCE_NAME \
  --zone=ZONE \
  --format="value(tags.items)"
```

### Common Issues

1. **Can't connect to VM**
   - Check if firewall rule exists
   - Verify source IP is in allowed ranges
   - Check if VM has required tag
   - Verify rule priority

2. **Too permissive rules**
   - Review source IP ranges (avoid 0.0.0.0/0)
   - Use tags to limit scope
   - Set appropriate priorities

## Next Steps

Continue to [Load Balancing](./load-balancing) to learn about distributing traffic across multiple instances.
