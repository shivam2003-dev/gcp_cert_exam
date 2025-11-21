# IAM Fundamentals

## What is IAM?

**Identity and Access Management (IAM)** controls who (identity) has what access (role) to which resources.

## Core Concepts

### Identities

IAM recognizes three types of identities:

1. **Google Accounts** - Individual users with @gmail.com or Google Workspace accounts
2. **Service Accounts** - Accounts used by applications and services
3. **Google Groups** - Collections of users for easier management

:::tip Exam Tip
Service accounts are a critical topic on the ACE exam. Know how to create them, assign roles, and use them for authentication.
:::

### Resources

IAM policies can be attached to:
- **Organization** (top level)
- **Folders**
- **Projects**
- **Individual resources** (VMs, buckets, etc.)

### Roles

A **role** is a collection of permissions. IAM uses three types of roles:

1. **Primitive Roles** (Legacy)
   - Owner
   - Editor
   - Viewer

2. **Predefined Roles** (Recommended)
   - Granular permissions
   - Service-specific (e.g., `roles/compute.instanceAdmin`)
   - Thousands available

3. **Custom Roles**
   - User-defined permissions
   - Project or organization level

:::warning Common Pitfall
Avoid using primitive roles (Owner, Editor, Viewer) in production. They grant overly broad permissions. Use predefined roles instead.
:::

## IAM Policy

An **IAM policy** defines who has what access:

```json
{
  "bindings": [
    {
      "role": "roles/storage.objectViewer",
      "members": [
        "user:alice@example.com",
        "group:developers@example.com",
        "serviceAccount:my-sa@project.iam.gserviceaccount.com"
      ]
    }
  ]
}
```

### Policy Structure

- **Role:** The permissions being granted
- **Members:** Who gets the permissions
- **Condition:** (Optional) When/where the policy applies

## Policy Hierarchy

IAM policies follow a hierarchy:

```
Organization
  └── Folder
      └── Project
          └── Resource (e.g., VM, Bucket)
```

**Policy Inheritance:**
- Policies are inherited from parent to child
- More specific policies can override parent policies
- Deny policies take precedence over allow policies

:::note Remember
IAM policies are additive. A user gets permissions from all policies that apply to them at all levels of the hierarchy.
:::

## Common IAM Roles

### Compute Engine Roles

- `roles/compute.instanceAdmin` - Full control of instances
- `roles/compute.instanceAdmin.v1` - Instance admin (v1)
- `roles/compute.networkAdmin` - Network administration
- `roles/compute.storageAdmin` - Storage administration
- `roles/compute.viewer` - Read-only access

### Storage Roles

- `roles/storage.admin` - Full control
- `roles/storage.objectAdmin` - Object administration
- `roles/storage.objectCreator` - Create objects
- `roles/storage.objectViewer` - Read objects

### IAM Roles

- `roles/iam.serviceAccountAdmin` - Manage service accounts
- `roles/iam.serviceAccountUser` - Use service accounts
- `roles/iam.roleAdmin` - Manage roles
- `roles/iam.securityReviewer` - Review IAM policies

:::tip Exam Tip
Know the difference between `serviceAccountAdmin` (can create/manage service accounts) and `serviceAccountUser` (can use/impersonate service accounts).
:::

## Assigning Roles

### Using Console

1. Navigate to IAM & Admin > IAM
2. Click "Grant Access"
3. Add principal (user/group/service account)
4. Select role
5. Save

### Using gcloud CLI

```bash
# Grant role to user
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:alice@example.com" \
  --role="roles/compute.instanceAdmin"

# Grant role to service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:my-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Grant role to group
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="group:developers@example.com" \
  --role="roles/viewer"
```

## Viewing IAM Policies

```bash
# Get IAM policy for project
gcloud projects get-iam-policy PROJECT_ID

# Get IAM policy with format
gcloud projects get-iam-policy PROJECT_ID \
  --format="table(bindings.role,bindings.members)"

# Check if user has specific permission
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:alice@example.com"
```

## Testing Permissions

```bash
# Test if current user can perform action
gcloud projects get-iam-policy PROJECT_ID

# Use --impersonate-service-account to test as service account
gcloud compute instances list \
  --impersonate-service-account=SA_EMAIL
```

## Best Practices

1. **Use predefined roles** instead of primitive roles
2. **Grant minimum necessary permissions** (principle of least privilege)
3. **Use groups** for user management
4. **Use service accounts** for applications
5. **Review IAM policies regularly**
6. **Use conditions** to restrict access by time, IP, etc.

## Next Steps

Continue to [Service Accounts](./service-accounts) to learn about creating and managing service accounts.

