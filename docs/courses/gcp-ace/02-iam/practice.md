# Module 2: Practice Questions

## Multiple Choice Questions

### Question 1
Which IAM role allows a user to create and manage service accounts but not assign IAM roles?

- A. `roles/iam.serviceAccountAdmin`
- B. `roles/iam.serviceAccountUser`
- C. `roles/iam.admin`
- D. `roles/owner`

<details>
<summary>Answer</summary>

**A. `roles/iam.serviceAccountAdmin`**

This role allows creating and managing service accounts. `serviceAccountUser` allows using/impersonating service accounts but not creating them.

</details>

### Question 2
What is the correct format for a service account email address?

- A. `service-account@project-id`
- B. `service-account@project-id.iam.gserviceaccount.com`
- C. `service-account@project-id.googlecloud.com`
- D. `service-account@project-id.gcp.com`

<details>
<summary>Answer</summary>

**B. `service-account@project-id.iam.gserviceaccount.com`**

Service account emails follow this format: `SA_NAME@PROJECT_ID.iam.gserviceaccount.com`

</details>

### Question 3
Which IAM role provides full control over all resources in a project?

- A. `roles/viewer`
- B. `roles/editor`
- C. `roles/owner`
- D. `roles/admin`

<details>
<summary>Answer</summary>

**C. `roles/owner`**

The Owner role provides full control including the ability to manage IAM policies and delete the project.

</details>

### Question 4
What is the difference between `roles/iam.serviceAccountAdmin` and `roles/iam.serviceAccountUser`?

- A. They are the same
- B. Admin can create SAs, User can only use them
- C. Admin can use SAs, User can only create them
- D. Admin is for projects, User is for organizations

<details>
<summary>Answer</summary>

**B. Admin can create SAs, User can only use them**

`serviceAccountAdmin` can create and manage service accounts. `serviceAccountUser` can impersonate/use service accounts but cannot create them.

</details>

### Question 5
Which command grants a role to a user?

- A. `gcloud iam roles grant USER ROLE`
- B. `gcloud projects add-iam-policy-binding PROJECT_ID --member="user:EMAIL" --role="ROLE"`
- C. `gcloud iam grant ROLE --user=EMAIL`
- D. `gcloud projects grant-role PROJECT_ID USER ROLE`

<details>
<summary>Answer</summary>

**B. `gcloud projects add-iam-policy-binding PROJECT_ID --member="user:EMAIL" --role="ROLE"`**

This command adds an IAM policy binding, granting the role to the specified member.

</details>

### Question 6
What is a service account key used for?

- A. To authenticate service accounts
- B. To encrypt data
- C. To sign certificates
- D. To manage IAM policies

<details>
<summary>Answer</summary>

**A. To authenticate service accounts**

Service account keys are JSON files used to authenticate applications and services as the service account.

</details>

### Question 7
Which permission allows viewing IAM policies?

- A. `iam.policies.get`
- B. `iam.policies.list`
- C. `resourcemanager.projects.getIamPolicy`
- D. `iam.viewPolicies`

<details>
<summary>Answer</summary>

**C. `resourcemanager.projects.getIamPolicy`**

This permission allows reading IAM policies on projects.

</details>

### Question 8
What is the maximum number of service account keys per service account?

- A. 1
- B. 5
- C. 10
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10**

Each service account can have up to 10 keys.

</details>

### Question 9
Which command creates a service account?

- A. `gcloud iam service-accounts create SA_NAME`
- B. `gcloud service-accounts create SA_NAME`
- C. `gcloud create service-account SA_NAME`
- D. `gcloud iam create service-account SA_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud iam service-accounts create SA_NAME`**

This creates a new service account in the current project.

</details>

### Question 10
What happens when you delete a service account?

- A. All resources using it are deleted
- B. Resources continue to work but lose access
- C. The service account is permanently deleted immediately
- D. It enters a 30-day grace period

<details>
<summary>Answer</summary>

**B. Resources continue to work but lose access**

Deleting a service account doesn't delete resources, but those resources will lose the ability to authenticate as that service account.

</details>

### Question 11
Which IAM role allows reading resources but not modifying them?

- A. `roles/viewer`
- B. `roles/reader`
- C. `roles/readonly`
- D. `roles/guest`

<details>
<summary>Answer</summary>

**A. `roles/viewer`**

The Viewer role provides read-only access to resources.

</details>

### Question 12
What is the purpose of IAM conditions?

- A. To set time-based access
- B. To restrict access based on attributes (IP, time, etc.)
- C. To set resource limits
- D. To configure network settings

<details>
<summary>Answer</summary>

**B. To restrict access based on attributes (IP, time, etc.)**

IAM conditions allow you to add restrictions like IP address, time of day, or resource attributes to IAM policies.

</details>

### Question 13
Which command lists all IAM policies for a project?

- A. `gcloud iam policies list --project=PROJECT_ID`
- B. `gcloud projects get-iam-policy PROJECT_ID`
- C. `gcloud iam list-policies PROJECT_ID`
- D. `gcloud projects iam list PROJECT_ID`

<details>
<summary>Answer</summary>

**B. `gcloud projects get-iam-policy PROJECT_ID`**

This command retrieves the IAM policy for the specified project.

</details>

### Question 14
What is a custom IAM role?

- A. A predefined role with a custom name
- B. A user-defined role with specific permissions
- C. A role that applies to custom resources
- D. A role for custom applications

<details>
<summary>Answer</summary>

**B. A user-defined role with specific permissions**

Custom roles allow you to create roles with exactly the permissions you need, following the principle of least privilege.

</details>

### Question 15
Which command creates a service account key?

- A. `gcloud iam service-accounts keys create KEY_FILE --iam-account=SA_EMAIL`
- B. `gcloud service-accounts create-key SA_EMAIL --output=KEY_FILE`
- C. `gcloud iam create-key SA_EMAIL KEY_FILE`
- D. `gcloud service-accounts keys generate SA_EMAIL KEY_FILE`

<details>
<summary>Answer</summary>

**A. `gcloud iam service-accounts keys create KEY_FILE --iam-account=SA_EMAIL`**

This creates and downloads a new service account key.

</details>

### Question 16
What is the difference between primitive and predefined roles?

- A. Primitive roles are newer
- B. Predefined roles are more granular
- C. Primitive roles are more secure
- D. They are the same

<details>
<summary>Answer</summary>

**B. Predefined roles are more granular**

Predefined roles provide specific, granular permissions. Primitive roles (Owner, Editor, Viewer) are broad and legacy.

</details>

### Question 17
Which IAM role is required to manage IAM policies?

- A. `roles/iam.admin`
- B. `roles/iam.policyAdmin`
- C. `roles/owner`
- D. Both A and C

<details>
<summary>Answer</summary>

**D. Both A and C**

Both `roles/iam.admin` and `roles/owner` can manage IAM policies. Owner has broader permissions.

</details>

### Question 18
What is service account impersonation?

- A. Creating a service account that looks like another
- B. Temporarily acting as a service account
- C. Copying service account permissions
- D. Renaming a service account

<details>
<summary>Answer</summary>

**B. Temporarily acting as a service account**

Impersonation allows you to perform actions as a service account, useful for testing and debugging.

</details>

### Question 19
Which command impersonates a service account?

- A. `gcloud auth impersonate-service-account SA_EMAIL`
- B. `gcloud config set auth/impersonate_service_account SA_EMAIL`
- C. Both A and B
- D. `gcloud iam impersonate SA_EMAIL`

<details>
<summary>Answer</summary>

**C. Both A and B**

Both commands can be used to impersonate a service account. The config method persists until changed.

</details>

### Question 20
What is an organization policy?

- A. An IAM policy at the organization level
- B. A constraint that restricts resource configurations
- C. A billing policy
- D. A network policy

<details>
<summary>Answer</summary>

**B. A constraint that restricts resource configurations**

Organization policies enforce constraints on how resources can be configured across an organization.

</details>

### Question 21
Which command lists all service accounts in a project?

- A. `gcloud iam service-accounts list`
- B. `gcloud service-accounts list`
- C. `gcloud iam list service-accounts`
- D. `gcloud list service-accounts`

<details>
<summary>Answer</summary>

**A. `gcloud iam service-accounts list`**

This lists all service accounts in the current or specified project.

</details>

### Question 22
What is the purpose of the `roles/iam.roleViewer` role?

- A. To view IAM roles
- B. To view IAM policies
- C. To view service accounts
- D. To view IAM audit logs

<details>
<summary>Answer</summary>

**A. To view IAM roles**

This role allows viewing IAM roles and their permissions but not modifying them.

</details>

### Question 23
Which IAM role allows managing Compute Engine instances but not networks?

- A. `roles/compute.instanceAdmin`
- B. `roles/compute.admin`
- C. `roles/compute.networkAdmin`
- D. `roles/compute.user`

<details>
<summary>Answer</summary>

**A. `roles/compute.instanceAdmin`**

This role provides full control over VM instances but not network resources.

</details>

### Question 24
What happens when you grant a role to a Google Group?

- A. Only group admins get the role
- B. All members of the group get the role
- C. The group itself gets the role
- D. Nothing, groups can't have roles

<details>
<summary>Answer</summary>

**B. All members of the group get the role**

When you grant a role to a group, all current and future members inherit that role.

</details>

### Question 25
Which command removes a role from a user?

- A. `gcloud projects remove-iam-policy-binding`
- B. `gcloud iam revoke ROLE --user=EMAIL`
- C. `gcloud projects revoke-role PROJECT_ID USER ROLE`
- D. `gcloud iam roles remove USER ROLE`

<details>
<summary>Answer</summary>

**A. `gcloud projects remove-iam-policy-binding`**

This removes an IAM policy binding, effectively revoking the role.

</details>

### Question 26
What is the difference between IAM roles and permissions?

- A. They are the same
- B. Roles are collections of permissions
- C. Permissions are collections of roles
- D. Roles are for users, permissions for resources

<details>
<summary>Answer</summary>

**B. Roles are collections of permissions**

A role is a collection of permissions. When you grant a role, you grant all permissions in that role.

</details>

### Question 27
Which IAM role allows reading Cloud Storage objects?

- A. `roles/storage.admin`
- B. `roles/storage.objectViewer`
- C. `roles/storage.reader`
- D. `roles/storage.viewer`

<details>
<summary>Answer</summary>

**B. `roles/storage.objectViewer`**

This role allows reading objects in Cloud Storage buckets.

</details>

### Question 28
What is the maximum number of custom roles per project?

- A. 10
- B. 50
- C. 100
- D. 300

<details>
<summary>Answer</summary>

**D. 300**

Each project can have up to 300 custom roles.

</details>

### Question 29
Which command tests IAM permissions?

- A. `gcloud iam test-permissions`
- B. `gcloud projects test-iam-permissions`
- C. `gcloud iam check-permissions`
- D. `gcloud test permissions`

<details>
<summary>Answer</summary>

**B. `gcloud projects test-iam-permissions`**

This command tests which permissions the current user has on a project.

</details>

### Question 30
What is the purpose of the `roles/iam.securityReviewer` role?

- A. To review security policies
- B. To view IAM policies and service accounts
- C. To manage security settings
- D. To audit security logs

<details>
<summary>Answer</summary>

**B. To view IAM policies and service accounts**

This role allows viewing IAM policies and service accounts for security auditing purposes.

</details>

### Question 31
Which IAM role allows creating and managing custom roles?

- A. `roles/iam.roleAdmin`
- B. `roles/iam.admin`
- C. `roles/owner`
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

All three roles can create and manage custom roles.

</details>

### Question 32
What is the format for a Google Group member in IAM?

- A. `group:group@example.com`
- B. `group@example.com`
- C. `google-group:group@example.com`
- D. `groups:group@example.com`

<details>
<summary>Answer</summary>

**A. `group:group@example.com`**

Google Groups use the `group:` prefix in IAM member format.

</details>

### Question 33
Which command lists all roles available in a project?

- A. `gcloud iam roles list`
- B. `gcloud projects list-roles`
- C. `gcloud iam list-roles`
- D. `gcloud roles list`

<details>
<summary>Answer</summary>

**A. `gcloud iam roles list`**

This lists all roles (predefined and custom) available in the project.

</details>

### Question 34
What is the difference between `roles/storage.objectAdmin` and `roles/storage.objectCreator`?

- A. Admin can create, Creator can manage
- B. Admin can manage objects, Creator can only create
- C. They are the same
- D. Admin is for buckets, Creator for objects

<details>
<summary>Answer</summary>

**B. Admin can manage objects, Creator can only create**

`objectAdmin` can create, update, and delete objects. `objectCreator` can only create objects.

</details>

### Question 35
Which IAM role allows managing BigQuery datasets?

- A. `roles/bigquery.admin`
- B. `roles/bigquery.dataEditor`
- C. `roles/bigquery.user`
- D. `roles/bigquery.datasetAdmin`

<details>
<summary>Answer</summary>

**B. `roles/bigquery.dataEditor`**

This role allows editing data in BigQuery datasets.

</details>

### Question 36
What happens when you delete a service account key?

- A. The service account is deleted
- B. Applications using that key lose access immediately
- C. The key is disabled but can be restored
- D. Nothing, keys cannot be deleted

<details>
<summary>Answer</summary>

**B. Applications using that key lose access immediately**

Deleting a key immediately invalidates it. Applications using that key will fail to authenticate.

</details>

### Question 37
Which command shows which service account a VM instance is using?

- A. `gcloud compute instances describe INSTANCE --format="value(serviceAccounts)"`
- B. `gcloud compute instances get-service-account INSTANCE`
- C. `gcloud compute instances show-sa INSTANCE`
- D. `gcloud compute instances service-account INSTANCE`

<details>
<summary>Answer</summary>

**A. `gcloud compute instances describe INSTANCE --format="value(serviceAccounts)"`**

The describe command shows all instance details including attached service accounts.

</details>

### Question 38
What is the purpose of the `roles/iam.workloadIdentityUser` role?

- A. To use workload identity pools
- B. To manage workload identity
- C. To create service accounts for workloads
- D. To authenticate workloads

<details>
<summary>Answer</summary>

**A. To use workload identity pools**

This role allows service accounts to be used with workload identity federation.

</details>

### Question 39
Which IAM role allows managing Cloud SQL instances?

- A. `roles/cloudsql.admin`
- B. `roles/cloudsql.client`
- C. `roles/sql.admin`
- D. `roles/cloudsql.instanceAdmin`

<details>
<summary>Answer</summary>

**A. `roles/cloudsql.admin`**

This role provides full control over Cloud SQL instances.

</details>

### Question 40
What is the maximum number of IAM policy bindings per resource?

- A. 100
- B. 500
- C. 1,500
- D. 2,500

<details>
<summary>Answer</summary>

**D. 2,500**

Each resource can have up to 2,500 IAM policy bindings.

</details>

### Question 41
Which command grants a role to all users in a domain?

- A. `gcloud projects add-iam-policy-binding --member="domain:example.com" --role="ROLE"`
- B. `gcloud iam grant-domain ROLE example.com`
- C. `gcloud projects grant-domain ROLE example.com`
- D. `gcloud iam add-domain-binding example.com ROLE`

<details>
<summary>Answer</summary>

**A. `gcloud projects add-iam-policy-binding --member="domain:example.com" --role="ROLE"`**

Using `domain:` prefix grants the role to all users in that domain.

</details>

### Question 42
What is the purpose of the `roles/iam.serviceAccountTokenCreator` role?

- A. To create service account keys
- B. To create OAuth tokens for service accounts
- C. To create service accounts
- D. To manage service account tokens

<details>
<summary>Answer</summary>

**B. To create OAuth tokens for service accounts**

This role allows creating short-lived OAuth tokens for service accounts.

</details>

### Question 43
Which IAM role allows reading audit logs?

- A. `roles/logging.viewer`
- B. `roles/logging.privateLogViewer`
- C. `roles/iam.auditViewer`
- D. `roles/logging.auditViewer`

<details>
<summary>Answer</summary>

**B. `roles/logging.privateLogViewer`**

This role allows viewing audit logs and private logs.

</details>

### Question 44
What is the difference between project-level and organization-level IAM?

- A. Organization-level applies to all projects
- B. Project-level is more secure
- C. They are the same
- D. Organization-level is for billing only

<details>
<summary>Answer</summary>

**A. Organization-level applies to all projects**

Organization-level IAM policies apply to all projects in the organization, while project-level policies apply only to that project.

</details>

### Question 45
Which command creates a custom IAM role?

- A. `gcloud iam roles create ROLE_ID --project=PROJECT_ID --file=role-definition.yaml`
- B. `gcloud create custom-role ROLE_ID --file=role.yaml`
- C. `gcloud iam create-role ROLE_ID role.yaml`
- D. `gcloud roles create custom ROLE_ID --definition=role.yaml`

<details>
<summary>Answer</summary>

**A. `gcloud iam roles create ROLE_ID --project=PROJECT_ID --file=role-definition.yaml`**

Custom roles are created from a YAML file defining the role's permissions.

</details>

### Question 46
What is the purpose of the `roles/resourcemanager.projectIamAdmin` role?

- A. To manage projects
- B. To manage IAM policies on projects
- C. To view project IAM
- D. To create projects

<details>
<summary>Answer</summary>

**B. To manage IAM policies on projects**

This role allows managing IAM policies on projects without being an owner.

</details>

### Question 47
Which IAM role allows managing Cloud Functions?

- A. `roles/cloudfunctions.admin`
- B. `roles/cloudfunctions.developer`
- C. `roles/cloudfunctions.invoker`
- D. `roles/functions.admin`

<details>
<summary>Answer</summary>

**A. `roles/cloudfunctions.admin`**

This role provides full control over Cloud Functions.

</details>

### Question 48
What happens when you grant a role with conditions?

- A. The role always applies
- B. The role only applies when conditions are met
- C. Conditions are ignored
- D. The role is denied

<details>
<summary>Answer</summary>

**B. The role only applies when conditions are met**

IAM conditions restrict when a role is effective. If conditions aren't met, the role doesn't apply.

</details>

### Question 49
Which command lists all members with a specific role?

- A. `gcloud projects get-iam-policy PROJECT_ID --flatten="bindings[].members" --filter="bindings.role:ROLE"`
- B. `gcloud iam list-members ROLE`
- C. `gcloud projects list-members ROLE`
- D. `gcloud iam members list --role=ROLE`

<details>
<summary>Answer</summary>

**A. `gcloud projects get-iam-policy PROJECT_ID --flatten="bindings[].members" --filter="bindings.role:ROLE"`**

This filters the IAM policy to show only members with the specified role.

</details>

### Question 50
What is the purpose of the `roles/iam.organizationRoleAdmin` role?

- A. To manage organization IAM
- B. To manage custom roles at organization level
- C. To view organization roles
- D. To create organizations

<details>
<summary>Answer</summary>

**B. To manage custom roles at organization level**

This role allows creating and managing custom roles that can be used across the organization.

</details>

### Question 51
Which IAM role allows managing GKE clusters?

- A. `roles/container.admin`
- B. `roles/kubernetes.admin`
- C. `roles/gke.admin`
- D. `roles/container.clusterAdmin`

<details>
<summary>Answer</summary>

**A. `roles/container.admin`**

This role provides full control over GKE clusters and related resources.

</details>

### Question 52
What is the maximum number of permissions in a custom role?

- A. 100
- B. 500
- C. 1,000
- D. 2,500

<details>
<summary>Answer</summary>

**D. 2,500**

Each custom role can have up to 2,500 permissions.

</details>

## Scenario-Based Questions

### Scenario 1
You need to grant a developer read-only access to all Compute Engine resources in a project. Which role should you use?

<details>
<summary>Answer</summary>

**Use `roles/compute.viewer`**

This role provides read-only access to all Compute Engine resources including instances, disks, images, and snapshots.

</details>

### Scenario 2
A service account needs to read and write objects in a specific Cloud Storage bucket. What's the most restrictive role you can grant?

<details>
<summary>Answer</summary>

**Use `roles/storage.objectAdmin` on the specific bucket**

This provides full control over objects in that bucket only, following the principle of least privilege. Alternatively, use `roles/storage.objectCreator` and `roles/storage.objectViewer` if only specific operations are needed.

</details>

### Scenario 3
You need to allow a CI/CD pipeline to deploy applications to Cloud Run. Which service account and role combination should you use?

<details>
<summary>Answer</summary>

**Create a service account with `roles/run.admin`**

This role allows deploying and managing Cloud Run services. The CI/CD system should authenticate using this service account's key.

</details>

Continue to [Module 3: Networking Fundamentals](../networking/overview).
