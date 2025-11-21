# Organization Policies

## Overview

Organization policies provide centralized control over resource configurations across your organization.

## Common Policies

- Restrict VM instance types
- Enforce encryption requirements
- Control external IP addresses
- Restrict service usage

## Managing Policies

```bash
# List organization policies
gcloud resource-manager org-policies list --project=PROJECT_ID

# Get policy details
gcloud resource-manager org-policies describe POLICY_NAME \
  --project=PROJECT_ID
```

