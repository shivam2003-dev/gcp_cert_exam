# Module 4: Practice Questions

## Multiple Choice Questions

### Question 1
Which Compute Engine machine type family is best for general-purpose workloads?

- A. n1-standard
- B. n1-highmem
- C. n1-highcpu
- D. f1-micro

<details>
<summary>Answer</summary>

**A. n1-standard**

n1-standard provides a balance of CPU and memory, ideal for general-purpose workloads.

</details>

### Question 2
What is the difference between a regular VM and a preemptible VM?

- A. Preemptible VMs are faster
- B. Preemptible VMs can be terminated by Google and are cheaper
- C. Preemptible VMs have more memory
- D. They are the same

<details>
<summary>Answer</summary>

**B. Preemptible VMs can be terminated by Google and are cheaper**

Preemptible VMs can be terminated with 30 seconds notice but cost up to 80% less than regular VMs.

</details>

### Question 3
Which command creates a Compute Engine VM instance?

- A. `gcloud compute instances create INSTANCE_NAME --zone=ZONE`
- B. `gcloud compute create-instance INSTANCE_NAME --zone=ZONE`
- C. `gcloud instances create INSTANCE_NAME --zone=ZONE`
- D. `gcloud compute vm create INSTANCE_NAME --zone=ZONE`

<details>
<summary>Answer</summary>

**A. `gcloud compute instances create INSTANCE_NAME --zone=ZONE`**

This creates a new VM instance in the specified zone.

</details>

### Question 4
What is the purpose of a startup script in Compute Engine?

- A. To configure the VM at boot time
- B. To start applications
- C. To install software
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Startup scripts run when a VM boots and can configure the system, install software, and start applications.

</details>

### Question 5
Which persistent disk type provides the best performance?

- A. Standard persistent disk
- B. SSD persistent disk
- C. Local SSD
- D. Balanced persistent disk

<details>
<summary>Answer</summary>

**C. Local SSD**

Local SSD provides the highest IOPS and lowest latency but data is lost when the VM is stopped.

</details>

### Question 6
What is GKE (Google Kubernetes Engine)?

- A. A container registry
- B. A managed Kubernetes service
- C. A VM management tool
- D. A load balancer

<details>
<summary>Answer</summary>

**B. A managed Kubernetes service**

GKE is Google's managed Kubernetes service for running containerized applications.

</details>

### Question 7
Which command creates a GKE cluster?

- A. `gcloud container clusters create CLUSTER_NAME --zone=ZONE`
- B. `gcloud gke create CLUSTER_NAME --zone=ZONE`
- C. `gcloud kubernetes create CLUSTER_NAME --zone=ZONE`
- D. `gcloud compute clusters create CLUSTER_NAME --zone=ZONE`

<details>
<summary>Answer</summary>

**A. `gcloud container clusters create CLUSTER_NAME --zone=ZONE`**

This creates a new GKE cluster in the specified zone.

</details>

### Question 8
What is Cloud Run?

- A. A VM service
- B. A fully managed serverless platform for containers
- C. A database service
- D. A networking service

<details>
<summary>Answer</summary>

**B. A fully managed serverless platform for containers**

Cloud Run runs containerized applications in a fully managed serverless environment with automatic scaling.

</details>

### Question 9
Which command deploys a container to Cloud Run?

- A. `gcloud run deploy SERVICE_NAME --image=IMAGE_URL`
- B. `gcloud cloud-run deploy SERVICE_NAME --image=IMAGE_URL`
- C. `gcloud deploy cloud-run SERVICE_NAME --image=IMAGE_URL`
- D. `gcloud containers deploy SERVICE_NAME --image=IMAGE_URL`

<details>
<summary>Answer</summary>

**A. `gcloud run deploy SERVICE_NAME --image=IMAGE_URL`**

This deploys a container image to Cloud Run.

</details>

### Question 10
What is App Engine?

- A. A VM platform
- B. A fully managed serverless platform
- C. A container platform
- D. A database platform

<details>
<summary>Answer</summary>

**B. A fully managed serverless platform**

App Engine is a fully managed serverless platform for building and deploying applications.

</details>

### Question 11
Which App Engine environment provides automatic scaling?

- A. Standard environment only
- B. Flexible environment only
- C. Both Standard and Flexible
- D. Neither

<details>
<summary>Answer</summary>

**C. Both Standard and Flexible**

Both App Engine environments support automatic scaling, though Standard has more limitations but faster cold starts.

</details>

### Question 12
What is Cloud Functions?

- A. A serverless function platform
- B. A VM service
- C. A database service
- D. A networking service

<details>
<summary>Answer</summary>

**A. A serverless function platform**

Cloud Functions is a serverless execution environment for running event-driven functions.

</details>

### Question 13
Which command deploys a Cloud Function?

- A. `gcloud functions deploy FUNCTION_NAME --runtime=python39 --trigger=http`
- B. `gcloud cloud-functions deploy FUNCTION_NAME --runtime=python39`
- C. `gcloud deploy function FUNCTION_NAME --runtime=python39`
- D. `gcloud function create FUNCTION_NAME --runtime=python39`

<details>
<summary>Answer</summary>

**A. `gcloud functions deploy FUNCTION_NAME --runtime=python39 --trigger=http`**

This deploys a Cloud Function with the specified runtime and trigger.

</details>

### Question 14
What is the difference between Cloud Run and Cloud Functions?

- A. Cloud Run is for containers, Cloud Functions for code
- B. They are the same
- C. Cloud Functions is faster
- D. Cloud Run is cheaper

<details>
<summary>Answer</summary>

**A. Cloud Run is for containers, Cloud Functions for code**

Cloud Run runs containerized applications. Cloud Functions runs code directly without containers.

</details>

### Question 15
Which Compute Engine machine type is best for memory-intensive workloads?

- A. n1-standard
- B. n1-highmem
- C. n1-highcpu
- D. f1-micro

<details>
<summary>Answer</summary>

**B. n1-highmem**

n1-highmem provides more memory per CPU, ideal for memory-intensive applications.

</details>

### Question 16
What is an instance template?

- A. A VM configuration template
- B. A container template
- C. A network template
- D. A storage template

<details>
<summary>Answer</summary>

**A. A VM configuration template**

Instance templates define VM configurations that can be reused to create multiple instances.

</details>

### Question 17
Which command creates an instance group?

- A. `gcloud compute instance-groups create GROUP_NAME --zone=ZONE`
- B. `gcloud compute create-instance-group GROUP_NAME --zone=ZONE`
- C. `gcloud instances create-group GROUP_NAME --zone=ZONE`
- D. `gcloud compute groups create GROUP_NAME --zone=ZONE`

<details>
<summary>Answer</summary>

**A. `gcloud compute instance-groups create GROUP_NAME --zone=ZONE`**

This creates a managed or unmanaged instance group.

</details>

### Question 18
What is the purpose of autoscaling in Compute Engine?

- A. To automatically adjust VM sizes
- B. To automatically add/remove VMs based on load
- C. To automatically update software
- D. To automatically backup data

<details>
<summary>Answer</summary>

**B. To automatically add/remove VMs based on load**

Autoscaling automatically adjusts the number of VM instances based on metrics like CPU utilization.

</details>

### Question 19
Which persistent disk type is best for cost-effective storage?

- A. SSD persistent disk
- B. Standard persistent disk
- C. Local SSD
- D. Balanced persistent disk

<details>
<summary>Answer</summary>

**B. Standard persistent disk**

Standard persistent disks are the most cost-effective option for general-purpose storage.

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

### Question 22
What is the difference between a zonal and regional persistent disk?

- A. Zonal is faster
- B. Regional provides redundancy across zones
- C. They are the same
- D. Regional is cheaper

<details>
<summary>Answer</summary>

**B. Regional provides redundancy across zones**

Regional persistent disks replicate data across multiple zones for high availability.

</details>

### Question 23
Which GKE cluster mode provides automatic node management?

- A. Standard cluster
- B. Autopilot cluster
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**B. Autopilot cluster**

GKE Autopilot fully manages nodes, automatically handling provisioning, scaling, and upgrades.

</details>

### Question 24
What is a Cloud Run service?

- A. A single function
- B. A containerized application that can handle requests
- C. A VM instance
- D. A database

<details>
<summary>Answer</summary>

**B. A containerized application that can handle requests**

Cloud Run services run containerized applications that can handle HTTP requests or events.

</details>

### Question 25
Which Cloud Functions trigger type responds to HTTP requests?

- A. HTTP trigger
- B. Event trigger
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. HTTP trigger**

HTTP triggers allow Cloud Functions to respond to HTTP requests directly.

</details>

### Question 26
What is the maximum execution time for a Cloud Function?

- A. 60 seconds
- B. 300 seconds (5 minutes)
- C. 540 seconds (9 minutes)
- D. 600 seconds (10 minutes)

<details>
<summary>Answer</summary>

**C. 540 seconds (9 minutes)**

Cloud Functions have a maximum execution time of 9 minutes (540 seconds).

</details>

### Question 27
Which command lists all VM instances in a project?

- A. `gcloud compute instances list`
- B. `gcloud instances list`
- C. `gcloud compute list-instances`
- D. `gcloud vms list`

<details>
<summary>Answer</summary>

**A. `gcloud compute instances list`**

This lists all VM instances across all zones in the project.

</details>

### Question 28
What is the purpose of a custom image in Compute Engine?

- A. To store application code
- B. To create VMs with pre-configured software
- C. To backup VMs
- D. To share VMs

<details>
<summary>Answer</summary>

**B. To create VMs with pre-configured software**

Custom images allow you to create VMs with your own software and configurations pre-installed.

</details>

### Question 29
Which command stops a VM instance?

- A. `gcloud compute instances stop INSTANCE_NAME --zone=ZONE`
- B. `gcloud instances stop INSTANCE_NAME --zone=ZONE`
- C. `gcloud compute stop-instance INSTANCE_NAME --zone=ZONE`
- D. `gcloud vms stop INSTANCE_NAME --zone=ZONE`

<details>
<summary>Answer</summary>

**A. `gcloud compute instances stop INSTANCE_NAME --zone=ZONE`**

This stops a running VM instance.

</details>

### Question 30
What is the difference between stopping and deleting a VM?

- A. Stopping preserves the disk, deleting removes everything
- B. They are the same
- C. Stopping removes the disk
- D. Deleting preserves the disk

<details>
<summary>Answer</summary>

**A. Stopping preserves the disk, deleting removes everything**

Stopping a VM preserves the boot disk and metadata. Deleting removes the VM and optionally the disk.

</details>

### Question 31
Which App Engine service provides automatic SSL certificates?

- A. Standard environment
- B. Flexible environment
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Both App Engine environments automatically provision and manage SSL certificates.

</details>

### Question 32
What is the purpose of Cloud Run revisions?

- A. To version your application
- B. To roll back deployments
- C. To manage traffic splitting
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Run revisions allow versioning, rollback, and traffic splitting between versions.

</details>

### Question 33
Which command gets credentials for a GKE cluster?

- A. `gcloud container clusters get-credentials CLUSTER_NAME --zone=ZONE`
- B. `gcloud gke get-credentials CLUSTER_NAME --zone=ZONE`
- C. `gcloud kubernetes get-credentials CLUSTER_NAME --zone=ZONE`
- D. `gcloud get-kubeconfig CLUSTER_NAME --zone=ZONE`

<details>
<summary>Answer</summary>

**A. `gcloud container clusters get-credentials CLUSTER_NAME --zone=ZONE`**

This configures kubectl to use the specified GKE cluster.

</details>

### Question 34
What is the maximum number of vCPUs per VM instance?

- A. 32
- B. 64
- C. 96
- D. 160

<details>
<summary>Answer</summary>

**D. 160**

The largest machine types support up to 160 vCPUs.

</details>

### Question 35
Which Cloud Functions runtime supports Python?

- A. python37
- B. python38
- C. python39
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Functions supports multiple Python versions including python37, python38, and python39.

</details>

### Question 36
What is the purpose of a startup script in Compute Engine?

- A. To run commands when VM starts
- B. To install software
- C. To configure the system
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Startup scripts can run any commands, install software, and configure the system when a VM boots.

</details>

### Question 37
Which command creates a managed instance group with autoscaling?

- A. `gcloud compute instance-groups managed create GROUP_NAME --template=TEMPLATE --size=INITIAL_SIZE`
- B. `gcloud compute create-managed-group GROUP_NAME --template=TEMPLATE`
- C. `gcloud instances create-managed-group GROUP_NAME --template=TEMPLATE`
- D. `gcloud compute managed-groups create GROUP_NAME --template=TEMPLATE`

<details>
<summary>Answer</summary>

**A. `gcloud compute instance-groups managed create GROUP_NAME --template=TEMPLATE --size=INITIAL_SIZE`**

This creates a managed instance group using an instance template.

</details>

### Question 38
What is the difference between Cloud Run and App Engine?

- A. Cloud Run uses containers, App Engine uses code deployment
- B. They are the same
- C. App Engine is faster
- D. Cloud Run is more expensive

<details>
<summary>Answer</summary>

**A. Cloud Run uses containers, App Engine uses code deployment**

Cloud Run runs containerized applications. App Engine deploys code directly (though it can also use containers in Flexible environment).

</details>

### Question 39
Which persistent disk feature provides automatic backups?

- A. Snapshots
- B. Regional persistent disks
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. Snapshots**

Snapshots provide point-in-time backups of persistent disks. Regional disks provide redundancy but not automatic backups.

</details>

### Question 40
What is the maximum memory for a single VM instance?

- A. 64 GB
- B. 256 GB
- C. 1.4 TB
- D. 3.75 TB

<details>
<summary>Answer</summary>

**D. 3.75 TB**

The largest machine types support up to 3.75 TB of memory.

</details>

### Question 41
Which command updates a Cloud Run service?

- A. `gcloud run services update SERVICE_NAME --image=NEW_IMAGE`
- B. `gcloud run update SERVICE_NAME --image=NEW_IMAGE`
- C. `gcloud cloud-run update SERVICE_NAME --image=NEW_IMAGE`
- D. `gcloud update run-service SERVICE_NAME --image=NEW_IMAGE`

<details>
<summary>Answer</summary>

**A. `gcloud run services update SERVICE_NAME --image=NEW_IMAGE`**

This updates an existing Cloud Run service with a new container image.

</details>

### Question 42
What is the purpose of a GKE node pool?

- A. To group nodes with similar configuration
- B. To organize containers
- C. To manage networking
- D. To configure storage

<details>
<summary>Answer</summary>

**A. To group nodes with similar configuration**

Node pools group nodes with the same machine type and configuration.

</details>

### Question 43
Which Cloud Functions trigger responds to Cloud Storage events?

- A. HTTP trigger
- B. Event trigger (Cloud Storage)
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**B. Event trigger (Cloud Storage)**

Cloud Functions can be triggered by Cloud Storage events like file uploads or deletions.

</details>

### Question 44
What is the maximum number of instances in a managed instance group?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10,000**

A managed instance group can have up to 10,000 instances.

</details>

### Question 45
Which command creates a custom image from a VM disk?

- A. `gcloud compute images create IMAGE_NAME --source-disk=DISK_NAME`
- B. `gcloud compute create-image IMAGE_NAME --disk=DISK_NAME`
- C. `gcloud images create IMAGE_NAME --source=DISK_NAME`
- D. `gcloud compute disk-to-image DISK_NAME IMAGE_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud compute images create IMAGE_NAME --source-disk=DISK_NAME`**

This creates a custom image from an existing persistent disk.

</details>

### Question 46
What is the difference between Cloud Run and Cloud Functions?

- A. Cloud Run supports longer execution times
- B. Cloud Functions is more limited in runtime options
- C. Cloud Run can handle more concurrent requests
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Run supports up to 60-minute timeouts, more runtime flexibility, and higher concurrency than Cloud Functions.

</details>

### Question 47
Which App Engine scaling type provides the fastest response time?

- A. Automatic scaling
- B. Manual scaling
- C. Basic scaling
- D. They are the same

<details>
<summary>Answer</summary>

**A. Automatic scaling**

Automatic scaling provides the fastest response time by keeping instances ready to handle requests.

</details>

### Question 48
What is the purpose of a health check in Compute Engine?

- A. To monitor VM status
- B. To determine if VMs are healthy for load balancing
- C. To check network connectivity
- D. To verify software installation

<details>
<summary>Answer</summary>

**B. To determine if VMs are healthy for load balancing**

Health checks determine which VM instances are healthy and can receive traffic from load balancers.

</details>

### Question 49
Which command lists all GKE clusters?

- A. `gcloud container clusters list`
- B. `gcloud gke list`
- C. `gcloud kubernetes clusters list`
- D. `gcloud compute clusters list`

<details>
<summary>Answer</summary>

**A. `gcloud container clusters list`**

This lists all GKE clusters in the project.

</details>

### Question 50
What is the maximum number of Cloud Run services per project?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 1,000**

Each project can have up to 1,000 Cloud Run services.

</details>

### Question 51
Which command sets metadata on a VM instance?

- A. `gcloud compute instances add-metadata INSTANCE --metadata KEY=VALUE`
- B. `gcloud instances set-metadata INSTANCE KEY=VALUE`
- C. `gcloud compute set-metadata INSTANCE KEY=VALUE`
- D. `gcloud vms metadata INSTANCE KEY=VALUE`

<details>
<summary>Answer</summary>

**A. `gcloud compute instances add-metadata INSTANCE --metadata KEY=VALUE`**

This adds metadata key-value pairs to a VM instance.

</details>

### Question 52
What is the purpose of a Cloud Run job?

- A. To run batch jobs
- B. To handle HTTP requests
- C. To manage containers
- D. To store data

<details>
<summary>Answer</summary>

**A. To run batch jobs**

Cloud Run jobs run containerized batch jobs that complete and exit, unlike services that handle requests.

</details>

## Scenario-Based Questions

### Scenario 1
You need to deploy a web application that must:
- Scale automatically based on traffic
- Handle HTTP requests
- Be cost-effective
- Support containerized deployment

Which Google Cloud service should you use and why?

<details>
<summary>Answer</summary>

**Use Cloud Run**

Cloud Run is ideal because:
- Automatic scaling to zero when not in use (cost-effective)
- Handles HTTP requests natively
- Supports containerized applications
- Pay only for requests processed
- No infrastructure management required

Alternative: App Engine Flexible if you need more control, but Cloud Run is more cost-effective for variable traffic.

</details>

### Scenario 2
You need to run a batch processing job that processes files from Cloud Storage. The job runs for about 15 minutes and needs to be triggered when files are uploaded. Which service should you use?

<details>
<summary>Answer</summary>

**Use Cloud Run Jobs or Cloud Functions**

**Option 1: Cloud Run Jobs** (Recommended for 15-minute jobs)
- Supports up to 60-minute execution time
- Containerized, more flexible
- Can be triggered by Cloud Scheduler or Pub/Sub

**Option 2: Cloud Functions**
- Maximum 9-minute execution time (too short for 15 minutes)
- Simpler for shorter jobs
- Direct Cloud Storage trigger support

**Best choice: Cloud Run Jobs** since it supports the 15-minute execution requirement.

</details>

Continue to [Module 5: Storage Services](../storage/overview).
