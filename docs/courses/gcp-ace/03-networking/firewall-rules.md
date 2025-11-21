# Firewall Rules

## Overview

Firewall rules control traffic to and from VM instances.

## Creating Firewall Rules

```bash
gcloud compute firewall-rules create RULE_NAME \
  --network=VPC_NAME \
  --allow=tcp:80 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=web-server
```

