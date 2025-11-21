# Cloud Functions

## Overview

Cloud Functions is a serverless execution environment.

## Deploying Function

```bash
gcloud functions deploy FUNCTION_NAME \
  --runtime=python39 \
  --trigger=http \
  --entry-point=hello_world
```

