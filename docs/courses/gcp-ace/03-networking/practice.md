# Module 3: Practice Questions

## Multiple Choice Questions

### Question 1
What is the difference between an auto mode and custom mode VPC?

- A. Auto mode is for production, custom for development
- B. Auto mode creates subnets automatically, custom mode requires manual creation
- C. Custom mode is faster
- D. They are the same

<details>
<summary>Answer</summary>

**B. Auto mode creates subnets automatically, custom mode requires manual creation**

Auto mode VPCs automatically create subnets in each region with predefined IP ranges. Custom mode VPCs require you to manually create and manage subnets.

</details>

### Question 2
Which command creates a custom mode VPC?

- A. `gcloud compute networks create VPC_NAME --mode=custom`
- B. `gcloud compute networks create VPC_NAME --subnet-mode=custom`
- C. `gcloud networks create VPC_NAME --custom`
- D. `gcloud vpc create VPC_NAME --custom`

<details>
<summary>Answer</summary>

**B. `gcloud compute networks create VPC_NAME --subnet-mode=custom`**

The `--subnet-mode=custom` flag creates a custom mode VPC where you manually create subnets.

</details>

### Question 3
What is the minimum subnet size in Google Cloud?

- A. /24
- B. /28
- C. /29
- D. /30

<details>
<summary>Answer</summary>

**C. /29**

The minimum subnet size is /29, which provides 8 IP addresses (4 usable after reserved IPs).

</details>

### Question 4
Which of the following is a valid private IP range (RFC 1918)?

- A. `192.168.0.0/16`
- B. `172.32.0.0/12`
- C. `10.255.255.0/24`
- D. All of the above

<details>
<summary>Answer</summary>

**A. `192.168.0.0/16`**

RFC 1918 private ranges are: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. Option B uses 172.32 which is outside the 172.16-172.31 range.

</details>

### Question 5
What is the default firewall rule that allows SSH from anywhere?

- A. `default-allow-ssh`
- B. `allow-ssh-default`
- C. `default-ssh`
- D. `ssh-default-allow`

<details>
<summary>Answer</summary>

**A. `default-allow-ssh`**

Every VPC network has a default firewall rule named `default-allow-ssh` that allows SSH (port 22) from 0.0.0.0/0.

</details>

### Question 6
Which command creates a firewall rule that allows HTTP traffic only from a specific IP range?

- A. `gcloud compute firewall-rules create allow-http --allow=tcp:80 --source-ranges=IP_RANGE`
- B. `gcloud firewall create allow-http --port=80 --source=IP_RANGE`
- C. `gcloud compute create-firewall allow-http --allow=tcp:80 --source=IP_RANGE`
- D. `gcloud networks firewall create allow-http --port=80 --source-ranges=IP_RANGE`

<details>
<summary>Answer</summary>

**A. `gcloud compute firewall-rules create allow-http --allow=tcp:80 --source-ranges=IP_RANGE`**

This creates a firewall rule allowing TCP port 80 from the specified IP range.

</details>

### Question 7
What is the priority range for firewall rules?

- A. 0-1000
- B. 0-65534
- C. 1-10000
- D. 100-65535

<details>
<summary>Answer</summary>

**B. 0-65534**

Firewall rule priorities range from 0 (highest) to 65534 (lowest).

</details>

### Question 8
Which firewall rule takes precedence when multiple rules apply?

- A. The rule with highest priority number
- B. The rule with lowest priority number
- C. The most recently created rule
- D. The deny rule always wins

<details>
<summary>Answer</summary>

**B. The rule with lowest priority number**

Lower priority numbers have higher precedence. Priority 0 is the highest priority.

</details>

### Question 9
What is VPC peering used for?

- A. Connecting VPCs to the internet
- B. Connecting VPCs together for private communication
- C. Connecting VPCs to on-premises networks
- D. Load balancing across VPCs

<details>
<summary>Answer</summary>

**B. Connecting VPCs together for private communication**

VPC peering allows resources in different VPCs to communicate using private IP addresses.

</details>

### Question 10
Which command creates a subnet in a VPC?

- A. `gcloud compute subnets create SUBNET_NAME --network=VPC_NAME --range=IP_RANGE`
- B. `gcloud compute networks subnets create SUBNET_NAME --network=VPC_NAME --region=REGION --range=IP_RANGE`
- C. `gcloud networks create-subnet SUBNET_NAME --vpc=VPC_NAME --range=IP_RANGE`
- D. `gcloud vpc subnets create SUBNET_NAME --network=VPC_NAME --range=IP_RANGE`

<details>
<summary>Answer</summary>

**B. `gcloud compute networks subnets create SUBNET_NAME --network=VPC_NAME --region=REGION --range=IP_RANGE`**

Subnets are regional resources and must specify the region.

</details>

### Question 11
What is the purpose of network tags on VM instances?

- A. To organize VMs
- B. To apply firewall rules to specific VMs
- C. To track costs
- D. To enable monitoring

<details>
<summary>Answer</summary>

**B. To apply firewall rules to specific VMs**

Network tags allow you to target firewall rules to specific VM instances.

</details>

### Question 12
Which type of load balancer is global and works at Layer 7?

- A. Network Load Balancer
- B. HTTP(S) Load Balancer
- C. Internal Load Balancer
- D. TCP/UDP Load Balancer

<details>
<summary>Answer</summary>

**B. HTTP(S) Load Balancer**

HTTP(S) Load Balancer is a global Layer 7 (application layer) load balancer.

</details>

### Question 13
What is Cloud CDN used for?

- A. Content delivery and caching
- B. DNS resolution
- C. Network security
- D. Load balancing

<details>
<summary>Answer</summary>

**A. Content delivery and caching**

Cloud CDN caches content at edge locations to reduce latency and bandwidth costs.

</details>

### Question 14
Which command creates a Cloud DNS managed zone?

- A. `gcloud dns managed-zones create ZONE_NAME --dns-name=DOMAIN`
- B. `gcloud dns create-zone ZONE_NAME --domain=DOMAIN`
- C. `gcloud compute dns create ZONE_NAME --dns-name=DOMAIN`
- D. `gcloud dns zones create ZONE_NAME --domain=DOMAIN`

<details>
<summary>Answer</summary>

**A. `gcloud dns managed-zones create ZONE_NAME --dns-name=DOMAIN`**

This creates a new managed DNS zone for the specified domain.

</details>

### Question 15
What is the difference between ingress and egress firewall rules?

- A. Ingress is inbound, egress is outbound
- B. Ingress is outbound, egress is inbound
- C. They are the same
- D. Ingress is for HTTP, egress for HTTPS

<details>
<summary>Answer</summary>

**A. Ingress is inbound, egress is outbound**

Ingress rules control incoming traffic to VMs. Egress rules control outgoing traffic from VMs.

</details>

### Question 16
Which command lists all firewall rules in a VPC?

- A. `gcloud compute firewall-rules list --filter="network:VPC_NAME"`
- B. `gcloud firewall list --network=VPC_NAME`
- C. `gcloud compute list-firewalls --network=VPC_NAME`
- D. `gcloud networks firewall list VPC_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud compute firewall-rules list --filter="network:VPC_NAME"`**

This lists all firewall rules and filters by network name.

</details>

### Question 17
What is a route in Google Cloud networking?

- A. A path for network traffic
- B. A network configuration
- C. A firewall rule
- D. A subnet configuration

<details>
<summary>Answer</summary>

**A. A path for network traffic**

Routes define how network traffic is directed from VM instances to other destinations.

</details>

### Question 18
Which load balancer type is regional and works at Layer 4?

- A. HTTP(S) Load Balancer
- B. Network Load Balancer
- C. Internal TCP/UDP Load Balancer
- D. Both B and C

<details>
<summary>Answer</summary>

**D. Both B and C**

Both Network Load Balancer and Internal TCP/UDP Load Balancer are regional Layer 4 load balancers.

</details>

### Question 19
What is the purpose of Cloud Armor?

- A. Network security and DDoS protection
- B. Firewall management
- C. Load balancing
- D. DNS management

<details>
<summary>Answer</summary>

**A. Network security and DDoS protection**

Cloud Armor provides DDoS protection and WAF (Web Application Firewall) capabilities for HTTP(S) load balancers.

</details>

### Question 20
Which command adds a network tag to a VM instance?

- A. `gcloud compute instances add-tags INSTANCE --tags=TAG`
- B. `gcloud compute instances tag INSTANCE --add=TAG`
- C. `gcloud compute tag-instance INSTANCE TAG`
- D. `gcloud instances add-tag INSTANCE TAG`

<details>
<summary>Answer</summary>

**A. `gcloud compute instances add-tags INSTANCE --tags=TAG`**

This adds one or more network tags to an existing VM instance.

</details>

### Question 21
What is the maximum number of subnets per VPC network?

- A. 10
- B. 50
- C. 100
- D. 700

<details>
<summary>Answer</summary>

**D. 700**

Each VPC network can have up to 700 subnets.

</details>

### Question 22
Which firewall rule action denies traffic?

- A. `--action=deny`
- B. `--deny`
- C. `--block`
- D. `--reject`

<details>
<summary>Answer</summary>

**A. `--action=deny`**

Firewall rules can have `allow` or `deny` actions. Use `--action=deny` to block traffic.

</details>

### Question 23
What is Cloud NAT used for?

- A. Network address translation for outbound traffic
- B. Inbound NAT
- C. Load balancing
- D. DNS resolution

<details>
<summary>Answer</summary>

**A. Network address translation for outbound traffic**

Cloud NAT provides outbound internet access for VMs without public IP addresses.

</details>

### Question 24
Which command creates a VPC peering connection?

- A. `gcloud compute networks peerings create PEERING_NAME --network=VPC_NAME --peer-network=PEER_VPC`
- B. `gcloud vpc peer VPC_NAME PEER_VPC`
- C. `gcloud networks create-peering PEERING_NAME --vpc1=VPC_NAME --vpc2=PEER_VPC`
- D. `gcloud compute peer-vpcs VPC_NAME PEER_VPC`

<details>
<summary>Answer</summary>

**A. `gcloud compute networks peerings create PEERING_NAME --network=VPC_NAME --peer-network=PEER_VPC`**

This creates a VPC peering connection between two VPCs.

</details>

### Question 25
What is the purpose of private Google access?

- A. To access Google APIs without internet
- B. To access private IPs
- C. To enable VPN
- D. To configure DNS

<details>
<summary>Answer</summary>

**A. To access Google APIs without internet**

Private Google access allows VMs without public IPs to access Google APIs and services using private IPs.

</details>

### Question 26
Which load balancer provides SSL termination?

- A. Network Load Balancer
- B. HTTP(S) Load Balancer
- C. Internal Load Balancer
- D. All of the above

<details>
<summary>Answer</summary>

**B. HTTP(S) Load Balancer**

HTTP(S) Load Balancer can terminate SSL/TLS connections and handle certificates.

</details>

### Question 27
What is the difference between a regional and global load balancer?

- A. Regional is faster
- B. Global distributes traffic across regions
- C. They are the same
- D. Regional is for internal traffic only

<details>
<summary>Answer</summary>

**B. Global distributes traffic across regions**

Global load balancers can distribute traffic across multiple regions, while regional load balancers work within a single region.

</details>

### Question 28
Which command lists all VPC networks in a project?

- A. `gcloud compute networks list`
- B. `gcloud vpc list`
- C. `gcloud networks list`
- D. `gcloud compute vpc list`

<details>
<summary>Answer</summary>

**A. `gcloud compute networks list`**

This lists all VPC networks in the current or specified project.

</details>

### Question 29
What is the purpose of a health check in load balancing?

- A. To monitor backend health
- B. To check network connectivity
- C. To verify SSL certificates
- D. To test firewall rules

<details>
<summary>Answer</summary>

**A. To monitor backend health**

Health checks determine which backend instances are healthy and can receive traffic.

</details>

### Question 30
Which Cloud DNS record type maps a domain to an IP address?

- A. A record
- B. CNAME record
- C. MX record
- D. TXT record

<details>
<summary>Answer</summary>

**A. A record**

A records map domain names to IPv4 addresses.

</details>

### Question 31
What happens when you delete a VPC network?

- A. All resources are deleted immediately
- B. All subnets must be deleted first
- C. Resources continue to work
- D. Only firewall rules are deleted

<details>
<summary>Answer</summary>

**B. All subnets must be deleted first**

You cannot delete a VPC network that contains subnets. All subnets must be deleted first.

</details>

### Question 32
Which command creates a firewall rule that applies to a specific service account?

- A. `gcloud compute firewall-rules create RULE --target-service-accounts=SA_EMAIL`
- B. `gcloud firewall create RULE --service-account=SA_EMAIL`
- C. `gcloud compute create-firewall RULE --sa=SA_EMAIL`
- D. `gcloud networks firewall RULE --service-account=SA_EMAIL`

<details>
<summary>Answer</summary>

**A. `gcloud compute firewall-rules create RULE --target-service-accounts=SA_EMAIL`**

This creates a firewall rule that applies to VMs using the specified service account.

</details>

### Question 33
What is the purpose of Cloud Interconnect?

- A. To connect VPCs
- B. To connect on-premises networks to Google Cloud
- C. To connect regions
- D. To enable VPN

<details>
<summary>Answer</summary>

**B. To connect on-premises networks to Google Cloud**

Cloud Interconnect provides dedicated connections between on-premises networks and Google Cloud.

</details>

### Question 34
Which load balancer type is best for TCP/UDP traffic?

- A. HTTP(S) Load Balancer
- B. Network Load Balancer
- C. Internal Load Balancer
- D. Both B and C

<details>
<summary>Answer</summary>

**D. Both B and C**

Both Network Load Balancer and Internal TCP/UDP Load Balancer handle TCP/UDP traffic at Layer 4.

</details>

### Question 35
What is the maximum number of firewall rules per VPC?

- A. 100
- B. 500
- C. 1,000
- D. 2,500

<details>
<summary>Answer</summary>

**C. 1,000**

Each VPC network can have up to 1,000 firewall rules.

</details>

### Question 36
Which command enables private Google access on a subnet?

- A. `gcloud compute networks subnets update SUBNET --enable-private-ip-google-access`
- B. `gcloud subnets enable-private-access SUBNET`
- C. `gcloud compute enable-private-google-access SUBNET`
- D. `gcloud networks subnets set-private-access SUBNET`

<details>
<summary>Answer</summary>

**A. `gcloud compute networks subnets update SUBNET --enable-private-ip-google-access`**

This enables private Google access on the specified subnet.

</details>

### Question 37
What is the purpose of Cloud VPN?

- A. To create secure connections between networks
- B. To enable load balancing
- C. To configure DNS
- D. To manage firewall rules

<details>
<summary>Answer</summary>

**A. To create secure connections between networks**

Cloud VPN creates secure IPsec VPN tunnels between Google Cloud and on-premises networks or other clouds.

</details>

### Question 38
Which Cloud DNS record type is used for aliases?

- A. A record
- B. CNAME record
- C. ALIAS record
- D. PTR record

<details>
<summary>Answer</summary>

**B. CNAME record**

CNAME records create aliases, mapping one domain name to another.

</details>

### Question 39
What is the difference between a backend service and a backend bucket?

- A. Backend service is for VMs, backend bucket for Cloud Storage
- B. They are the same
- C. Backend bucket is for VMs
- D. Backend service is for Cloud Storage

<details>
<summary>Answer</summary>

**A. Backend service is for VMs, backend bucket for Cloud Storage**

Backend services route traffic to VM instances. Backend buckets route traffic to Cloud Storage buckets.

</details>

### Question 40
Which command lists all routes in a VPC?

- A. `gcloud compute routes list --filter="network:VPC_NAME"`
- B. `gcloud routes list --network=VPC_NAME`
- C. `gcloud compute list-routes VPC_NAME`
- D. `gcloud networks routes list VPC_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud compute routes list --filter="network:VPC_NAME"`**

This lists all routes and filters by VPC network.

</details>

### Question 41
What is the purpose of a forwarding rule?

- A. To forward DNS queries
- B. To forward traffic to backend services
- C. To forward firewall rules
- D. To forward routes

<details>
<summary>Answer</summary>

**B. To forward traffic to backend services**

Forwarding rules map IP addresses and ports to backend services or target instances.

</details>

### Question 42
Which load balancer provides session affinity?

- A. Network Load Balancer
- B. HTTP(S) Load Balancer
- C. Internal Load Balancer
- D. All of the above

<details>
<summary>Answer</summary>

**B. HTTP(S) Load Balancer**

HTTP(S) Load Balancer supports session affinity to ensure requests from the same client go to the same backend.

</details>

### Question 43
What is the maximum number of VPC networks per project?

- A. 5
- B. 10
- C. 50
- D. 100

<details>
<summary>Answer</summary>

**A. 5**

Each project can have up to 5 VPC networks by default (can be increased with quota request).

</details>

### Question 44
Which command creates a Cloud NAT gateway?

- A. `gcloud compute routers nats create NAT_NAME --router=ROUTER_NAME --nat-external-ip-pool=IP_POOL`
- B. `gcloud nat create NAT_NAME --router=ROUTER_NAME`
- C. `gcloud compute create-nat NAT_NAME --router=ROUTER_NAME`
- D. `gcloud networks nat create NAT_NAME ROUTER_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud compute routers nats create NAT_NAME --router=ROUTER_NAME --nat-external-ip-pool=IP_POOL`**

Cloud NAT is configured on Cloud Routers.

</details>

### Question 45
What is the purpose of a Cloud Router?

- A. To route traffic between VPCs
- B. To manage BGP routing
- C. To configure NAT
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Routers can manage BGP routing, configure Cloud NAT, and handle dynamic routing.

</details>

### Question 46
Which firewall rule priority should you use for a deny rule?

- A. High number (e.g., 65534)
- B. Low number (e.g., 100)
- C. Medium number (e.g., 1000)
- D. It doesn't matter

<details>
<summary>Answer</summary>

**B. Low number (e.g., 100)**

Deny rules should have lower priority numbers (higher precedence) to ensure they take effect before allow rules.

</details>

### Question 47
What is the difference between a managed zone and a DNS record?

- A. Managed zone contains DNS records
- B. They are the same
- C. DNS record contains managed zones
- D. Managed zone is for internal DNS only

<details>
<summary>Answer</summary>

**A. Managed zone contains DNS records**

A managed zone is a container for DNS records for a domain.

</details>

### Question 48
Which command deletes a firewall rule?

- A. `gcloud compute firewall-rules delete RULE_NAME`
- B. `gcloud firewall delete RULE_NAME`
- C. `gcloud compute delete-firewall RULE_NAME`
- D. `gcloud networks firewall delete RULE_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud compute firewall-rules delete RULE_NAME`**

This permanently deletes the specified firewall rule.

</details>

### Question 49
What is the purpose of a backend bucket in load balancing?

- A. To store load balancer configuration
- B. To route traffic to Cloud Storage
- C. To route traffic to VMs
- D. To configure health checks

<details>
<summary>Answer</summary>

**B. To route traffic to Cloud Storage**

Backend buckets route traffic from HTTP(S) Load Balancers to Cloud Storage buckets.

</details>

### Question 50
Which Cloud DNS record type is used for email routing?

- A. A record
- B. MX record
- C. CNAME record
- D. TXT record

<details>
<summary>Answer</summary>

**B. MX record**

MX (Mail Exchange) records specify mail servers for a domain.

</details>

### Question 51
What is the maximum number of IP addresses per subnet?

- A. 256
- B. 4,096
- C. 65,536
- D. Depends on subnet size

<details>
<summary>Answer</summary>

**D. Depends on subnet size**

The number of IP addresses depends on the subnet CIDR. A /24 has 256 addresses, /20 has 4,096, /16 has 65,536.

</details>

### Question 52
Which command shows which firewall rules apply to a VM instance?

- A. `gcloud compute instances describe INSTANCE --format="value(tags.items)"`
- B. `gcloud compute firewall-rules list --filter="targetTags:INSTANCE_TAG"`
- C. Both A and B
- D. `gcloud compute instances get-firewall-rules INSTANCE`

<details>
<summary>Answer</summary>

**C. Both A and B**

First get the instance tags, then filter firewall rules by those tags to see which rules apply.

</details>

## Scenario-Based Questions

### Scenario 1
You need to allow web traffic (HTTP/HTTPS) to VMs tagged as "web-server" but only from your office IP range (203.0.113.0/24). How would you create this firewall rule?

<details>
<summary>Answer</summary>

```bash
gcloud compute firewall-rules create allow-web-office \
  --network=VPC_NAME \
  --allow=tcp:80,tcp:443 \
  --source-ranges=203.0.113.0/24 \
  --target-tags=web-server \
  --description="Allow HTTP/HTTPS from office IPs to web servers"
```

This creates a firewall rule that allows HTTP and HTTPS traffic from the office IP range to VMs with the web-server tag.

</details>

### Scenario 2
You have a three-tier application: web servers, app servers, and database servers. How would you configure firewall rules to ensure only app servers can access the database?

<details>
<summary>Answer</summary>

1. **Tag your VMs:**
   - Web servers: `web-tier`
   - App servers: `app-tier`
   - Database servers: `db-tier`

2. **Create firewall rule allowing app tier to database:**
```bash
gcloud compute firewall-rules create allow-app-to-db \
  --network=VPC_NAME \
  --allow=tcp:3306 \
  --source-tags=app-tier \
  --target-tags=db-tier
```

3. **Create deny rule for all other access to database:**
```bash
gcloud compute firewall-rules create deny-db-external \
  --network=VPC_NAME \
  --action=deny \
  --rules=tcp:3306 \
  --priority=1000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=db-tier
```

The deny rule has lower priority (1000) so it applies to all traffic, but the allow rule (default priority 1000) allows app-tier traffic.

</details>

Continue to [Module 4: Compute Services](../compute/overview).
