# Module 1: Practice Questions

## Multiple Choice Questions

### Question 1
You need to create a new Google Cloud project for a development environment. What is a requirement for the project ID?

A. It must be unique within your organization
B. It must be unique globally across all Google Cloud customers
C. It can be the same as another project if in a different region
D. It must match your organization domain

<details>
<summary>Answer</summary>

**B. It must be unique globally across all Google Cloud customers**

Project IDs are globally unique identifiers. Once created, they cannot be changed. This ensures no conflicts across all Google Cloud customers worldwide.

</details>

### Question 2
Which gcloud command sets the default project for subsequent commands?

A. `gcloud project set PROJECT_ID`
B. `gcloud config set project PROJECT_ID`
C. `gcloud set default-project PROJECT_ID`
D. `gcloud projects set-default PROJECT_ID`

<details>
<summary>Answer</summary>

**B. `gcloud config set project PROJECT_ID`**

This command sets the project in your gcloud configuration. All subsequent commands will use this project unless overridden with the `--project` flag.

</details>

### Question 3
What is the maximum amount of credit provided in the Google Cloud Free Trial?

A. $200 for 60 days
B. $300 for 90 days
C. $500 for 120 days
D. $100 for 30 days

<details>
<summary>Answer</summary>

**B. $300 for 90 days**

New Google Cloud customers receive $300 in credits valid for 90 days. Any unused credit expires after this period.

</details>

### Question 4
You want to enable the Compute Engine API for your project. Which command should you use?

A. `gcloud compute enable`
B. `gcloud services enable compute.googleapis.com`
C. `gcloud api enable compute`
D. `gcloud enable-api compute`

<details>
<summary>Answer</summary>

**B. `gcloud services enable compute.googleapis.com`**

The correct command uses `gcloud services enable` followed by the API service name, which follows the pattern `SERVICE.googleapis.com`.

</details>

### Question 5
Which of the following is NOT a valid way to manage Google Cloud resources?

A. Google Cloud Console (web UI)
B. gcloud CLI
C. REST APIs
D. AWS CLI

<details>
<summary>Answer</summary>

**D. AWS CLI**

AWS CLI is for Amazon Web Services, not Google Cloud. Google Cloud resources can be managed via Console, gcloud CLI, REST APIs, or client libraries.

</details>

### Question 6
What happens to unused Free Trial credits after 90 days?

A. They roll over to the next billing period
B. They are converted to Always Free tier credits
C. They expire and are lost
D. They are refunded to your payment method

<details>
<summary>Answer</summary>

**C. They expire and are lost**

Free Trial credits expire after 90 days regardless of usage. It's important to set up billing alerts to track usage.

</details>

### Question 7
You need to work with multiple Google Cloud projects. What gcloud feature should you use?

A. Project aliases
B. Configuration profiles
C. Project groups
D. Multi-project mode

<details>
<summary>Answer</summary>

**B. Configuration profiles**

gcloud configurations allow you to maintain separate settings (project, region, zone) for different projects. Use `gcloud config configurations create` to create new configurations.

</details>

### Question 8
Which permission is required to link a billing account to a project?

A. Project Viewer
B. Billing Account User
C. Billing Account Administrator
D. Project Editor

<details>
<summary>Answer</summary>

**B. Billing Account User**

To link a billing account to a project, you need the `billing.accounts.get` and `billing.projects.update` permissions, typically granted through the Billing Account User role.

</details>

### Question 9
What is the purpose of Application Default Credentials (ADC)?

A. To authenticate gcloud CLI commands
B. To provide credentials for client libraries and applications
C. To store service account keys securely
D. To manage IAM policies

<details>
<summary>Answer</summary>

**B. To provide credentials for client libraries and applications**

ADC provides credentials that are automatically used by Google Cloud client libraries and tools like Terraform. They're separate from user credentials used by gcloud CLI.

</details>

### Question 10
Which command lists all enabled APIs in your project?

A. `gcloud apis list`
B. `gcloud services list --enabled`
C. `gcloud enabled-apis list`
D. `gcloud list apis`

<details>
<summary>Answer</summary>

**B. `gcloud services list --enabled`**

The correct command is `gcloud services list` with the `--enabled` flag to filter only enabled APIs.

</details>

## Scenario-Based Questions

### Scenario 1
You are setting up a new Google Cloud project for your company's production workload. The project needs to:
- Be linked to the company billing account
- Have Compute Engine, Cloud Storage, and Cloud SQL APIs enabled
- Have a budget alert set at 80% of the monthly budget
- Use the us-central1 region as default

**Task:** List the steps and commands you would use to set this up.

<details>
<summary>Answer</summary>

**Steps:**

1. **Create the project:**
   ```bash
   gcloud projects create PROJECT_ID --name="Production Project"
   ```

2. **Set the active project:**
   ```bash
   gcloud config set project PROJECT_ID
   ```

3. **Link billing account:**
   ```bash
   gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
   ```

4. **Enable required APIs:**
   ```bash
   gcloud services enable \
     compute.googleapis.com \
     storage-component.googleapis.com \
     sqladmin.googleapis.com
   ```

5. **Set default region:**
   ```bash
   gcloud config set compute/region us-central1
   ```

6. **Set up budget (via Console):**
   - Navigate to Billing > Budgets & Alerts
   - Create budget with 80% alert threshold
   - Configure email notifications

**Alternative:** Budgets can also be managed via the Billing API, but Console is more common for initial setup.

</details>

### Scenario 2
Your development team needs to work with three different Google Cloud projects:
- Development project (dev-project-123)
- Staging project (staging-project-456)
- Production project (prod-project-789)

Each project has different default regions and zones. How would you configure gcloud to easily switch between these projects?

<details>
<summary>Answer</summary>

**Solution: Use gcloud configurations**

1. **Create configuration for development:**
   ```bash
   gcloud config configurations create dev
   gcloud config set project dev-project-123
   gcloud config set compute/region us-west1
   gcloud config set compute/zone us-west1-a
   ```

2. **Create configuration for staging:**
   ```bash
   gcloud config configurations create staging
   gcloud config set project staging-project-456
   gcloud config set compute/region us-central1
   gcloud config set compute/zone us-central1-b
   ```

3. **Create configuration for production:**
   ```bash
   gcloud config configurations create prod
   gcloud config set project prod-project-789
   gcloud config set compute/region us-east1
   gcloud config set compute/zone us-east1-c
   ```

4. **Switch between configurations:**
   ```bash
   gcloud config configurations activate dev    # Switch to dev
   gcloud config configurations activate staging # Switch to staging
   gcloud config configurations activate prod   # Switch to prod
   ```

5. **List all configurations:**
   ```bash
   gcloud config configurations list
   ```

This approach allows each team member to maintain separate settings for each environment and switch easily.

</details>

### Scenario 3
You've been asked to audit API usage across all projects in your organization. You need to:
1. List all projects
2. For each project, list enabled APIs
3. Identify projects with Compute Engine API enabled
4. Export this information for reporting

**Task:** Provide the gcloud commands to accomplish this.

<details>
<summary>Answer</summary>

**Solution:**

1. **List all projects:**
   ```bash
   gcloud projects list --format="table(projectId,name)"
   ```

2. **For a specific project, list enabled APIs:**
   ```bash
   gcloud services list --enabled --project=PROJECT_ID
   ```

3. **Find projects with Compute Engine API enabled:**
   ```bash
   # Script approach (bash)
   for project in $(gcloud projects list --format="value(projectId)"); do
     if gcloud services list --enabled --project=$project \
       --filter="name:compute.googleapis.com" --format="value(name)" | grep -q compute; then
       echo "$project has Compute Engine API enabled"
     fi
   done
   ```

4. **Export to CSV:**
   ```bash
   # List all projects with enabled APIs
   gcloud projects list --format="csv(projectId,name)" > projects.csv
   
   # For each project, get enabled APIs
   for project in $(gcloud projects list --format="value(projectId)"); do
     gcloud services list --enabled --project=$project \
       --format="csv(projectId,name)" >> enabled-apis.csv
   done
   ```

**Alternative using JSON:**
```bash
# Get all projects with their enabled APIs in JSON
gcloud projects list --format=json > projects.json
```

**Note:** For organization-wide audits, you may need organization-level permissions and could use the Resource Manager API or Cloud Asset Inventory.

</details>

### Scenario 4
A developer reports they cannot create a Compute Engine instance. The error message says "API not enabled." You've verified:
- The project has a billing account linked
- The developer has the Compute Engine Admin role
- The project is active

What should you check and how would you fix this?

<details>
<summary>Answer</summary>

**Diagnosis and Solution:**

1. **Check if Compute Engine API is enabled:**
   ```bash
   gcloud services list --enabled --filter="name:compute.googleapis.com"
   ```

2. **If not enabled, enable it:**
   ```bash
   gcloud services enable compute.googleapis.com
   ```

3. **Verify the API is now enabled:**
   ```bash
   gcloud services list --enabled --filter="name:compute.googleapis.com"
   ```

4. **Check API enablement permissions:**
   - The user needs `serviceusage.services.enable` permission
   - Typically granted through: Project Editor, Service Usage Admin, or Owner role
   - Verify with: `gcloud projects get-iam-policy PROJECT_ID`

**Common causes:**
- API not enabled (most common)
- Insufficient permissions to enable APIs
- Billing account not linked (though you verified this)
- Project suspended due to billing issues

**Prevention:**
- Enable commonly used APIs during project setup
- Document required APIs for your team
- Use Infrastructure as Code to ensure APIs are enabled

</details>

### Scenario 5
Your company wants to implement cost controls. You need to:
1. Set up a budget of $5,000 per month
2. Get alerts at 50%, 90%, and 100% of budget
3. Ensure the budget applies to a specific project
4. Send alerts to the finance team email

**Task:** Explain how to set this up (Console method is acceptable, but also mention if there's a CLI/API method).

<details>
<summary>Answer</summary>

**Solution using Google Cloud Console:**

1. **Navigate to Billing:**
   - Go to [Billing](https://console.cloud.google.com/billing)
   - Select the billing account

2. **Create Budget:**
   - Go to "Budgets & alerts"
   - Click "Create Budget"
   - Select "Specified amount"
   - Enter $5,000
   - Set scope to the specific project

3. **Configure Alerts:**
   - Add alert at 50% ($2,500)
   - Add alert at 90% ($4,500)
   - Add alert at 100% ($5,000)
   - For each alert, add finance team email addresses

4. **Review and Create:**
   - Review settings
   - Click "Create Budget"

**Using Billing Budget API (programmatic):**

```bash
# Note: Budget API requires more setup. Here's a conceptual approach:

# 1. Create budget using API
# This typically requires using the Billing Budget API with a service account
# or using Terraform/Deployment Manager

# Example Terraform (conceptual):
# resource "google_billing_budget" "budget" {
#   billing_account = "BILLING_ACCOUNT_ID"
#   display_name    = "Monthly Budget"
#   amount {
#     specified_amount {
#       currency_code = "USD"
#       units         = "5000"
#     }
#   }
#   threshold_rules {
#     threshold_percent = 0.5
#   }
#   threshold_rules {
#     threshold_percent = 0.9
#   }
#   threshold_rules {
#     threshold_percent = 1.0
#   }
#   all_updates_rule {
#     monitoring_notification_channels = [CHANNEL_ID]
#   }
# }
```

**Best Practices:**
- Set budgets at both billing account and project levels
- Use multiple alert thresholds for early warning
- Include relevant stakeholders in notifications
- Review and adjust budgets regularly

</details>

---

## Answer Key Summary

### Multiple Choice Answers
1. B - Project IDs are globally unique
2. B - `gcloud config set project`
3. B - $300 for 90 days
4. B - `gcloud services enable compute.googleapis.com`
5. D - AWS CLI is not for Google Cloud
6. C - Credits expire after 90 days
7. B - Configuration profiles
8. B - Billing Account User role
9. B - For client libraries and applications
10. B - `gcloud services list --enabled`

### Key Takeaways

- **Project IDs** are globally unique and cannot be changed
- **gcloud config** manages default settings
- **Free Trial** provides $300 for 90 days
- **APIs must be enabled** before using services
- **Configurations** help manage multiple projects
- **Budgets** help control costs with alerts
- **Billing accounts** must be linked for paid services

Continue to [Module 2: Identity & Access Management](../02-iam/overview) to learn about IAM fundamentals.

