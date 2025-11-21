# Module 8: Practice Questions

## Multiple Choice Questions

### Question 1
What is the purpose of Secret Manager?

- A. To store and manage secrets securely
- B. To encrypt data
- C. To manage passwords
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Secret Manager provides secure storage and management of secrets like API keys, passwords, and certificates.

</details>

### Question 2
Which command creates a secret in Secret Manager?

- A. `gcloud secrets create SECRET_NAME --data-file=FILE`
- B. `gcloud secret-manager secrets create SECRET_NAME --data-file=FILE`
- C. `gcloud create-secret SECRET_NAME FILE`
- D. `gcloud secrets create SECRET_NAME --value=SECRET_VALUE`

<details>
<summary>Answer</summary>

**B. `gcloud secret-manager secrets create SECRET_NAME --data-file=FILE`**

This creates a new secret from a file containing the secret value.

</details>

### Question 3
What is Cloud Armor used for?

- A. DDoS protection
- B. WAF (Web Application Firewall)
- C. Rate limiting
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Armor provides DDoS protection, WAF capabilities, and rate limiting for HTTP(S) load balancers.

</details>

### Question 4
Which encryption method does Google Cloud use by default for data at rest?

- A. AES-128
- B. AES-256
- C. RSA-2048
- D. No encryption by default

<details>
<summary>Answer</summary>

**B. AES-256**

Google Cloud encrypts all data at rest using AES-256 encryption by default.

</details>

### Question 5
What is the purpose of Customer-Managed Encryption Keys (CMEK)?

- A. To use your own encryption keys
- B. To improve performance
- C. To reduce costs
- D. To enable encryption

<details>
<summary>Answer</summary>

**A. To use your own encryption keys**

CMEK allows you to use your own encryption keys managed in Cloud KMS instead of Google-managed keys.

</details>

### Question 6
Which command creates a Cloud KMS key ring?

- A. `gcloud kms keyrings create KEYRING_NAME --location=LOCATION`
- B. `gcloud kms create-keyring KEYRING_NAME --location=LOCATION`
- C. `gcloud create-kms-keyring KEYRING_NAME --location=LOCATION`
- D. `gcloud kms keyring create KEYRING_NAME LOCATION`

<details>
<summary>Answer</summary>

**A. `gcloud kms keyrings create KEYRING_NAME --location=LOCATION`**

This creates a key ring in the specified location.

</details>

### Question 7
What is Binary Authorization used for?

- A. To authorize binary files
- B. To ensure only trusted container images are deployed
- C. To encrypt binaries
- D. To manage binary storage

<details>
<summary>Answer</summary>

**B. To ensure only trusted container images are deployed**

Binary Authorization enforces policies that only allow deployment of container images that have been signed and verified.

</details>

### Question 8
Which command accesses a secret value from Secret Manager?

- A. `gcloud secrets versions access latest --secret=SECRET_NAME`
- B. `gcloud secret-manager versions access latest --secret=SECRET_NAME`
- C. `gcloud secrets get-value SECRET_NAME`
- D. `gcloud secret-manager get SECRET_NAME`

<details>
<summary>Answer</summary>

**B. `gcloud secret-manager versions access latest --secret=SECRET_NAME`**

This retrieves the latest version of a secret.

</details>

### Question 9
What is the purpose of VPC Service Controls?

- A. To control network access
- B. To restrict access to Google Cloud services
- C. To prevent data exfiltration
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

VPC Service Controls create security perimeters around resources to prevent data exfiltration and control service access.

</details>

### Question 10
Which Cloud Armor feature provides IP-based access control?

- A. IP allowlist
- B. IP denylist
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Armor supports both IP allowlists and denylists for access control.

</details>

### Question 11
What is the maximum size of a secret in Secret Manager?

- A. 1 KB
- B. 64 KB
- C. 1 MB
- D. 10 MB

<details>
<summary>Answer</summary>

**B. 64 KB**

Secrets in Secret Manager can be up to 64 KB in size.

</details>

### Question 12
Which command creates a Cloud KMS key?

- A. `gcloud kms keys create KEY_NAME --keyring=KEYRING_NAME --location=LOCATION --purpose=encryption`
- B. `gcloud kms create-key KEY_NAME --keyring=KEYRING_NAME`
- C. `gcloud create-kms-key KEY_NAME KEYRING_NAME`
- D. `gcloud kms key create KEY_NAME --ring=KEYRING_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud kms keys create KEY_NAME --keyring=KEYRING_NAME --location=LOCATION --purpose=encryption`**

This creates a new encryption key in the specified key ring.

</details>

### Question 13
What is the purpose of Cloud Security Command Center?

- A. To centralize security monitoring
- B. To detect threats
- C. To manage security policies
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Security Command Center provides centralized security monitoring, threat detection, and policy management.

</details>

### Question 14
Which encryption method is used for data in transit?

- A. TLS/SSL
- B. AES-256
- C. RSA
- D. All of the above

<details>
<summary>Answer</summary>

**A. TLS/SSL**

Data in transit is encrypted using TLS/SSL protocols.

</details>

### Question 15
What is the maximum number of secrets per project in Secret Manager?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10,000**

Each project can have up to 10,000 secrets.

</details>

### Question 16
Which command enables Binary Authorization on a GKE cluster?

- A. `gcloud container clusters update CLUSTER_NAME --enable-binary-authorization`
- B. `gcloud gke enable-binary-auth CLUSTER_NAME`
- C. `gcloud container enable-binary-authorization CLUSTER_NAME`
- D. `gcloud binary-authorization enable CLUSTER_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud container clusters update CLUSTER_NAME --enable-binary-authorization`**

This enables Binary Authorization on an existing GKE cluster.

</details>

### Question 17
What is the purpose of Cloud Armor security policies?

- A. To define security rules
- B. To configure WAF rules
- C. To set rate limiting
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Security policies define rules for DDoS protection, WAF, and rate limiting.

</details>

### Question 18
Which command lists all secrets in Secret Manager?

- A. `gcloud secrets list`
- B. `gcloud secret-manager secrets list`
- C. `gcloud list-secrets`
- D. `gcloud secrets list-all`

<details>
<summary>Answer</summary>

**B. `gcloud secret-manager secrets list`**

This lists all secrets in the project.

</details>

### Question 19
What is the difference between Google-managed and customer-managed encryption keys?

- A. Google-managed are free, customer-managed cost money
- B. Customer-managed give you control over key lifecycle
- C. They are the same
- D. Google-managed are more secure

<details>
<summary>Answer</summary>

**B. Customer-managed give you control over key lifecycle**

Customer-managed keys (CMEK) give you control over key rotation, access, and lifecycle management.

</details>

### Question 20
Which Cloud Armor feature provides geographic-based access control?

- A. Geographic restrictions
- B. Region-based rules
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Armor can restrict access based on geographic location or region.

</details>

### Question 21
What is the purpose of Cloud KMS key rotation?

- A. To improve security
- B. To comply with regulations
- C. To manage key lifecycle
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Key rotation improves security, helps with compliance, and is part of proper key lifecycle management.

</details>

### Question 22
Which command creates a Cloud Armor security policy?

- A. `gcloud compute security-policies create POLICY_NAME`
- B. `gcloud armor create-policy POLICY_NAME`
- C. `gcloud compute create-security-policy POLICY_NAME`
- D. `gcloud security-policies create POLICY_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud compute security-policies create POLICY_NAME`**

This creates a new Cloud Armor security policy.

</details>

### Question 23
What is the maximum number of secret versions per secret?

- A. 10
- B. 100
- C. 1,000
- D. 10,000

<details>
<summary>Answer</summary>

**C. 1,000**

Each secret can have up to 1,000 versions.

</details>

### Question 24
Which Cloud KMS key purpose is used for encryption?

- A. ENCRYPT_DECRYPT
- B. ASYMMETRIC_ENCRYPT
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Symmetric keys use ENCRYPT_DECRYPT. Asymmetric keys use ASYMMETRIC_ENCRYPT for encryption operations.

</details>

### Question 25
What is the purpose of Secret Manager secret versions?

- A. To version secrets
- B. To rotate secrets
- C. To track secret history
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Secret versions allow versioning, rotation, and tracking of secret changes over time.

</details>

### Question 26
Which command enables automatic key rotation in Cloud KMS?

- A. `gcloud kms keys update KEY_NAME --primary-key-version=NEW_VERSION --rotation-period=PERIOD`
- B. `gcloud kms enable-rotation KEY_NAME --period=PERIOD`
- C. `gcloud kms keys set-rotation KEY_NAME PERIOD`
- D. `gcloud kms rotate-key KEY_NAME --auto`

<details>
<summary>Answer</summary>

**A. `gcloud kms keys update KEY_NAME --primary-key-version=NEW_VERSION --rotation-period=PERIOD`**

This configures automatic key rotation with the specified period.

</details>

### Question 27
What is the purpose of Cloud Armor adaptive protection?

- A. To automatically detect and mitigate attacks
- B. To improve performance
- C. To reduce costs
- D. To enable SSL

<details>
<summary>Answer</summary>

**A. To automatically detect and mitigate attacks**

Adaptive protection uses machine learning to automatically detect and mitigate DDoS attacks.

</details>

### Question 28
Which command grants access to a secret?

- A. `gcloud secrets add-iam-policy-binding SECRET_NAME --member=USER --role=roles/secretmanager.secretAccessor`
- B. `gcloud secret-manager secrets add-iam-policy-binding SECRET_NAME --member=USER --role=roles/secretmanager.secretAccessor`
- C. `gcloud secrets grant-access SECRET_NAME USER`
- D. `gcloud secret-manager grant SECRET_NAME USER`

<details>
<summary>Answer</summary>

**B. `gcloud secret-manager secrets add-iam-policy-binding SECRET_NAME --member=USER --role=roles/secretmanager.secretAccessor`**

This grants the secretAccessor role to access the secret value.

</details>

### Question 29
What is the difference between encryption at rest and in transit?

- A. At rest is for storage, in transit is for network
- B. They are the same
- C. At rest is for backups, in transit for live data
- D. At rest costs more

<details>
<summary>Answer</summary>

**A. At rest is for storage, in transit is for network**

Encryption at rest protects stored data. Encryption in transit protects data being transmitted over networks.

</details>

### Question 30
Which Cloud Armor feature provides bot detection?

- A. Bot management
- B. Bot detection
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Armor provides bot detection and management capabilities.

</details>

### Question 31
What is the maximum number of Cloud KMS keys per key ring?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10,000**

Each key ring can contain up to 10,000 keys.

</details>

### Question 32
Which command lists all Cloud KMS key rings?

- A. `gcloud kms keyrings list --location=LOCATION`
- B. `gcloud kms list-keyrings --location=LOCATION`
- C. `gcloud kms keyring list LOCATION`
- D. `gcloud list-kms-keyrings LOCATION`

<details>
<summary>Answer</summary>

**A. `gcloud kms keyrings list --location=LOCATION`**

This lists all key rings in the specified location.

</details>

### Question 33
What is the purpose of Secret Manager automatic replication?

- A. To improve availability
- B. To enable multi-region access
- C. To provide redundancy
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Automatic replication ensures secrets are available across regions for high availability.

</details>

### Question 34
Which Cloud Armor rule action blocks traffic?

- A. deny
- B. block
- C. reject
- D. All of the above

<details>
<summary>Answer</summary>

**A. deny**

Cloud Armor rules can have `allow` or `deny` actions. `deny` blocks the traffic.

</details>

### Question 35
What is the maximum number of Cloud KMS key rings per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 key rings per location.

</details>

### Question 36
Which command encrypts data using Cloud KMS?

- A. `gcloud kms encrypt --key=KEY_NAME --plaintext-file=INPUT --ciphertext-file=OUTPUT`
- B. `gcloud kms encrypt-data KEY_NAME INPUT OUTPUT`
- C. `gcloud encrypt --kms-key=KEY_NAME INPUT OUTPUT`
- D. `gcloud kms data encrypt KEY_NAME INPUT OUTPUT`

<details>
<summary>Answer</summary>

**A. `gcloud kms encrypt --key=KEY_NAME --plaintext-file=INPUT --ciphertext-file=OUTPUT`**

This encrypts data using a Cloud KMS key.

</details>

### Question 37
What is the purpose of Binary Authorization policy?

- A. To define which images can be deployed
- B. To require image signatures
- C. To enforce security policies
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Binary Authorization policies define rules about which container images can be deployed based on signatures and attestations.

</details>

### Question 38
Which Secret Manager feature provides secret rotation?

- A. Automatic rotation
- B. Manual rotation
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Secret Manager supports both automatic (via Cloud Functions) and manual secret rotation.

</details>

### Question 39
What is the maximum number of Cloud Armor security policies per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 security policies.

</details>

### Question 40
Which command applies a Cloud Armor policy to a backend service?

- A. `gcloud compute backend-services update BACKEND_SERVICE --security-policy=POLICY_NAME`
- B. `gcloud armor apply-policy POLICY_NAME BACKEND_SERVICE`
- C. `gcloud compute apply-armor-policy BACKEND_SERVICE POLICY_NAME`
- D. `gcloud security-policies attach POLICY_NAME BACKEND_SERVICE`

<details>
<summary>Answer</summary>

**A. `gcloud compute backend-services update BACKEND_SERVICE --security-policy=POLICY_NAME`**

This applies a Cloud Armor security policy to a backend service.

</details>

### Question 41
What is the purpose of Cloud KMS import jobs?

- A. To import keys from external systems
- B. To migrate keys
- C. To backup keys
- D. All of the above

<details>
<summary>Answer</summary>

**A. To import keys from external systems**

Import jobs allow you to import keys from your own key management systems into Cloud KMS.

</details>

### Question 42
Which Secret Manager IAM role allows reading secret values?

- A. `roles/secretmanager.secretAccessor`
- B. `roles/secretmanager.viewer`
- C. `roles/secretmanager.reader`
- D. `roles/secretmanager.user`

<details>
<summary>Answer</summary>

**A. `roles/secretmanager.secretAccessor`**

This role allows reading the actual secret values.

</details>

### Question 43
What is the maximum number of rules per Cloud Armor security policy?

- A. 10
- B. 100
- C. 1,000
- D. 10,000

<details>
<summary>Answer</summary>

**B. 100**

Each security policy can have up to 100 rules.

</details>

### Question 44
Which command creates a new secret version?

- A. `gcloud secrets versions add SECRET_NAME --data-file=FILE`
- B. `gcloud secret-manager versions add SECRET_NAME --data-file=FILE`
- C. `gcloud secrets add-version SECRET_NAME FILE`
- D. `gcloud secret-manager add-version SECRET_NAME FILE`

<details>
<summary>Answer</summary>

**B. `gcloud secret-manager versions add SECRET_NAME --data-file=FILE`**

This creates a new version of an existing secret.

</details>

### Question 45
What is the purpose of Cloud KMS key destruction protection?

- A. To prevent accidental key deletion
- B. To improve security
- C. To comply with regulations
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Destruction protection prevents immediate key deletion, requiring a waiting period for security and compliance.

</details>

### Question 46
Which Cloud Armor feature provides rate limiting?

- A. Rate limiting
- B. Quota enforcement
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Armor provides rate limiting and quota enforcement to protect against abuse.

</details>

### Question 47
What is the maximum number of Cloud KMS import jobs per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 active import jobs.

</details>

### Question 48
Which command disables a Cloud KMS key?

- A. `gcloud kms keys update KEY_NAME --state=disabled`
- B. `gcloud kms disable-key KEY_NAME`
- C. `gcloud kms keys disable KEY_NAME`
- D. `gcloud kms update-key KEY_NAME --disabled`

<details>
<summary>Answer</summary>

**A. `gcloud kms keys update KEY_NAME --state=disabled`**

This disables a key, preventing its use for encryption/decryption.

</details>

### Question 49
What is the purpose of Secret Manager audit logs?

- A. To track secret access
- B. To monitor secret changes
- C. To comply with regulations
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Audit logs track all secret access and modifications for security and compliance.

</details>

### Question 50
Which Cloud Armor feature provides custom rules?

- A. Custom rules
- B. Rule expressions
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Armor supports custom rules and rule expressions for flexible security policies.

</details>

### Question 51
What is the maximum number of Binary Authorization policies per project?

- A. 1
- B. 10
- C. 100
- D. Unlimited

<details>
<summary>Answer</summary>

**A. 1**

Each project can have one Binary Authorization policy that applies to all clusters.

</details>

### Question 52
Which command lists all Cloud Armor security policies?

- A. `gcloud compute security-policies list`
- B. `gcloud armor list-policies`
- C. `gcloud security-policies list`
- D. `gcloud compute list-security-policies`

<details>
<summary>Answer</summary>

**A. `gcloud compute security-policies list`**

This lists all Cloud Armor security policies in the project.

</details>

## Scenario-Based Questions

### Scenario 1
You need to securely store database credentials for a Cloud Run application. The credentials should:
- Be encrypted at rest
- Support rotation without code changes
- Be accessible only by the Cloud Run service
- Be auditable

How would you implement this?

<details>
<summary>Answer</summary>

**Use Secret Manager with IAM**

1. **Create secret:**
```bash
echo -n "db-password" | gcloud secret-manager secrets create db-password \
  --data-file=-
```

2. **Grant access to Cloud Run service account:**
```bash
gcloud secret-manager secrets add-iam-policy-binding db-password \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/secretmanager.secretAccessor"
```

3. **Configure Cloud Run to use secret:**
```bash
gcloud run services update SERVICE_NAME \
  --set-secrets="DB_PASSWORD=db-password:latest"
```

4. **Access in application:**
   - Secret is available as environment variable `DB_PASSWORD`
   - Automatic rotation: Update secret version, Cloud Run uses latest

5. **Audit:**
   - All access is logged in Cloud Audit Logs
   - Can view in Cloud Logging

</details>

### Scenario 2
You need to protect a web application from DDoS attacks and ensure only traffic from specific countries can access it. How would you configure this?

<details>
<summary>Answer</summary>

**Use Cloud Armor**

1. **Create security policy:**
```bash
gcloud compute security-policies create geo-restriction-policy \
  --description="Geographic access control"
```

2. **Add rule to allow specific countries:**
```bash
gcloud compute security-policies rules create 1000 \
  --security-policy=geo-restriction-policy \
  --expression="origin.region_code == 'US' || origin.region_code == 'CA'" \
  --action=allow
```

3. **Add default deny rule:**
```bash
gcloud compute security-policies rules create 2147483647 \
  --security-policy=geo-restriction-policy \
  --action=deny \
  --description="Deny all other traffic"
```

4. **Apply to backend service:**
```bash
gcloud compute backend-services update BACKEND_SERVICE \
  --security-policy=geo-restriction-policy \
  --global
```

5. **Enable DDoS protection:**
   - Cloud Armor automatically provides DDoS protection
   - Can enable adaptive protection for ML-based attack detection

</details>

Continue to [Module 9: Deployment & CI/CD](../deployment/overview).
