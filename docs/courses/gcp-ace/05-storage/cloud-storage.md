# Cloud Storage

## Overview

**Cloud Storage** is a unified object storage service that offers industry-leading scalability, data availability, security, and performance. It's designed for storing any amount of data for any duration.

## Key Concepts

### Buckets

A **bucket** is a container for objects (files) in Cloud Storage. Buckets have:
- **Globally unique name** - Must be unique across all Google Cloud
- **Location** - Region or multi-region where data is stored
- **Storage class** - Determines availability and cost
- **Lifecycle policies** - Automate object management

### Objects

**Objects** are individual files stored in buckets. Each object has:
- **Name** - Unique within the bucket
- **Data** - The file content
- **Metadata** - Custom key-value pairs
- **Version** - If versioning is enabled

## Storage Classes

Cloud Storage offers different storage classes optimized for different use cases:

| Storage Class | Use Case | Minimum Duration | Access Cost |
|--------------|----------|------------------|-------------|
| **Standard** | Frequently accessed data | None | Lowest |
| **Nearline** | Accessed < once/month | 30 days | Low |
| **Coldline** | Accessed < once/quarter | 90 days | Medium |
| **Archive** | Long-term archival | 365 days | Highest |

:::tip Exam Tip
Know when to use each storage class:
- **Standard** - Active data, web content, mobile apps
- **Nearline** - Backup, disaster recovery
- **Coldline** - Long-term backup, archival
- **Archive** - Compliance, rarely accessed data
:::

## Creating and Managing Buckets

### Creating a Bucket

```bash
# Create bucket in a specific region
gsutil mb -l us-central1 gs://my-bucket

# Create bucket with storage class
gsutil mb -l us-central1 -c STANDARD gs://my-bucket

# Create multi-region bucket
gsutil mb -l US gs://my-bucket
```

### Listing Buckets

```bash
# List all buckets
gsutil ls

# List buckets with details
gsutil ls -L
```

### Deleting Buckets

```bash
# Delete empty bucket
gsutil rm -r gs://my-bucket

# Delete bucket and all objects
gsutil rm -r gs://my-bucket
```

:::warning Common Pitfall
Bucket names are globally unique. Once deleted, the name cannot be reused. Choose names carefully.
:::

## Working with Objects

### Uploading Objects

```bash
# Upload a single file
gsutil cp file.txt gs://my-bucket/

# Upload a directory
gsutil cp -r ./local-dir gs://my-bucket/remote-dir/

# Upload with specific storage class
gsutil cp -s NEARLINE file.txt gs://my-bucket/
```

### Downloading Objects

```bash
# Download a file
gsutil cp gs://my-bucket/file.txt ./

# Download a directory
gsutil cp -r gs://my-bucket/remote-dir ./local-dir/
```

### Listing Objects

```bash
# List objects in bucket
gsutil ls gs://my-bucket/

# List with details
gsutil ls -l gs://my-bucket/

# List recursively
gsutil ls -r gs://my-bucket/
```

### Deleting Objects

```bash
# Delete a single object
gsutil rm gs://my-bucket/file.txt

# Delete all objects in bucket
gsutil rm gs://my-bucket/**
```

## IAM and Access Control

### Uniform Bucket-Level Access

Uniform bucket-level access uses only IAM for access control (recommended):

```bash
# Enable uniform bucket-level access
gsutil uniformbucketlevelaccess set on gs://my-bucket
```

### Setting IAM Policy

```bash
# Grant read access to a user
gsutil iam ch user:email@example.com:objectViewer gs://my-bucket

# Grant admin access
gsutil iam ch user:email@example.com:roles/storage.admin gs://my-bucket
```

### Signed URLs

Signed URLs provide time-limited access without IAM:

```bash
# Generate signed URL (valid for 1 hour)
gsutil signurl -d 1h key.json gs://my-bucket/file.txt
```

## Lifecycle Management

Lifecycle policies automate object management:

```json
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
```

```bash
# Apply lifecycle policy
gsutil lifecycle set lifecycle.json gs://my-bucket
```

:::note Remember
Lifecycle policies can automatically change storage classes or delete objects based on age or other conditions.
:::

## Versioning

Object versioning keeps multiple versions of objects:

```bash
# Enable versioning
gsutil versioning set on gs://my-bucket

# List all versions
gsutil ls -a gs://my-bucket/file.txt

# Restore a previous version
gsutil cp gs://my-bucket/file.txt#GENERATION gs://my-bucket/file.txt
```

## Best Practices

1. **Use uniform bucket-level access** for simpler IAM management
2. **Choose appropriate storage classes** based on access patterns
3. **Enable lifecycle policies** to automate cost optimization
4. **Use versioning** for important data
5. **Set up retention policies** for compliance
6. **Use object holds** to prevent deletion
7. **Enable logging** for audit trails

## Common Use Cases

- **Website hosting** - Static website content
- **Data backup** - Backup and disaster recovery
- **Data archival** - Long-term storage
- **Content delivery** - Media files, downloads
- **Data lakes** - Big data storage
- **Application data** - User uploads, application files

## Next Steps

Continue to [Persistent Disks](./persistent-disks) to learn about block storage for VMs.
