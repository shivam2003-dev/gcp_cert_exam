# Module 2: Practice Questions

## Multiple Choice Questions

### Question 1
Which IAM role allows a user to create and manage service accounts but not assign IAM roles?

A. `roles/iam.serviceAccountAdmin`
B. `roles/iam.serviceAccountUser`
C. `roles/iam.admin`
D. `roles/owner`

<details>
<summary>Answer</summary>

**A. `roles/iam.serviceAccountAdmin`**

This role allows creating and managing service accounts. `serviceAccountUser` allows using/impersonating service accounts but not creating them.

</details>

### Question 2
What is the correct format for a service account email address?

A. `service-account@project-id`
B. `service-account@project-id.iam.gserviceaccount.com`
C. `service-account@project-id.googlecloud.com`
D. `service-account@project-id.gcp.com`

<details>
<summary>Answer</summary>

**B. `service-account@project-id.iam.gserviceaccount.com`**

Service account emails follow this format: `SA_NAME@PROJECT_ID.iam.gserviceaccount.com`

</details>

## More questions coming soon...

Continue to [Module 3: Networking Fundamentals](../03-networking/overview).

