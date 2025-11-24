---
sidebar_position: 10
---

# AWS Cloud Interview Deck

Scenario-driven Q&A around VPC design, IAM, and operations.

## Core Questions

### 1. NAT vs IGW
<details>
<summary>Explain NAT usage.</summary>

NAT Gateway lets private subnets reach the internet for package updates without exposing inbound traffic. Internet Gateway provides bidirectional public internet access. For regulated workloads we deploy redundant NAT gateways per AZ and enable VPC Flow Logs for auditing.
</details>

### 2. Private Subnet Internet Access
<details>
<summary>How to enable?</summary>

- Route table entry `0.0.0.0/0 -> nat-gw-id`.
- Ensure instances have private IP only and security groups allow outbound.
- Optionally use proxy/egress VPC for centralized inspection.
</details>

### 3. EC2 Unexpected Termination
<details>
<summary>Troubleshooting.</summary>

Check CloudTrail for stop/terminate API calls, EC2 status checks, Auto Scaling activity history. Inspect `/var/log/cloud-init.log`, enable termination protection for critical hosts.
</details>

### 4. Lambda Random Failures
<details>
<summary>Approach.</summary>

Review CloudWatch Logs, enable X-Ray tracing, examine concurrent execution limits, cold-start durations, and downstream throttling (e.g., DynamoDB provisioned throughput). Configure DLQ or SNS for failed invocations.
</details>

### 5. RDS Storage Full
<details>
<summary>Immediate response.</summary>

- Enable storage autoscaling (if engine supports) or manually modify instance to allocate more storage.
- Purge temp tables/logs, archive old data.
- Monitor `FreeStorageSpace` metric with alarms well before 90% utilization.
</details>

### 6. Cross-Account Access (Lambda to S3)
<details>
<summary>How to configure?</summary>

Use IAM role assumption: create role in Account B with trust policy allowing Lambda role from Account A. Lambda assumes role via `sts:AssumeRole` and uses temporary creds to access S3 bucket with resource policy granting that role.
</details>

## Additional References

- AWS Well-Architected – [Operational Excellence Pillar](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html)
- AWS Security Blog – [Cross-account IAM patterns](https://aws.amazon.com/blogs/security/)
- Netflix – [Optimizing AWS spend](https://netflixtechblog.com/)
