# Service Accounts

## Overview

Service accounts are special accounts used by applications and services to authenticate and access Google Cloud resources.

## Creating Service Accounts

```bash
# Create service account
gcloud iam service-accounts create SA_NAME \
  --display-name="Display Name" \
  --description="Description"

# List service accounts
gcloud iam service-accounts list

# Get service account details
gcloud iam service-accounts describe SA_EMAIL
```

## Service Account Keys

```bash
# Create and download key
gcloud iam service-accounts keys create KEY_FILE.json \
  --iam-account=SA_EMAIL

# List keys
gcloud iam service-accounts keys list --iam-account=SA_EMAIL

# Delete key
gcloud iam service-accounts keys delete KEY_ID --iam-account=SA_EMAIL
```

## Granting Roles to Service Accounts

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/ROLE_NAME"
```

## Impersonation

```bash
# Impersonate service account
gcloud config set auth/impersonate_service_account SA_EMAIL
```

