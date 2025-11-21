# Compute Engine

## Overview

Compute Engine provides virtual machines on Google's infrastructure.

## Creating VM Instances

```bash
gcloud compute instances create INSTANCE_NAME \
  --zone=ZONE \
  --machine-type=n1-standard-1 \
  --image-family=debian-11 \
  --image-project=debian-cloud
```

