# Module 5: Practice Questions

## Multiple Choice Questions

### Question 1
Which Cloud Storage storage class is best for frequently accessed data?

- A. Standard
- B. Nearline
- C. Coldline
- D. Archive

<details>
<summary>Answer</summary>

**A. Standard**

Standard storage class is designed for frequently accessed data with the lowest access costs.

</details>

### Question 2
What is the maximum size of a single object in Cloud Storage?

- A. 1 TB
- B. 5 TB
- C. 10 TB
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 5 TB**

A single object in Cloud Storage can be up to 5 TB in size.

</details>

### Question 3
Which command creates a Cloud Storage bucket?

- A. `gsutil mb gs://BUCKET_NAME`
- B. `gcloud storage buckets create gs://BUCKET_NAME`
- C. `gcloud storage create-bucket BUCKET_NAME`
- D. `gsutil create-bucket gs://BUCKET_NAME`

<details>
<summary>Answer</summary>

**A. `gsutil mb gs://BUCKET_NAME`**

`gsutil mb` (make bucket) creates a new Cloud Storage bucket.

</details>

### Question 4
What is the difference between Cloud SQL and Cloud Spanner?

- A. Cloud SQL is relational, Spanner is NoSQL
- B. Cloud SQL is regional, Spanner is global
- C. They are the same
- D. Cloud SQL is NoSQL, Spanner is relational

<details>
<summary>Answer</summary>

**B. Cloud SQL is regional, Spanner is global**

Both are relational databases, but Cloud Spanner provides global distribution and horizontal scaling.

</details>

### Question 5
Which Cloud Storage storage class has the lowest storage cost?

- A. Standard
- B. Nearline
- C. Coldline
- D. Archive

<details>
<summary>Answer</summary>

**D. Archive**

Archive storage class has the lowest storage cost but highest access cost and retrieval time.

</details>

### Question 6
What is the purpose of a lifecycle policy in Cloud Storage?

- A. To automatically delete objects
- B. To automatically change storage classes
- C. To manage object versions
- D. Both A and B

<details>
<summary>Answer</summary>

**D. Both A and B**

Lifecycle policies can automatically delete objects or change their storage class based on age or other conditions.

</details>

### Question 7
Which command lists all Cloud Storage buckets?

- A. `gsutil ls`
- B. `gcloud storage buckets list`
- C. `gsutil list-buckets`
- D. `gcloud storage list`

<details>
<summary>Answer</summary>

**A. `gsutil ls`**

This lists all buckets in the current project.

</details>

### Question 8
What is the difference between Firestore and Bigtable?

- A. Firestore is NoSQL document database, Bigtable is wide-column
- B. They are the same
- C. Firestore is relational, Bigtable is NoSQL
- D. Firestore is for analytics, Bigtable for transactions

<details>
<summary>Answer</summary>

**A. Firestore is NoSQL document database, Bigtable is wide-column**

Firestore is a document database. Bigtable is a wide-column NoSQL database for large-scale applications.

</details>

### Question 9
Which Cloud SQL database engine supports PostgreSQL?

- A. MySQL only
- B. PostgreSQL only
- C. Both MySQL and PostgreSQL
- D. SQL Server only

<details>
<summary>Answer</summary>

**C. Both MySQL and PostgreSQL**

Cloud SQL supports MySQL, PostgreSQL, and SQL Server.

</details>

### Question 10
What is the purpose of a persistent disk snapshot?

- A. To backup data
- B. To create new disks
- C. To migrate data
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Snapshots can be used for backups, creating new disks, and migrating data between zones/regions.

</details>

### Question 11
Which command creates a Cloud SQL instance?

- A. `gcloud sql instances create INSTANCE_NAME --database-version=POSTGRES_13`
- B. `gcloud cloud-sql create INSTANCE_NAME --version=POSTGRES_13`
- C. `gcloud sql create-instance INSTANCE_NAME --db=POSTGRES_13`
- D. `gcloud create sql-instance INSTANCE_NAME POSTGRES_13`

<details>
<summary>Answer</summary>

**A. `gcloud sql instances create INSTANCE_NAME --database-version=POSTGRES_13`**

This creates a new Cloud SQL instance with the specified database version.

</details>

### Question 12
What is the maximum size of a Cloud SQL database?

- A. 10 TB
- B. 30 TB
- C. 64 TB
- D. Depends on instance type

<details>
<summary>Answer</summary>

**D. Depends on instance type**

Cloud SQL database size depends on the instance type, with some supporting up to 64 TB.

</details>

### Question 13
Which Cloud Storage feature provides versioning?

- A. Object versioning
- B. Bucket versioning
- C. Storage versioning
- D. File versioning

<details>
<summary>Answer</summary>

**A. Object versioning**

Cloud Storage object versioning keeps multiple versions of objects when enabled.

</details>

### Question 14
What is the purpose of Cloud Storage uniform bucket-level access?

- A. To simplify IAM management
- B. To improve performance
- C. To reduce costs
- D. To enable versioning

<details>
<summary>Answer</summary>

**A. To simplify IAM management**

Uniform bucket-level access uses only IAM for access control, simplifying management compared to ACLs.

</details>

### Question 15
Which command copies a file to Cloud Storage?

- A. `gsutil cp FILE gs://BUCKET_NAME/`
- B. `gcloud storage cp FILE gs://BUCKET_NAME/`
- C. `gsutil copy FILE gs://BUCKET_NAME/`
- D. `gcloud storage upload FILE gs://BUCKET_NAME/`

<details>
<summary>Answer</summary>

**A. `gsutil cp FILE gs://BUCKET_NAME/`**

This copies a file from local storage to Cloud Storage.

</details>

### Question 16
What is the difference between a zonal and regional persistent disk?

- A. Zonal is faster
- B. Regional provides redundancy
- C. They are the same
- D. Regional is cheaper

<details>
<summary>Answer</summary>

**B. Regional provides redundancy**

Regional persistent disks replicate data across multiple zones for high availability.

</details>

### Question 17
Which Cloud Storage storage class has a 30-day minimum storage duration?

- A. Standard
- B. Nearline
- C. Coldline
- D. Archive

<details>
<summary>Answer</summary>

**B. Nearline**

Nearline storage has a 30-day minimum storage duration.

</details>

### Question 18
What is the purpose of Cloud Spanner?

- A. For small databases
- B. For globally distributed, horizontally scalable relational databases
- C. For NoSQL databases only
- D. For data warehousing

<details>
<summary>Answer</summary>

**B. For globally distributed, horizontally scalable relational databases**

Cloud Spanner provides globally distributed, horizontally scalable relational database with strong consistency.

</details>

### Question 19
Which command creates a Firestore database?

- A. `gcloud firestore databases create --location=LOCATION`
- B. `gcloud datastore create --location=LOCATION`
- C. `gcloud firestore create --location=LOCATION`
- D. `gcloud create firestore --location=LOCATION`

<details>
<summary>Answer</summary>

**A. `gcloud firestore databases create --location=LOCATION`**

This creates a new Firestore database in the specified location.

</details>

### Question 20
What is the maximum size of a persistent disk?

- A. 1 TB
- B. 10 TB
- C. 64 TB
- D. 128 TB

<details>
<summary>Answer</summary>

**C. 64 TB**

Persistent disks can be up to 64 TB in size.

</details>

### Question 21
Which Cloud Storage feature allows sharing objects via signed URLs?

- A. IAM
- B. Signed URLs
- C. ACLs
- D. Both B and C

<details>
<summary>Answer</summary>

**B. Signed URLs**

Signed URLs provide time-limited access to objects without requiring IAM permissions.

</details>

### Question 22
What is the purpose of Cloud SQL read replicas?

- A. To improve read performance
- B. To provide high availability
- C. To enable cross-region replication
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Read replicas improve read performance, provide high availability, and can replicate across regions.

</details>

### Question 23
Which command creates a snapshot of a persistent disk?

- A. `gcloud compute disks snapshot DISK_NAME --snapshot-names=SNAPSHOT_NAME`
- B. `gcloud compute snapshots create SNAPSHOT_NAME --source-disk=DISK_NAME`
- C. `gcloud compute create-snapshot DISK_NAME SNAPSHOT_NAME`
- D. `gcloud snapshots create SNAPSHOT_NAME --disk=DISK_NAME`

<details>
<summary>Answer</summary>

**B. `gcloud compute snapshots create SNAPSHOT_NAME --source-disk=DISK_NAME`**

This creates a snapshot of the specified disk.

</details>

### Question 24
What is the difference between Firestore and Datastore?

- A. They are the same
- B. Firestore is the newer version of Datastore
- C. Datastore is newer
- D. Firestore is for mobile, Datastore for web

<details>
<summary>Answer</summary>

**B. Firestore is the newer version of Datastore**

Firestore is the evolution of Cloud Datastore with additional features and improved performance.

</details>

### Question 25
Which Cloud Storage storage class has a 90-day minimum storage duration?

- A. Nearline
- B. Coldline
- C. Archive
- D. Standard

<details>
<summary>Answer</summary>

**B. Coldline**

Coldline storage has a 90-day minimum storage duration.

</details>

### Question 26
What is the purpose of Bigtable?

- A. For relational data
- B. For large-scale NoSQL workloads requiring low latency
- C. For data warehousing
- D. For file storage

<details>
<summary>Answer</summary>

**B. For large-scale NoSQL workloads requiring low latency**

Bigtable is designed for large-scale applications requiring high throughput and low latency.

</details>

### Question 27
Which command lists all Cloud SQL instances?

- A. `gcloud sql instances list`
- B. `gcloud cloud-sql list`
- C. `gcloud sql list-instances`
- D. `gcloud list sql-instances`

<details>
<summary>Answer</summary>

**A. `gcloud sql instances list`**

This lists all Cloud SQL instances in the project.

</details>

### Question 28
What is the maximum number of Cloud Storage buckets per project?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 1,000**

Each project can have up to 1,000 buckets by default (can be increased with quota request).

</details>

### Question 29
Which persistent disk type provides the best IOPS performance?

- A. Standard persistent disk
- B. SSD persistent disk
- C. Balanced persistent disk
- D. Local SSD

<details>
<summary>Answer</summary>

**D. Local SSD**

Local SSD provides the highest IOPS but data is ephemeral (lost when VM stops).

</details>

### Question 30
What is the purpose of Cloud Storage object lifecycle management?

- A. To automatically delete old objects
- B. To automatically change storage classes
- C. To manage object versions
- D. Both A and B

<details>
<summary>Answer</summary>

**D. Both A and B**

Lifecycle management can automatically delete objects or transition them to different storage classes based on age.

</details>

### Question 31
Which Cloud SQL feature provides automatic backups?

- A. Automated backups
- B. On-demand backups
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud SQL supports both automated daily backups and on-demand backups.

</details>

### Question 32
What is the difference between Cloud Storage and Persistent Disks?

- A. Cloud Storage is object storage, Persistent Disks are block storage
- B. They are the same
- C. Cloud Storage is faster
- D. Persistent Disks are for backups only

<details>
<summary>Answer</summary>

**A. Cloud Storage is object storage, Persistent Disks are block storage**

Cloud Storage is object storage for files. Persistent Disks are block storage attached to VMs.

</details>

### Question 33
Which command creates a Cloud SQL database?

- A. `gcloud sql databases create DATABASE_NAME --instance=INSTANCE_NAME`
- B. `gcloud cloud-sql create-database DATABASE_NAME --instance=INSTANCE_NAME`
- C. `gcloud sql create-database DATABASE_NAME INSTANCE_NAME`
- D. `gcloud create sql-database DATABASE_NAME --instance=INSTANCE_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud sql databases create DATABASE_NAME --instance=INSTANCE_NAME`**

This creates a new database in a Cloud SQL instance.

</details>

### Question 34
What is the purpose of Cloud Storage retention policies?

- A. To prevent object deletion
- B. To enforce minimum retention periods
- C. To manage versions
- D. To control access

<details>
<summary>Answer</summary>

**B. To enforce minimum retention periods**

Retention policies prevent objects from being deleted or overwritten for a specified period.

</details>

### Question 35
Which Cloud Storage storage class has a 365-day minimum storage duration?

- A. Coldline
- B. Archive
- C. Nearline
- D. Standard

<details>
<summary>Answer</summary>

**B. Archive**

Archive storage has a 365-day minimum storage duration.

</details>

### Question 36
What is the maximum size of a Cloud Spanner database?

- A. 10 TB
- B. 100 TB
- C. 1 PB
- D. Unlimited

<details>
<summary>Answer</summary>

**D. Unlimited**

Cloud Spanner can scale horizontally to virtually unlimited size.

</details>

### Question 37
Which command deletes a Cloud Storage object?

- A. `gsutil rm gs://BUCKET_NAME/OBJECT`
- B. `gcloud storage delete gs://BUCKET_NAME/OBJECT`
- C. `gsutil delete gs://BUCKET_NAME/OBJECT`
- D. `gcloud storage rm gs://BUCKET_NAME/OBJECT`

<details>
<summary>Answer</summary>

**A. `gsutil rm gs://BUCKET_NAME/OBJECT`**

This deletes the specified object from Cloud Storage.

</details>

### Question 38
What is the purpose of Cloud SQL failover replicas?

- A. To improve read performance
- B. To provide high availability
- C. To enable backups
- D. To reduce costs

<details>
<summary>Answer</summary>

**B. To provide high availability**

Failover replicas automatically promote to primary if the primary instance fails.

</details>

### Question 39
Which Cloud Storage feature provides strong consistency?

- A. Strong consistency
- B. Eventual consistency
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. Strong consistency**

Cloud Storage provides strong read-after-write consistency for all operations.

</details>

### Question 40
What is the difference between Cloud SQL and BigQuery?

- A. Cloud SQL is OLTP, BigQuery is OLAP
- B. They are the same
- C. Cloud SQL is for analytics, BigQuery for transactions
- D. Cloud SQL is NoSQL, BigQuery is SQL

<details>
<summary>Answer</summary>

**A. Cloud SQL is OLTP, BigQuery is OLAP**

Cloud SQL is for transactional workloads (OLTP). BigQuery is for analytics and data warehousing (OLAP).

</details>

### Question 41
Which command sets IAM policy on a Cloud Storage bucket?

- A. `gsutil iam set POLICY_FILE gs://BUCKET_NAME`
- B. `gcloud storage buckets set-iam-policy BUCKET_NAME POLICY_FILE`
- C. `gsutil set-iam BUCKET_NAME POLICY_FILE`
- D. `gcloud storage set-iam BUCKET_NAME POLICY_FILE`

<details>
<summary>Answer</summary>

**A. `gsutil iam set POLICY_FILE gs://BUCKET_NAME`**

This sets IAM policy on a Cloud Storage bucket from a policy file.

</details>

### Question 42
What is the purpose of Cloud SQL point-in-time recovery?

- A. To restore to a specific point in time
- B. To improve performance
- C. To reduce costs
- D. To enable replication

<details>
<summary>Answer</summary>

**A. To restore to a specific point in time**

Point-in-time recovery allows restoring a database to any point within the backup retention period.

</details>

### Question 43
Which Cloud Storage feature allows cross-region replication?

- A. Cross-region replication
- B. Multi-region buckets
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Multi-region buckets automatically replicate across regions. You can also configure cross-region replication for specific buckets.

</details>

### Question 44
What is the maximum number of persistent disks that can be attached to a VM?

- A. 8
- B. 16
- C. 64
- D. 128

<details>
<summary>Answer</summary>

**B. 16**

A single VM instance can have up to 16 persistent disks attached.

</details>

### Question 45
Which command creates a Firestore collection?

- A. `gcloud firestore collections create COLLECTION_NAME`
- B. `gcloud datastore create-collection COLLECTION_NAME`
- C. Collections are created automatically when you add documents
- D. `gcloud firestore create COLLECTION_NAME`

<details>
<summary>Answer</summary>

**C. Collections are created automatically when you add documents**

Firestore collections are created automatically when you add the first document.

</details>

### Question 46
What is the purpose of Cloud Storage object holds?

- A. To prevent deletion
- B. To improve performance
- C. To reduce costs
- D. To enable versioning

<details>
<summary>Answer</summary>

**A. To prevent deletion**

Object holds (legal hold or temporary hold) prevent objects from being deleted.

</details>

### Question 47
Which Cloud SQL database engine is best for Windows applications?

- A. MySQL
- B. PostgreSQL
- C. SQL Server
- D. All are equal

<details>
<summary>Answer</summary>

**C. SQL Server**

SQL Server is the Microsoft database engine, best for Windows/.NET applications.

</details>

### Question 48
What is the maximum size of a Bigtable cluster?

- A. 100 nodes
- B. 1,000 nodes
- C. 10,000 nodes
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 1,000 nodes**

A Bigtable cluster can have up to 1,000 nodes.

</details>

### Question 49
Which command lists all persistent disks?

- A. `gcloud compute disks list`
- B. `gcloud disks list`
- C. `gcloud compute list-disks`
- D. `gcloud storage disks list`

<details>
<summary>Answer</summary>

**A. `gcloud compute disks list`**

This lists all persistent disks in the project.

</details>

### Question 50
What is the purpose of Cloud Storage transfer service?

- A. To move data between buckets
- B. To import data from other clouds or on-premises
- C. To backup data
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Storage Transfer Service can move data between buckets, import from AWS S3 or on-premises, and is used for backups.

</details>

### Question 51
Which Cloud SQL feature provides automatic failover?

- A. High availability configuration
- B. Read replicas
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. High availability configuration**

High availability (HA) configuration provides automatic failover to a standby instance in a different zone.

</details>

### Question 52
What is the difference between a snapshot and an image?

- A. Snapshot is for disks, image is for VMs
- B. They are the same
- C. Snapshot is temporary, image is permanent
- D. Snapshot is for backups, image for deployment

<details>
<summary>Answer</summary>

**D. Snapshot is for backups, image for deployment**

Snapshots are primarily for backups. Images are used to create new VM instances with pre-configured software.

</details>

## Scenario-Based Questions

### Scenario 1
You need to store application logs that are:
- Accessed infrequently (maybe once per month)
- Need to be retained for 7 years for compliance
- Cost is a primary concern

Which Cloud Storage storage class should you use?

<details>
<summary>Answer</summary>

**Use Archive storage class**

Archive storage is ideal because:
- Lowest storage cost
- Data is rarely accessed (compliance/audit purposes)
- 7-year retention is acceptable with Archive's 365-day minimum
- Access cost is acceptable for infrequent access

</details>

### Scenario 2
You need a database for a globally distributed application that requires:
- Strong consistency
- Horizontal scaling
- SQL interface
- Multi-region deployment

Which database service should you use?

<details>
<summary>Answer</summary>

**Use Cloud Spanner**

Cloud Spanner is the best choice because:
- Globally distributed with strong consistency
- Horizontally scalable
- SQL interface
- Multi-region deployment with automatic replication
- No downtime for scaling

Cloud SQL doesn't support horizontal scaling. BigQuery is for analytics, not transactional workloads.

</details>

Continue to [Module 6: Managed Services & Databases](../managed-services/overview).
