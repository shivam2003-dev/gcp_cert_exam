---
sidebar_position: 11
---

# Azure Cloud Interview Deck

Highlights hybrid connectivity, governance, and AKS security.

## Core Questions

### 1. Scheduling Scripts Daily
<details>
<summary>How to run jobs every day?</summary>

Use Azure Automation Runbooks or Logic Apps. For infrastructure tasks we prefer Automation Account + PowerShell/ Python runbook scheduled via `New-AzAutomationSchedule`.
</details>

### 2. SSH/RDP Failure to VM
<details>
<summary>Troubleshooting.</summary>

- Validate NSG inbound rules, ensure port 22/3389 allowed.
- Check Azure Firewall or VPN path.
- Use Serial Console to fix OS-level issues, reset NIC or credentials via Azure portal.
</details>

### 3. Restrict Storage Account to Specific VNet
<details>
<summary>Approach.</summary>

Enable Virtual Network service endpoints or Private Endpoints. Configure storage firewall to allow only specific subnet IDs.
</details>

### 4. Prevent Accidental Deletion
<details>
<summary>How to protect critical resources?</summary>

Apply resource locks (`ReadOnly` or `CanNotDelete`) at resource group level, enforce tags/policies via Azure Policy, and enable activity log alerts for delete operations.
</details>

### 5. AKS App-to-App Security
<details>
<summary>Answer.</summary>

Use Azure CNI + Network Policies (Calico) or Azure Firewall for East/West inspection. Integrate with Azure AD Pod Identity/Workload Identity for secretless auth.
</details>

### 6. Multi-Region Performance
<details>
<summary>Scenario: East US hosted app slow for EU users.</summary>

Deploy traffic manager/front door with Anycast, replicate data using geo-redundant storage or SQL failover groups, and use read replicas closer to EU. Cache heavy content via Azure CDN.
</details>

## Additional References

- Azure Architecture Center – [Reference blueprints](https://learn.microsoft.com/azure/architecture/)
- Microsoft Tech Community – [AKS best practices](https://techcommunity.microsoft.com/t5/azure-kubernetes-service/bg-p/AzureKubernetesService)
- Tao of Azure – [Governance field notes](https://taoofazure.com/)
