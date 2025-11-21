# Cloud Run

## Overview

Cloud Run is a fully managed serverless platform for containers.

## Deploying to Cloud Run

```bash
gcloud run deploy SERVICE_NAME \
  --image=gcr.io/PROJECT_ID/IMAGE \
  --platform=managed \
  --region=REGION
```

