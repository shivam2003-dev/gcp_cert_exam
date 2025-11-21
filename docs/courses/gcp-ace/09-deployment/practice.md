# Module 9: Practice Questions

## Multiple Choice Questions

### Question 1
What is Cloud Build used for?

- A. CI/CD pipelines
- B. Building container images
- C. Deploying applications
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Build is a CI/CD platform that builds container images, runs tests, and deploys applications.

</details>

### Question 2
Which command triggers a Cloud Build?

- A. `gcloud builds submit`
- B. `gcloud build trigger`
- C. `gcloud cloud-build submit`
- D. `gcloud builds start`

<details>
<summary>Answer</summary>

**A. `gcloud builds submit`**

This submits a build to Cloud Build, which can be triggered manually or automatically.

</details>

### Question 3
What is Deployment Manager used for?

- A. To deploy applications
- B. To manage infrastructure as code
- C. To configure VMs
- D. All of the above

<details>
<summary>Answer</summary>

**B. To manage infrastructure as code**

Deployment Manager uses YAML or Python templates to define and deploy Google Cloud resources.

</details>

### Question 4
Which command creates a deployment using Deployment Manager?

- A. `gcloud deployment-manager deployments create DEPLOYMENT_NAME --config=CONFIG_FILE`
- B. `gcloud deployments create DEPLOYMENT_NAME --config=CONFIG_FILE`
- C. `gcloud create-deployment DEPLOYMENT_NAME CONFIG_FILE`
- D. `gcloud deployment create DEPLOYMENT_NAME --file=CONFIG_FILE`

<details>
<summary>Answer</summary>

**A. `gcloud deployment-manager deployments create DEPLOYMENT_NAME --config=CONFIG_FILE`**

This creates a deployment from a configuration file.

</details>

### Question 5
What is Terraform used for?

- A. Infrastructure as code
- B. Application deployment
- C. Configuration management
- D. All of the above

<details>
<summary>Answer</summary>

**A. Infrastructure as code**

Terraform is an infrastructure-as-code tool for provisioning and managing cloud resources.

</details>

### Question 6
Which Cloud Build trigger type runs on code commits?

- A. Push trigger
- B. Pull request trigger
- C. Manual trigger
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Build supports triggers for push events, pull requests, and manual execution.

</details>

### Question 7
What is the purpose of a Cloud Build configuration file (cloudbuild.yaml)?

- A. To define build steps
- B. To configure build environment
- C. To specify build artifacts
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

The cloudbuild.yaml file defines all aspects of the build process.

</details>

### Question 8
Which command lists all Cloud Build builds?

- A. `gcloud builds list`
- B. `gcloud build list`
- C. `gcloud cloud-build list`
- D. `gcloud list-builds`

<details>
<summary>Answer</summary>

**A. `gcloud builds list`**

This lists all builds in the project.

</details>

### Question 9
What is the maximum build timeout for Cloud Build?

- A. 10 minutes
- B. 1 hour
- C. 4 hours
- D. 24 hours

<details>
<summary>Answer</summary>

**D. 24 hours**

Cloud Build jobs can run for up to 24 hours.

</details>

### Question 10
Which Cloud Source Repositories feature provides Git hosting?

- A. Git hosting
- B. Code hosting
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Source Repositories provides Git hosting for your code repositories.

</details>

### Question 11
What is the purpose of Cloud Build build steps?

- A. To define build actions
- B. To run commands
- C. To execute containers
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Build steps can run commands, execute container images, and perform various build actions.

</details>

### Question 12
Which command creates a Cloud Source Repository?

- A. `gcloud source repos create REPO_NAME`
- B. `gcloud repos create REPO_NAME`
- C. `gcloud create-source-repo REPO_NAME`
- D. `gcloud source-repositories create REPO_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud source repos create REPO_NAME`**

This creates a new Git repository in Cloud Source Repositories.

</details>

### Question 13
What is the difference between Deployment Manager and Terraform?

- A. Deployment Manager is Google-specific, Terraform is multi-cloud
- B. They are the same
- C. Terraform is Google-specific
- D. Deployment Manager is multi-cloud

<details>
<summary>Answer</summary>

**A. Deployment Manager is Google-specific, Terraform is multi-cloud**

Deployment Manager works only with Google Cloud. Terraform supports multiple cloud providers.

</details>

### Question 14
Which Cloud Build feature provides build caching?

- A. Build cache
- B. Artifact caching
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Build supports caching of build artifacts and dependencies to speed up builds.

</details>

### Question 15
What is the maximum number of Cloud Build concurrent builds per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 100**

Each project can run up to 100 concurrent builds by default.

</details>

### Question 16
Which command creates a Cloud Build trigger?

- A. `gcloud builds triggers create --trigger-config=TRIGGER_FILE`
- B. `gcloud build create-trigger TRIGGER_FILE`
- C. `gcloud triggers create TRIGGER_FILE`
- D. `gcloud build-triggers create TRIGGER_FILE`

<details>
<summary>Answer</summary>

**A. `gcloud builds triggers create --trigger-config=TRIGGER_FILE`**

This creates a build trigger from a configuration file.

</details>

### Question 17
What is the purpose of Cloud Build substitutions?

- A. To replace variables in build config
- B. To customize builds
- C. To pass parameters
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Substitutions allow you to use variables in build configurations that are replaced at build time.

</details>

### Question 18
Which command lists all deployments in Deployment Manager?

- A. `gcloud deployment-manager deployments list`
- B. `gcloud deployments list`
- C. `gcloud list-deployments`
- D. `gcloud deployment list`

<details>
<summary>Answer</summary>

**A. `gcloud deployment-manager deployments list`**

This lists all deployments managed by Deployment Manager.

</details>

### Question 19
What is the maximum number of Cloud Source Repositories per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**D. Unlimited**

There's no limit on the number of repositories per project.

</details>

### Question 20
Which Cloud Build feature provides build logs?

- A. Build logs
- B. Log streaming
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Build provides detailed build logs that can be streamed in real-time.

</details>

### Question 21
What is the purpose of Deployment Manager templates?

- A. To define reusable resource configurations
- B. To simplify deployments
- C. To enable parameterization
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Templates allow you to create reusable, parameterized resource definitions.

</details>

### Question 22
Which command deletes a Deployment Manager deployment?

- A. `gcloud deployment-manager deployments delete DEPLOYMENT_NAME`
- B. `gcloud deployments delete DEPLOYMENT_NAME`
- C. `gcloud delete-deployment DEPLOYMENT_NAME`
- D. `gcloud deployment delete DEPLOYMENT_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud deployment-manager deployments delete DEPLOYMENT_NAME`**

This deletes the deployment and all its resources.

</details>

### Question 23
What is the maximum build history retention in Cloud Build?

- A. 30 days
- B. 90 days
- C. 365 days
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 365 days**

Cloud Build retains build history for up to 365 days.

</details>

### Question 24
Which Cloud Source Repositories feature provides code search?

- A. Code search
- B. Full-text search
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Source Repositories provides code search capabilities.

</details>

### Question 25
What is the purpose of Cloud Build service account?

- A. To authenticate builds
- B. To access resources during builds
- C. To deploy applications
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

The Cloud Build service account authenticates builds and accesses resources needed during the build process.

</details>

### Question 26
Which command updates a Deployment Manager deployment?

- A. `gcloud deployment-manager deployments update DEPLOYMENT_NAME --config=CONFIG_FILE`
- B. `gcloud deployments update DEPLOYMENT_NAME CONFIG_FILE`
- C. `gcloud update-deployment DEPLOYMENT_NAME CONFIG_FILE`
- D. `gcloud deployment update DEPLOYMENT_NAME --file=CONFIG_FILE`

<details>
<summary>Answer</summary>

**A. `gcloud deployment-manager deployments update DEPLOYMENT_NAME --config=CONFIG_FILE`**

This updates an existing deployment with a new configuration.

</details>

### Question 27
What is the maximum number of Cloud Build triggers per project?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 1,000**

Each project can have up to 1,000 build triggers.

</details>

### Question 28
Which Cloud Build feature provides build artifacts?

- A. Artifact storage
- B. Build outputs
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Build can store build artifacts like container images, binaries, or other outputs.

</details>

### Question 29
What is the purpose of Terraform state?

- A. To track resource state
- B. To plan changes
- C. To manage dependencies
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Terraform state tracks the current state of resources, enables planning, and manages dependencies.

</details>

### Question 30
Which command initializes a Terraform configuration?

- A. `terraform init`
- B. `terraform initialize`
- C. `terraform setup`
- D. `terraform configure`

<details>
<summary>Answer</summary>

**A. `terraform init`**

This initializes a Terraform working directory and downloads providers.

</details>

### Question 31
What is the maximum number of build steps per Cloud Build job?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**A. 100**

Each Cloud Build job can have up to 100 build steps.

</details>

### Question 32
Which Cloud Source Repositories feature provides integration with GitHub?

- A. GitHub mirroring
- B. GitHub sync
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. GitHub mirroring**

Cloud Source Repositories can mirror GitHub repositories for backup and integration.

</details>

### Question 33
What is the purpose of Cloud Build buildpacks?

- A. To automatically build applications
- B. To detect application type
- C. To simplify builds
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Buildpacks automatically detect application type and build container images without Dockerfiles.

</details>

### Question 34
Which command shows Cloud Build build details?

- A. `gcloud builds describe BUILD_ID`
- B. `gcloud build show BUILD_ID`
- C. `gcloud builds get BUILD_ID`
- D. `gcloud build describe BUILD_ID`

<details>
<summary>Answer</summary>

**A. `gcloud builds describe BUILD_ID`**

This shows detailed information about a specific build.

</details>

### Question 35
What is the maximum size of a Cloud Build artifact?

- A. 100 MB
- B. 1 GB
- C. 10 GB
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10 GB**

Cloud Build artifacts can be up to 10 GB in size.

</details>

### Question 36
Which Deployment Manager resource type creates a VM instance?

- A. compute.v1.instance
- B. gce.instance
- C. compute.instance
- D. vm.instance

<details>
<summary>Answer</summary>

**A. compute.v1.instance**

This is the correct resource type for creating Compute Engine instances in Deployment Manager.

</details>

### Question 37
What is the purpose of Cloud Build machine types?

- A. To specify build compute resources
- B. To improve build performance
- C. To reduce build time
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

You can specify machine types for Cloud Build to allocate more resources for faster builds.

</details>

### Question 38
Which command lists all Cloud Source Repositories?

- A. `gcloud source repos list`
- B. `gcloud repos list`
- C. `gcloud list-source-repos`
- D. `gcloud source-repositories list`

<details>
<summary>Answer</summary>

**A. `gcloud source repos list`**

This lists all repositories in the project.

</details>

### Question 39
What is the maximum number of Deployment Manager deployments per project?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 1,000**

Each project can have up to 1,000 deployments.

</details>

### Question 40
Which Cloud Build feature provides build notifications?

- A. Build notifications
- B. Webhook notifications
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Build can send notifications via email, Pub/Sub, or webhooks.

</details>

### Question 41
What is the purpose of Terraform providers?

- A. To interact with cloud APIs
- B. To manage resources
- C. To authenticate
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Terraform providers enable interaction with cloud APIs, resource management, and authentication.

</details>

### Question 42
Which command applies a Terraform configuration?

- A. `terraform apply`
- B. `terraform deploy`
- C. `terraform execute`
- D. `terraform run`

<details>
<summary>Answer</summary>

**A. `terraform apply`**

This applies the Terraform configuration to create or update resources.

</details>

### Question 43
What is the maximum number of resources per Deployment Manager deployment?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 1,000**

Each deployment can manage up to 1,000 resources.

</details>

### Question 44
Which Cloud Build feature provides build badges?

- A. Build status badges
- B. Status indicators
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Build provides status badges that can be embedded in documentation or dashboards.

</details>

### Question 45
What is the purpose of Cloud Build build config file location?

- A. To specify where cloudbuild.yaml is located
- B. To organize builds
- C. To support monorepos
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

You can specify different build config files for different parts of a repository, useful for monorepos.

</details>

### Question 46
Which command cancels a running Cloud Build?

- A. `gcloud builds cancel BUILD_ID`
- B. `gcloud build stop BUILD_ID`
- C. `gcloud builds stop BUILD_ID`
- D. `gcloud cancel-build BUILD_ID`

<details>
<summary>Answer</summary>

**A. `gcloud builds cancel BUILD_ID`**

This cancels a running or pending build.

</details>

### Question 47
What is the maximum number of Cloud Build workers per build?

- A. 1
- B. 10
- C. 100
- D. Unlimited

<details>
<summary>Answer</summary>

**A. 1**

Each build runs on a single worker, but you can use parallel steps.

</details>

### Question 48
Which Deployment Manager feature provides resource dependencies?

- A. Dependencies
- B. Resource references
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Deployment Manager handles resource dependencies automatically based on references.

</details>

### Question 49
What is the purpose of Cloud Build build logs export?

- A. To export logs to Cloud Storage
- B. To export logs to BigQuery
- C. To archive logs
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Build logs can be exported to Cloud Storage, BigQuery, or other destinations.

</details>

### Question 50
Which command shows Terraform execution plan?

- A. `terraform plan`
- B. `terraform preview`
- C. `terraform show-plan`
- D. `terraform dry-run`

<details>
<summary>Answer</summary>

**A. `terraform plan`**

This shows what changes Terraform will make without actually applying them.

</details>

### Question 51
What is the maximum number of Cloud Build concurrent builds per trigger?

- A. 1
- B. 10
- C. 100
- D. Unlimited

<details>
<summary>Answer</summary>

**A. 1**

Each trigger runs one build at a time, but multiple triggers can run concurrently.

</details>

### Question 52
Which Cloud Source Repositories feature provides access control?

- A. IAM integration
- B. Repository permissions
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Source Repositories uses IAM for access control and repository-level permissions.

</details>

## Scenario-Based Questions

### Scenario 1
You need to set up a CI/CD pipeline that:
- Builds a container image on every commit to main branch
- Runs tests
- Deploys to Cloud Run if tests pass
- Sends notifications on build status

How would you configure this?

<details>
<summary>Answer</summary>

**Use Cloud Build with triggers**

1. **Create cloudbuild.yaml:**
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-app', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-app']
  - name: 'gcr.io/$PROJECT_ID/my-app'
    args: ['test']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args: ['run', 'deploy', 'my-app', '--image', 'gcr.io/$PROJECT_ID/my-app']
images:
  - 'gcr.io/$PROJECT_ID/my-app'
```

2. **Create trigger:**
```bash
gcloud builds triggers create github \
  --repo-name=REPO_NAME \
  --repo-owner=OWNER \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

3. **Configure notifications:**
   - In Cloud Build settings, enable Pub/Sub notifications
   - Set up Cloud Functions to send emails/Slack on build events

</details>

### Scenario 2
You need to deploy infrastructure (VPC, subnets, firewall rules, VMs) using infrastructure as code. Which tool should you use and why?

<details>
<summary>Answer</summary>

**Use Deployment Manager or Terraform**

**Option 1: Deployment Manager** (Google-native)
- Pros: Native Google Cloud integration, simple YAML syntax
- Cons: Google Cloud only, less community support

**Option 2: Terraform** (Recommended for multi-cloud or larger teams)
- Pros: Multi-cloud support, large community, extensive provider ecosystem
- Cons: Requires learning HCL syntax

**For Google Cloud only:** Deployment Manager is simpler
**For multi-cloud or team familiarity:** Terraform is better

Example Deployment Manager config:
```yaml
resources:
- name: my-vpc
  type: compute.v1.network
  properties:
    autoCreateSubnetworks: false
- name: my-subnet
  type: compute.v1.subnetwork
  properties:
    network: $(ref.my-vpc.selfLink)
    ipCidrRange: 10.0.0.0/24
    region: us-central1
```

</details>

Continue to [Practice Exams](../practice-exams/full-length-exam-1).
