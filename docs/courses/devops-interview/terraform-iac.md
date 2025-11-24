---
sidebar_position: 6
---

# Terraform & IaC Interview Deck

Covers state management, modules, and governance for multi-team clouds.

## Core Questions

### 1. State File Purpose
<details>
<summary>Explain it succinctly.</summary>

State tracks real-world resources and maps them to Terraform resources. Without it, Terraform would perform full cloud inventory each plan. We store state in remote backends (S3 + DynamoDB lock) to avoid drift and enable collaboration.
</details>

### 2. Concurrent State Updates
<details>
<summary>What happens if two engineers run `apply` simultaneously?</summary>

Without locking, state corruption can occur. Using DynamoDB or GCS locking ensures only one operation runs at a time; the second apply blocks until lock released. We also wrap commands with Atlantis/Spacelift to serialize operations per workspace.
</details>

### 3. Resources vs Data Sources
<details>
<summary>Why differentiate?</summary>

`resource` blocks manage lifecycle (create/update/delete). `data` blocks read existing infrastructure (VPC IDs, AMIs). Mixing them avoids accidental recreation of shared resources.
</details>

### 4. State Storage with No Cloud Account
<details>
<summary>What if you lack S3/GCS?</summary>

Use Terraform Cloud/Enterprise remote state (free tier) or a self-hosted Consul backend. Never commit `terraform.tfstate` to Git; sanitize and rotate secrets if it accidentally lands there.
</details>

### 5. Terraform vs OpenTofu
<details>
<summary>How do you evaluate?</summary>

OpenTofu is a community fork retaining MPL license; we monitor provider compatibility. For regulated environments needing security patches beyond HashiCorp’s BSL, OpenTofu is attractive but ensure providers support it.
</details>

### 6. Sample AWS Resource
<details>
<summary>Provide a snippet.</summary>

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "platform-access-logs"
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule { apply_server_side_encryption_by_default { sse_algorithm = "aws:kms" } }
  }
  lifecycle_rule {
    id      = "archive"
    enabled = true
    transition {
      days          = 30
      storage_class = "GLACIER"
    }
  }
}
```
</details>

## Governance Tips

- Use `terraform fmt` + `tflint` pre-commit hooks.
- Tag everything; enforce via `required_providers` validations.
- Break projects into modules, version them, and pin via registry.

## Additional References

- HashiCorp – [State management guide](https://developer.hashicorp.com/terraform/language/state)
- Spacelift – [OpenTofu overview](https://spacelift.io/blog)
- Gruntwork – [Terraform production checklist](https://blog.gruntwork.io/)
