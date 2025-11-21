# gcloud CLI (SDK)

## Overview

The **gcloud CLI** (Command Line Interface) is Google Cloud's command-line tool for managing resources and services. It's part of the Google Cloud SDK.

## Installation

### macOS

```bash
# Using Homebrew (recommended)
brew install --cask google-cloud-sdk

# Or download and install manually
# https://cloud.google.com/sdk/docs/install
```

### Linux

```bash
# Download and run install script
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Or use package manager
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install google-cloud-sdk
```

### Windows

1. Download installer from [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Run the installer
3. Follow installation wizard

### Verify Installation

```bash
gcloud --version
```

## Initial Setup

### Authentication

```bash
# Login with your Google account
gcloud auth login

# List authenticated accounts
gcloud auth list

# Set default account
gcloud config set account ACCOUNT_EMAIL
```

### Application Default Credentials

For applications using Google Cloud libraries:

```bash
# Create application default credentials
gcloud auth application-default login
```

:::tip Exam Tip
Application Default Credentials (ADC) are used by client libraries and tools. They're different from user credentials.
:::

### Initialize Configuration

```bash
# Initialize gcloud (interactive)
gcloud init

# This will:
# 1. Authenticate
# 2. Select or create a project
# 3. Set default compute region/zone
```

### Setting Defaults

```bash
# Set default project
gcloud config set project PROJECT_ID

# Set default region
gcloud config set compute/region us-central1

# Set default zone
gcloud config set compute/zone us-central1-a

# View current configuration
gcloud config list
```

## Working with Configurations

You can maintain multiple configurations for different projects or environments:

```bash
# Create a new configuration
gcloud config configurations create CONFIG_NAME

# List configurations
gcloud config configurations list

# Activate a configuration
gcloud config configurations activate CONFIG_NAME

# Delete a configuration
gcloud config configurations delete CONFIG_NAME
```

:::note Remember
Each configuration maintains its own project, region, zone, and other settings. Useful for managing multiple projects.
:::

## Common gcloud Commands

### Project Management

```bash
# List projects
gcloud projects list

# Get project info
gcloud projects describe PROJECT_ID

# Set project
gcloud config set project PROJECT_ID
```

### Service Account Management

```bash
# List service accounts
gcloud iam service-accounts list

# Create service account
gcloud iam service-accounts create SA_NAME \
  --display-name="Display Name" \
  --description="Description"

# Grant role to service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/ROLE_NAME"

# Create and download key
gcloud iam service-accounts keys create KEY_FILE.json \
  --iam-account=SA_EMAIL
```

### Compute Engine

```bash
# List instances
gcloud compute instances list

# Create instance
gcloud compute instances create INSTANCE_NAME \
  --zone=ZONE \
  --machine-type=n1-standard-1 \
  --image-family=debian-11 \
  --image-project=debian-cloud

# SSH into instance
gcloud compute ssh INSTANCE_NAME --zone=ZONE

# Delete instance
gcloud compute instances delete INSTANCE_NAME --zone=ZONE
```

### Cloud Storage

```bash
# List buckets
gsutil ls

# Create bucket
gsutil mb -l LOCATION gs://BUCKET_NAME

# Copy file to bucket
gsutil cp FILE gs://BUCKET_NAME/

# Copy file from bucket
gsutil cp gs://BUCKET_NAME/FILE ./

# Delete bucket
gsutil rm -r gs://BUCKET_NAME
```

:::tip Exam Tip
Know the difference between `gcloud` (general Google Cloud) and `gsutil` (Cloud Storage specific). Both are part of the SDK.
:::

## Command Structure

gcloud commands follow this pattern:

```bash
gcloud [GROUP] [COMMAND] [FLAGS] [ARGUMENTS]
```

Examples:

```bash
# Group: compute, Command: instances, Action: list
gcloud compute instances list

# Group: iam, Command: service-accounts, Action: create
gcloud iam service-accounts create NAME --display-name="Name"

# Group: projects, Command: (none), Action: list
gcloud projects list
```

## Useful Flags

```bash
# Format output
gcloud compute instances list --format="table(name,zone,machineType)"

# Filter results
gcloud compute instances list --filter="zone:us-central1-a"

# Get specific field
gcloud compute instances describe INSTANCE_NAME \
  --format="value(networkInterfaces[0].accessConfigs[0].natIP)"

# Output as JSON
gcloud compute instances list --format=json

# Quiet mode (no prompts)
gcloud compute instances delete INSTANCE_NAME --quiet
```

:::warning Common Pitfall
Be careful with `--quiet` flag. It skips confirmation prompts and can lead to accidental deletions.
:::

## Getting Help

```bash
# General help
gcloud help

# Command-specific help
gcloud compute instances create --help

# List available commands
gcloud TOPIC --help
```

## Updating gcloud

```bash
# Update gcloud SDK
gcloud components update

# Update specific component
gcloud components update COMPONENT_NAME

# List installed components
gcloud components list
```

## Service Account Impersonation

You can impersonate a service account for testing:

```bash
# Impersonate service account
gcloud auth activate-service-account SA_EMAIL \
  --key-file=KEY_FILE.json

# Or use impersonation
gcloud config set auth/impersonate_service_account SA_EMAIL
```

:::note Remember
Service account impersonation is useful for testing IAM policies and permissions without creating user credentials.
:::

## Best Practices

1. **Use configurations** for multiple projects
2. **Set defaults** to avoid repetitive flags
3. **Use filters** to find specific resources
4. **Use format flags** for scripting
5. **Keep gcloud updated** for latest features
6. **Use application default credentials** for applications

## Next Steps

Complete the [Practice Questions](./practice) to test your understanding of setting up cloud solution environments.

