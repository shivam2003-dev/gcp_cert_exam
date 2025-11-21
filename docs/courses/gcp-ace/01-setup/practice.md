# Module 1: Practice Questions

## Multiple Choice Questions

### Question 1
You need to create a new Google Cloud project for a development environment. What is a requirement for the project ID?

- A. It must be unique within your organization
- B. It must be unique globally across all Google Cloud customers
- C. It can be the same as another project if in a different region
- D. It must match your organization domain

<details>
<summary>Answer</summary>

**B. It must be unique globally across all Google Cloud customers**

Project IDs are globally unique identifiers. Once created, they cannot be changed. This ensures no conflicts across all Google Cloud customers worldwide.

</details>

### Question 2
Which gcloud command sets the default project for subsequent commands?

- A. `gcloud project set PROJECT_ID`
- B. `gcloud config set project PROJECT_ID`
- C. `gcloud set default-project PROJECT_ID`
- D. `gcloud projects set-default PROJECT_ID`

<details>
<summary>Answer</summary>

**B. `gcloud config set project PROJECT_ID`**

This command sets the project in your gcloud configuration. All subsequent commands will use this project unless overridden with the `--project` flag.

</details>

### Question 3
What is the maximum amount of credit provided in the Google Cloud Free Trial?

- A. $200 for 60 days
- B. $300 for 90 days
- C. $500 for 120 days
- D. $100 for 30 days

<details>
<summary>Answer</summary>

**B. $300 for 90 days**

New Google Cloud customers receive $300 in credits valid for 90 days. Any unused credit expires after this period.

</details>

### Question 4
You want to enable the Compute Engine API for your project. Which command should you use?

- A. `gcloud compute enable`
- B. `gcloud services enable compute.googleapis.com`
- C. `gcloud api enable compute`
- D. `gcloud enable-api compute`

<details>
<summary>Answer</summary>

**B. `gcloud services enable compute.googleapis.com`**

The correct command uses `gcloud services enable` followed by the API service name, which follows the pattern `SERVICE.googleapis.com`.

</details>

### Question 5
Which of the following is NOT a valid way to manage Google Cloud resources?

- A. Google Cloud Console (web UI)
- B. gcloud CLI
- C. REST APIs
- D. AWS CLI

<details>
<summary>Answer</summary>

**D. AWS CLI**

AWS CLI is for Amazon Web Services, not Google Cloud. Google Cloud resources can be managed via Console, gcloud CLI, REST APIs, or client libraries.

</details>

### Question 6
What happens to unused Free Trial credits after 90 days?

- A. They roll over to the next billing period
- B. They are converted to Always Free tier credits
- C. They expire and are lost
- D. They are refunded to your payment method

<details>
<summary>Answer</summary>

**C. They expire and are lost**

Free Trial credits expire after 90 days regardless of usage. It's important to set up billing alerts to track usage.

</details>

### Question 7
You need to work with multiple Google Cloud projects. What gcloud feature should you use?

- A. Project aliases
- B. Configuration profiles
- C. Project groups
- D. Multi-project mode

<details>
<summary>Answer</summary>

**B. Configuration profiles**

gcloud configurations allow you to maintain separate settings (project, region, zone) for different projects. Use `gcloud config configurations create` to create new configurations.

</details>

### Question 8
Which permission is required to link a billing account to a project?

- A. Project Viewer
- B. Billing Account User
- C. Billing Account Administrator
- D. Project Editor

<details>
<summary>Answer</summary>

**B. Billing Account User**

To link a billing account to a project, you need the `billing.accounts.get` and `billing.projects.update` permissions, typically granted through the Billing Account User role.

</details>

### Question 9
What is the purpose of Application Default Credentials (ADC)?

- A. To authenticate gcloud CLI commands
- B. To provide credentials for client libraries and applications
- C. To store service account keys securely
- D. To manage IAM policies

<details>
<summary>Answer</summary>

**B. To provide credentials for client libraries and applications**

ADC provides credentials that are automatically used by Google Cloud client libraries and tools like Terraform. They're separate from user credentials used by gcloud CLI.

</details>

### Question 10
Which command lists all enabled APIs in your project?

- A. `gcloud apis list`
- B. `gcloud services list --enabled`
- C. `gcloud enabled-apis list`
- D. `gcloud list apis`

<details>
<summary>Answer</summary>

**B. `gcloud services list --enabled`**

The correct command is `gcloud services list` with the `--enabled` flag to filter only enabled APIs.

</details>

### Question 11
What is the command to view your current gcloud configuration?

- A. `gcloud config show`
- B. `gcloud config list`
- C. `gcloud config view`
- D. `gcloud show config`

<details>
<summary>Answer</summary>

**B. `gcloud config list`**

This command displays all current configuration settings including project, region, zone, and account.

</details>

### Question 12
Which gcloud command initializes the SDK interactively?

- A. `gcloud init`
- B. `gcloud setup`
- C. `gcloud configure`
- D. `gcloud install`

<details>
<summary>Answer</summary>

**A. `gcloud init`**

The `gcloud init` command interactively sets up authentication, project, and default compute region/zone.

</details>

### Question 13
What happens when you disable a Google Cloud API?

- A. All resources using that API are immediately deleted
- B. The API is disabled but existing resources remain
- C. You cannot disable APIs once enabled
- D. Only new resources are affected

<details>
<summary>Answer</summary>

**B. The API is disabled but existing resources remain**

Disabling an API prevents new operations but doesn't delete existing resources. However, you won't be able to manage those resources until the API is re-enabled.

</details>

### Question 14
Which of the following is a valid project ID format?

- A. `my-project-123`
- B. `My Project`
- C. `my_project_123`
- D. `my project 123`

<details>
<summary>Answer</summary>

**A. `my-project-123`**

Project IDs must be lowercase, can contain letters, numbers, and hyphens, but cannot start or end with a hyphen.

</details>

### Question 15
What is the purpose of gcloud configurations?

- A. To store API keys
- B. To manage multiple projects and their settings
- C. To configure network settings
- D. To set up authentication

<details>
<summary>Answer</summary>

**B. To manage multiple projects and their settings**

Configurations allow you to maintain separate settings (project, region, zone) for different projects and switch between them easily.

</details>

### Question 16
Which command creates a new gcloud configuration?

- A. `gcloud config create CONFIG_NAME`
- B. `gcloud config configurations create CONFIG_NAME`
- C. `gcloud create config CONFIG_NAME`
- D. `gcloud config new CONFIG_NAME`

<details>
<summary>Answer</summary>

**B. `gcloud config configurations create CONFIG_NAME`**

This command creates a new configuration that you can then customize with project, region, and zone settings.

</details>

### Question 17
What is the maximum number of projects you can have in a Google Cloud organization?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited (with quota)

<details>
<summary>Answer</summary>

**D. Unlimited (with quota)**

There's no hard limit, but there are quotas. You can request quota increases if needed.

</details>

### Question 18
Which role is required to create a new project?

- A. Project Creator
- B. Project Owner
- C. Organization Admin
- D. Billing Account User

<details>
<summary>Answer</summary>

**A. Project Creator**

The Project Creator role allows creating new projects within an organization or billing account.

</details>

### Question 19
What information is required to link a billing account to a project?

- A. Billing account name only
- B. Billing account ID only
- C. Both billing account name and ID
- D. Credit card information

<details>
<summary>Answer</summary>

**B. Billing account ID only**

You need the billing account ID (format: 01XXXX-XXXXXX-XXXXXX) to link it to a project.

</details>

### Question 20
Which command lists all billing accounts you have access to?

- A. `gcloud billing list`
- B. `gcloud billing accounts list`
- C. `gcloud list billing-accounts`
- D. `gcloud accounts billing list`

<details>
<summary>Answer</summary>

**B. `gcloud billing accounts list`**

This command shows all billing accounts your user has permission to view.

</details>

### Question 21
What is the difference between a project name and a project ID?

- A. They are the same thing
- B. Project name can be changed, project ID cannot
- C. Project ID can be changed, project name cannot
- D. Neither can be changed

<details>
<summary>Answer</summary>

**B. Project name can be changed, project ID cannot**

Project names are human-readable and can be modified. Project IDs are permanent identifiers that cannot be changed after creation.

</details>

### Question 22
Which API must be enabled to use Compute Engine?

- A. `compute.googleapis.com`
- B. `computeengine.googleapis.com`
- C. `gce.googleapis.com`
- D. `compute.api.googleapis.com`

<details>
<summary>Answer</summary>

**A. `compute.googleapis.com`**

The Compute Engine API service name is `compute.googleapis.com`.

</details>

### Question 23
What is the purpose of the `--quiet` flag in gcloud commands?

- A. Reduces output verbosity
- B. Skips confirmation prompts
- C. Runs commands in background
- D. Disables error messages

<details>
<summary>Answer</summary>

**B. Skips confirmation prompts**

The `--quiet` flag automatically confirms prompts, useful for scripting but dangerous as it can lead to accidental deletions.

</details>

### Question 24
Which command updates the gcloud SDK to the latest version?

- A. `gcloud update`
- B. `gcloud components update`
- C. `gcloud upgrade`
- D. `gcloud install --update`

<details>
<summary>Answer</summary>

**B. `gcloud components update`**

This command updates all installed gcloud components to their latest versions.

</details>

### Question 25
What is the default region if you don't specify one?

- A. us-east1
- B. us-central1
- C. There is no default
- D. europe-west1

<details>
<summary>Answer</summary>

**C. There is no default**

You must explicitly set a region. There's no default region in gcloud configuration.

</details>

### Question 26
Which command sets the default compute zone?

- A. `gcloud config set zone ZONE`
- B. `gcloud config set compute/zone ZONE`
- C. `gcloud set zone ZONE`
- D. `gcloud zone set ZONE`

<details>
<summary>Answer</summary>

**B. `gcloud config set compute/zone ZONE`**

The compute zone is set using the `compute/zone` property path.

</details>

### Question 27
What happens if you try to create a project with an ID that already exists?

- A. It creates a new project with a modified ID
- B. The command fails with an error
- C. It links to the existing project
- D. It creates a project in a different region

<details>
<summary>Answer</summary>

**B. The command fails with an error**

Project IDs are globally unique. If the ID exists, the creation will fail.

</details>

### Question 28
Which of the following is NOT a valid way to authenticate with Google Cloud?

- A. User credentials (`gcloud auth login`)
- B. Service account key file
- C. Application Default Credentials
- D. SSH keys

<details>
<summary>Answer</summary>

**D. SSH keys**

SSH keys are for connecting to VMs, not for authenticating gcloud or APIs.

</details>

### Question 29
What is the command to revoke application default credentials?

- A. `gcloud auth application-default revoke`
- B. `gcloud auth revoke application-default`
- C. `gcloud auth application-default logout`
- D. `gcloud auth logout application-default`

<details>
<summary>Answer</summary>

**A. `gcloud auth application-default revoke`**

This command revokes the application default credentials.

</details>

### Question 30
Which file stores gcloud configuration?

- A. `~/.gcloud/config`
- B. `~/.config/gcloud/config`
- C. `~/.gcloudrc`
- D. `/etc/gcloud/config`

<details>
<summary>Answer</summary>

**B. `~/.config/gcloud/config`**

gcloud stores its configuration in `~/.config/gcloud/` directory.

</details>

### Question 31
What is the purpose of the `--format` flag in gcloud commands?

- A. Formats the output as JSON or table
- B. Formats disk drives
- C. Formats network configuration
- D. Formats project structure

<details>
<summary>Answer</summary>

**A. Formats the output as JSON or table**

The `--format` flag controls output format (table, json, yaml, csv, etc.).

</details>

### Question 32
Which command lists all available Google Cloud services/APIs?

- A. `gcloud services list --available`
- B. `gcloud apis list`
- C. `gcloud list services`
- D. `gcloud services available`

<details>
<summary>Answer</summary>

**A. `gcloud services list --available`**

This shows all APIs available to enable in your project.

</details>

### Question 33
What is a quota in Google Cloud?

- A. A billing limit
- B. A resource usage limit
- C. A time limit
- D. A storage limit

<details>
<summary>Answer</summary>

**B. A resource usage limit**

Quotas limit the number of resources you can create or the rate of API calls you can make.

</details>

### Question 34
Which command shows quota information for a project?

- A. `gcloud compute quotas list`
- B. `gcloud compute project-info describe`
- C. `gcloud quotas describe`
- D. `gcloud project quotas`

<details>
<summary>Answer</summary>

**B. `gcloud compute project-info describe`**

This command shows project information including quota details.

</details>

### Question 35
What is the Always Free tier?

- A. $300 credit for 90 days
- B. Limited free usage of certain services permanently
- C. Free trial period
- D. Discounted pricing

<details>
<summary>Answer</summary>

**B. Limited free usage of certain services permanently**

Always Free tier provides limited but permanent free usage of many Google Cloud services.

</details>

### Question 36
Which command exports project information to JSON format?

- A. `gcloud projects describe PROJECT_ID --format=json`
- B. `gcloud projects export PROJECT_ID --json`
- C. `gcloud projects get PROJECT_ID --json`
- D. `gcloud projects show PROJECT_ID --format json`

<details>
<summary>Answer</summary>

**A. `gcloud projects describe PROJECT_ID --format=json`**

The `--format=json` flag outputs the result in JSON format.

</details>

### Question 37
What is the maximum length for a project ID?

- A. 6 characters
- B. 30 characters
- C. 63 characters
- D. 100 characters

<details>
<summary>Answer</summary>

**B. 30 characters**

Project IDs must be between 6 and 30 characters long.

</details>

### Question 38
Which permission allows viewing project information?

- A. Project Viewer
- B. Project Reader
- C. Project Info Viewer
- D. Project Access Viewer

<details>
<summary>Answer</summary>

**A. Project Viewer**

The Project Viewer role allows viewing project information and resources but not modifying them.

</details>

### Question 39
What happens when you delete a project?

- A. All resources are immediately deleted
- B. Resources are marked for deletion after 30 days
- C. Only billing is disabled, resources remain
- D. Project is suspended but not deleted

<details>
<summary>Answer</summary>

**B. Resources are marked for deletion after 30 days**

When you delete a project, it enters a 30-day grace period before permanent deletion. Resources can be recovered during this period.

</details>

### Question 40
Which command activates a specific gcloud configuration?

- A. `gcloud config activate CONFIG_NAME`
- B. `gcloud config configurations activate CONFIG_NAME`
- C. `gcloud activate config CONFIG_NAME`
- D. `gcloud use config CONFIG_NAME`

<details>
<summary>Answer</summary>

**B. `gcloud config configurations activate CONFIG_NAME`**

This switches to the specified configuration, making its settings active.

</details>

### Question 41
What is the difference between a region and a zone?

- A. They are the same
- B. A region contains multiple zones
- C. A zone contains multiple regions
- D. Regions are for networking, zones for compute

<details>
<summary>Answer</summary>

**B. A region contains multiple zones**

A region is a geographic location that contains multiple zones. Zones are isolated locations within a region.

</details>

### Question 42
Which command shows help for a specific gcloud command?

- A. `gcloud help COMMAND`
- B. `gcloud COMMAND --help`
- C. Both A and B
- D. `gcloud manual COMMAND`

<details>
<summary>Answer</summary>

**C. Both A and B**

Both `gcloud help COMMAND` and `gcloud COMMAND --help` display help information.

</details>

### Question 43
What is the purpose of the `--filter` flag in gcloud commands?

- A. Filters network traffic
- B. Filters command output based on conditions
- C. Filters input data
- D. Filters error messages

<details>
<summary>Answer</summary>

**B. Filters command output based on conditions**

The `--filter` flag allows you to filter results based on field values.

</details>

### Question 44
Which API is required to use Cloud Storage?

- A. `storage.googleapis.com`
- B. `storage-api.googleapis.com`
- C. `storage-component.googleapis.com`
- D. `cloud-storage.googleapis.com`

<details>
<summary>Answer</summary>

**C. `storage-component.googleapis.com`**

The Cloud Storage API service name is `storage-component.googleapis.com`.

</details>

### Question 45
What is the command to check if a specific API is enabled?

- A. `gcloud services check API_NAME`
- B. `gcloud services list --filter="name:API_NAME"`
- C. `gcloud api status API_NAME`
- D. `gcloud check api API_NAME`

<details>
<summary>Answer</summary>

**B. `gcloud services list --filter="name:API_NAME"`**

This filters the services list to show only the specified API.

</details>

### Question 46
Which of the following is a valid project ID?

- A. `MyProject`
- B. `my_project`
- C. `my-project-123`
- D. `123-project`

<details>
<summary>Answer</summary>

**C. `my-project-123`**

Project IDs must be lowercase, can contain letters, numbers, and hyphens, but cannot start with a number.

</details>

### Question 47
What is the purpose of labels on projects?

- A. They affect functionality
- B. They are for organization and filtering only
- C. They control access
- D. They set quotas

<details>
<summary>Answer</summary>

**B. They are for organization and filtering only**

Labels are metadata for organization and don't affect functionality, access, or quotas.

</details>

### Question 48
Which command lists all projects in an organization?

- A. `gcloud projects list --organization=ORG_ID`
- B. `gcloud organization projects list ORG_ID`
- C. `gcloud list projects --org ORG_ID`
- D. `gcloud projects --organization ORG_ID`

<details>
<summary>Answer</summary>

**A. `gcloud projects list --organization=ORG_ID`**

The `--organization` flag filters projects by organization.

</details>

### Question 49
What happens to a project when its billing account is unlinked?

- A. Project is immediately deleted
- B. All resources are stopped
- C. Paid services stop working, free services continue
- D. Nothing happens

<details>
<summary>Answer</summary>

**C. Paid services stop working, free services continue**

Unlinking billing disables paid services but free tier services continue to work.

</details>

### Question 50
Which command shows the current active gcloud configuration?

- A. `gcloud config current`
- B. `gcloud config get-value core/account`
- C. `gcloud config list`
- D. `gcloud config show active`

<details>
<summary>Answer</summary>

**C. `gcloud config list`**

This shows all current configuration values including which configuration is active.

</details>

### Question 51
What is the minimum number of characters for a project ID?

- A. 4
- B. 6
- C. 8
- D. 10

<details>
<summary>Answer</summary>

**B. 6**

Project IDs must be between 6 and 30 characters.

</details>

### Question 52
Which command deletes a gcloud configuration?

- A. `gcloud config delete CONFIG_NAME`
- B. `gcloud config configurations delete CONFIG_NAME`
- C. `gcloud remove config CONFIG_NAME`
- D. `gcloud config remove CONFIG_NAME`

<details>
<summary>Answer</summary>

**B. `gcloud config configurations delete CONFIG_NAME`**

This permanently deletes the specified configuration.

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

Continue to [Module 2: Identity & Access Management](../iam/overview) to learn about IAM fundamentals.

