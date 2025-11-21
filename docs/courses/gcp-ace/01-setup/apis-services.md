# APIs and Services

## Overview

Google Cloud services are accessed through **APIs** (Application Programming Interfaces). Before you can use a service, its API must be enabled in your project.

## Enabling APIs

### Using Google Cloud Console

1. Navigate to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for the API you need
3. Click on the API
4. Click "Enable"

### Using gcloud CLI

```bash
# Enable a single API
gcloud services enable SERVICE_NAME

# Enable multiple APIs
gcloud services enable \
  compute.googleapis.com \
  storage-component.googleapis.com \
  bigquery.googleapis.com
```

:::tip Exam Tip
Common APIs you'll need to enable:
- `compute.googleapis.com` - Compute Engine
- `container.googleapis.com` - Google Kubernetes Engine
- `run.googleapis.com` - Cloud Run
- `storage-api.googleapis.com` - Cloud Storage
- `sqladmin.googleapis.com` - Cloud SQL
:::

### Listing Enabled APIs

```bash
# List all enabled APIs
gcloud services list --enabled

# List available APIs
gcloud services list --available

# Check if specific API is enabled
gcloud services list --enabled --filter="name:compute.googleapis.com"
```

### Disabling APIs

```bash
gcloud services disable SERVICE_NAME
```

:::warning Common Pitfall
Disabling an API can break dependent services. Be careful when disabling APIs in production projects.
:::

## Common Service Names

Here are common Google Cloud service API names:

| Service | API Name |
|---------|----------|
| Compute Engine | `compute.googleapis.com` |
| Google Kubernetes Engine | `container.googleapis.com` |
| Cloud Run | `run.googleapis.com` |
| App Engine | `appengine.googleapis.com` |
| Cloud Functions | `cloudfunctions.googleapis.com` |
| Cloud Storage | `storage-component.googleapis.com` |
| Cloud SQL | `sqladmin.googleapis.com` |
| Cloud Spanner | `spanner.googleapis.com` |
| BigQuery | `bigquery.googleapis.com` |
| Pub/Sub | `pubsub.googleapis.com` |
| Cloud Monitoring | `monitoring.googleapis.com` |
| Cloud Logging | `logging.googleapis.com` |
| IAM | `iam.googleapis.com` |
| Cloud Build | `cloudbuild.googleapis.com` |

:::note Remember
API names follow the pattern: `SERVICE.googleapis.com`. The service name is lowercase with hyphens.
:::

## API Dependencies

Some services automatically enable required APIs. For example:

- Creating a GKE cluster enables `container.googleapis.com`
- Creating a Cloud SQL instance enables `sqladmin.googleapis.com`

However, it's best practice to explicitly enable APIs before use.

## API Permissions

Enabling APIs requires the `serviceusage.services.enable` permission, typically granted through:

- **Project Editor** role
- **Service Usage Admin** role
- **Owner** role

:::tip Exam Tip
If you get a permission error when enabling an API, check that your account has the necessary IAM role.
:::

## Service Accounts and APIs

Service accounts also need APIs enabled to use services. When a service account tries to use a service:

1. The API must be enabled in the project
2. The service account needs appropriate IAM permissions
3. The service account may need specific roles

## API Quotas

Each API has quotas and limits. View quotas:

```bash
# View quotas for a service
gcloud compute project-info describe --project=PROJECT_ID
```

## Next Steps

Continue to [gcloud SDK](./gcloud-sdk) to learn about installing and using the command-line interface.

