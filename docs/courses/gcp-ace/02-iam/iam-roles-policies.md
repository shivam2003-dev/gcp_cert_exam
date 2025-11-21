# IAM Roles and Policies

## Role Types

- **Primitive Roles:** Owner, Editor, Viewer (avoid in production)
- **Predefined Roles:** Granular, service-specific roles
- **Custom Roles:** User-defined roles with specific permissions

## Assigning Roles

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:EMAIL" \
  --role="roles/ROLE_NAME"
```

## Custom Roles

```bash
# Create custom role from YAML
gcloud iam roles create ROLE_ID \
  --project=PROJECT_ID \
  --file=role-definition.yaml
```

