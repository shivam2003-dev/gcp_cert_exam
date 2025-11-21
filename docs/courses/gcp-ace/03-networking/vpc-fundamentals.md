# VPC Fundamentals

## Overview

A Virtual Private Cloud (VPC) is a virtual network dedicated to your Google Cloud project.

## Key Concepts

- **VPC Network:** Isolated network for your resources
- **Subnet:** IP address range within a region
- **Region:** Geographic location
- **Zone:** Deployment zone within a region

## Creating a VPC

```bash
# Create custom VPC
gcloud compute networks create VPC_NAME \
  --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create SUBNET_NAME \
  --network=VPC_NAME \
  --region=REGION \
  --range=10.0.0.0/24
```

