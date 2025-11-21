# Cloud DNS

## Overview

Cloud DNS is a scalable DNS service.

## Creating DNS Zone

```bash
gcloud dns managed-zones create ZONE_NAME \
  --dns-name=example.com \
  --description="DNS zone"
```

