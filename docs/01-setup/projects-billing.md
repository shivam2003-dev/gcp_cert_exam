# Projects and Billing

## Google Cloud Projects

A **project** is the fundamental organizing entity for all Google Cloud resources. Every resource belongs to exactly one project.

### Project Characteristics

- **Project ID:** Globally unique identifier (cannot be changed)
- **Project Number:** Automatically assigned numeric ID
- **Project Name:** Human-readable name (can be changed)
- **Billing Account:** Links project to payment method

:::tip Exam Tip
Project IDs are globally unique across all Google Cloud customers. Once created, they cannot be changed. Project names can be changed.
:::

### Creating a Project

**Using Google Cloud Console:**

1. Navigate to [Cloud Resource Manager](https://console.cloud.google.com/cloud-resource-manager)
2. Click "Create Project"
3. Enter project name
4. Select organization (if applicable)
5. Click "Create"

**Using gcloud CLI:**

```bash
gcloud projects create PROJECT_ID --name="Project Name"
```

:::warning Common Pitfall
Project IDs must be globally unique. If your desired ID is taken, you'll need to choose a different one. Use a naming convention like `company-name-project-purpose`.
:::

### Listing Projects

```bash
# List all projects
gcloud projects list

# List projects with specific format
gcloud projects list --format="table(projectId,name,projectNumber)"
```

### Setting the Active Project

```bash
# Set default project for current configuration
gcloud config set project PROJECT_ID

# View current configuration
gcloud config list
```

### Project Information

```bash
# Get project details
gcloud projects describe PROJECT_ID

# Get project number
gcloud projects describe PROJECT_ID --format="value(projectNumber)"
```

:::note Remember
You can work with multiple projects by using different gcloud configurations. Use `gcloud config configurations create CONFIG_NAME` to create separate configurations.
:::

## Billing Accounts

A **billing account** is used to pay for the Google Cloud resources you use. Projects must be linked to a billing account to use paid services.

### Billing Account Types

1. **Self-Service:** Individual or small business
2. **Invoiced:** Enterprise customers with invoicing

### Linking Billing to Project

**Using Console:**

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Select billing account
3. Click "Link a project"
4. Select project and click "Set account"

**Using gcloud CLI:**

```bash
gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

:::warning Important
Some services are always free (within limits), but most require a billing account. The Free Trial provides $300 credit for 90 days.
:::

### Viewing Billing Information

```bash
# List billing accounts
gcloud billing accounts list

# Get billing account for a project
gcloud billing projects describe PROJECT_ID
```

### Budgets and Alerts

Budgets help you track and control spending:

**Using Console:**

1. Go to [Budgets & Alerts](https://console.cloud.google.com/billing/budgets)
2. Click "Create Budget"
3. Set budget amount and alert thresholds
4. Configure notifications

:::tip Exam Tip
The exam may ask about setting up budgets to prevent unexpected charges. Know that budgets can send alerts at 50%, 90%, and 100% of budget.
:::

## Quotas and Limits

Google Cloud enforces quotas (limits) on resource usage to ensure fair usage and system stability.

### Types of Quotas

- **Rate Quotas:** Requests per unit of time
- **Allocation Quotas:** Maximum number of resources

### Viewing Quotas

**Using Console:**

1. Go to [IAM & Admin > Quotas](https://console.cloud.google.com/iam-admin/quotas)
2. Filter by service or metric
3. View current usage and limits

**Using gcloud CLI:**

```bash
# List compute engine quotas
gcloud compute project-info describe --project=PROJECT_ID

# List specific quota
gcloud compute project-info describe --project=PROJECT_ID \
  --format="value(quotas[?metric=='INSTANCES'].limit)"
```

### Requesting Quota Increases

1. Go to [Quotas page](https://console.cloud.google.com/iam-admin/quotas)
2. Select the quota to increase
3. Click "Edit Quotas"
4. Enter new limit and justification
5. Submit request

:::note Remember
Quota increases are reviewed and may take time to approve. Plan ahead for production deployments.
:::

## Cost Management

### Free Tier

Google Cloud offers an **Always Free** tier with limited usage of many services:

- Compute Engine: 1 f1-micro instance per month
- Cloud Storage: 5 GB standard storage
- Cloud Functions: 2 million invocations
- And more...

### Free Trial

New customers receive:
- $300 credit
- Valid for 90 days
- Applies to all Google Cloud services

:::warning Common Pitfall
Free Trial credits expire after 90 days. Any remaining credit is lost. Set up billing alerts to track usage.
:::

### Cost Optimization Tips

1. **Use Preemptible VMs:** Up to 80% cheaper than regular VMs
2. **Right-size resources:** Match instance types to workload needs
3. **Use committed use discounts:** For predictable workloads
4. **Delete unused resources:** Regularly clean up unused resources
5. **Monitor spending:** Use billing reports and budgets

### Viewing Costs

**Using Console:**

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Select billing account
3. View cost breakdown by service, project, or label

**Using gcloud CLI:**

```bash
# Export billing data (requires BigQuery)
# Billing export must be configured in Console first
```

:::tip Exam Tip
The exam may test your knowledge of cost-effective options. Preemptible VMs, committed use discounts, and right-sizing are common topics.
:::

## Project Organization

### Folders

Folders provide a way to organize projects hierarchically:

```
Organization
  └── Folder (e.g., "Production")
      └── Project
  └── Folder (e.g., "Development")
      └── Project
```

**Creating a folder:**

```bash
gcloud resource-manager folders create \
  --display-name="Folder Name" \
  --organization=ORGANIZATION_ID
```

### Labels

Labels are key-value pairs that help organize and filter resources:

```bash
# Add label to project
gcloud projects update PROJECT_ID --update-labels=environment=prod,team=backend
```

:::note Remember
Labels are useful for cost allocation and resource management. They don't affect functionality.
:::

## Common Commands Reference

```bash
# Project management
gcloud projects create PROJECT_ID --name="Name"
gcloud projects list
gcloud projects describe PROJECT_ID
gcloud config set project PROJECT_ID

# Billing
gcloud billing accounts list
gcloud billing projects link PROJECT_ID --billing-account=ACCOUNT_ID
gcloud billing projects describe PROJECT_ID

# Configuration
gcloud config list
gcloud config set property value
gcloud config configurations list
gcloud config configurations create CONFIG_NAME
```

## Next Steps

Continue to [APIs and Services](./apis-services) to learn about enabling and managing Google Cloud APIs.

