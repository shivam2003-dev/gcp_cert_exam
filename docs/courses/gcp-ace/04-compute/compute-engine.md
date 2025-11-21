# Compute Engine

## Overview

**Compute Engine** provides scalable, high-performance virtual machines (VMs) that run on Google's infrastructure. It's Google Cloud's Infrastructure-as-a-Service (IaaS) offering.

## Key Concepts

### VM Instances

A **VM instance** is a virtual machine that runs on Google's infrastructure. Each instance has:
- **Machine type** - CPU and memory configuration
- **Boot disk** - Persistent disk containing the OS
- **Network interface** - Connection to VPC network
- **Metadata** - Key-value pairs for configuration

### Machine Types

Machine types define the CPU and memory for a VM:

**Machine Families:**
- **General-purpose (n1, n2, n2d, e2)** - Balanced CPU and memory
- **Compute-optimized (c2)** - High CPU-to-memory ratio
- **Memory-optimized (m1, m2)** - High memory-to-CPU ratio
- **Shared-core (f1, g1)** - Lower cost, burstable performance

:::tip Exam Tip
Know when to use each machine family:
- **n1-standard** - General workloads
- **n1-highmem** - Memory-intensive (databases, analytics)
- **n1-highcpu** - CPU-intensive (batch processing, HPC)
- **f1-micro** - Development, low-traffic web servers
:::

## Creating VM Instances

### Basic VM Creation

```bash
# Create a VM with default settings
gcloud compute instances create my-vm \
  --zone=us-central1-a \
  --machine-type=n1-standard-1 \
  --image-family=debian-11 \
  --image-project=debian-cloud
```

### Advanced VM Creation

```bash
# Create VM with custom configuration
gcloud compute instances create my-vm \
  --zone=us-central1-a \
  --machine-type=n1-standard-2 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=50GB \
  --boot-disk-type=pd-ssd \
  --tags=web-server,http-server \
  --metadata=startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx
    systemctl start nginx'
```

### Preemptible VMs

Preemptible VMs can be terminated by Google with 30 seconds notice but cost up to 80% less:

```bash
# Create preemptible VM
gcloud compute instances create my-preemptible-vm \
  --zone=us-central1-a \
  --machine-type=n1-standard-1 \
  --preemptible \
  --image-family=debian-11 \
  --image-project=debian-cloud
```

:::warning Common Pitfall
Preemptible VMs are not suitable for applications that cannot tolerate interruptions. Use them for batch jobs, data processing, or fault-tolerant workloads.
:::

## Managing VM Instances

### Listing Instances

```bash
# List all instances
gcloud compute instances list

# List instances in a specific zone
gcloud compute instances list --filter="zone:us-central1-a"

# List instances with specific tags
gcloud compute instances list --filter="tags.items:web-server"
```

### Starting and Stopping

```bash
# Stop an instance
gcloud compute instances stop INSTANCE_NAME --zone=ZONE

# Start an instance
gcloud compute instances start INSTANCE_NAME --zone=ZONE

# Restart an instance
gcloud compute instances reset INSTANCE_NAME --zone=ZONE
```

### Deleting Instances

```bash
# Delete instance (keeps boot disk by default)
gcloud compute instances delete INSTANCE_NAME --zone=ZONE

# Delete instance and boot disk
gcloud compute instances delete INSTANCE_NAME --zone=ZONE --delete-disks=boot
```

## Persistent Disks

### Attaching Disks

```bash
# Create a new persistent disk
gcloud compute disks create my-disk \
  --zone=us-central1-a \
  --size=100GB \
  --type=pd-ssd

# Attach disk to VM
gcloud compute instances attach-disk INSTANCE_NAME \
  --disk=my-disk \
  --zone=us-central1-a
```

### Disk Types

- **Standard persistent disk** - Cost-effective, good for most workloads
- **SSD persistent disk** - Higher IOPS, lower latency
- **Balanced persistent disk** - Balance of performance and cost
- **Local SSD** - Highest performance, ephemeral (data lost on stop)

:::note Remember
Local SSD provides the best performance but data is lost when the VM stops. Use for temporary data or cache.
:::

## Instance Templates

Instance templates define VM configurations for reuse:

```bash
# Create instance template
gcloud compute instance-templates create my-template \
  --machine-type=n1-standard-1 \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --tags=web-server \
  --metadata=startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx'

# Create VM from template
gcloud compute instances create my-vm \
  --source-instance-template=my-template \
  --zone=us-central1-a
```

## Instance Groups

Instance groups manage multiple VM instances together:

### Managed Instance Groups

```bash
# Create managed instance group
gcloud compute instance-groups managed create my-group \
  --template=my-template \
  --size=3 \
  --zone=us-central1-a
```

### Autoscaling

```bash
# Enable autoscaling
gcloud compute instance-groups managed set-autoscaling my-group \
  --max-num-replicas=10 \
  --min-num-replicas=2 \
  --target-cpu-utilization=0.6 \
  --zone=us-central1-a
```

## Metadata and Startup Scripts

### Instance Metadata

```bash
# Set metadata on instance
gcloud compute instances add-metadata INSTANCE_NAME \
  --metadata=key1=value1,key2=value2 \
  --zone=ZONE

# Get metadata
gcloud compute instances describe INSTANCE_NAME \
  --zone=ZONE \
  --format="value(metadata.items)"
```

### Startup Scripts

Startup scripts run when a VM boots:

```bash
# Create VM with startup script
gcloud compute instances create my-vm \
  --metadata=startup-script='#!/bin/bash
    apt-get update
    apt-get install -y apache2
    systemctl start apache2' \
  --zone=us-central1-a
```

## Common Operations

### SSH Access

```bash
# SSH into instance
gcloud compute ssh INSTANCE_NAME --zone=ZONE

# SSH with port forwarding
gcloud compute ssh INSTANCE_NAME --zone=ZONE \
  --ssh-flag="-L 8080:localhost:8080"
```

### Viewing Instance Details

```bash
# Describe instance
gcloud compute instances describe INSTANCE_NAME --zone=ZONE

# Get external IP
gcloud compute instances describe INSTANCE_NAME \
  --zone=ZONE \
  --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
```

## Best Practices

1. **Use instance templates** for consistent deployments
2. **Use managed instance groups** for scalability
3. **Enable autoscaling** for variable workloads
4. **Use preemptible VMs** for cost savings on fault-tolerant workloads
5. **Right-size machine types** to optimize costs
6. **Use startup scripts** for automated configuration
7. **Attach persistent disks** for data that needs to persist
8. **Use custom images** for faster deployments

## Cost Optimization

1. **Preemptible VMs** - Up to 80% cost savings
2. **Committed use discounts** - 1-3 year commitments
3. **Sustained use discounts** - Automatic for long-running VMs
4. **Right-sizing** - Match machine type to workload
5. **Stop VMs** when not in use (still pay for disks)

:::tip Exam Tip
The exam often asks about cost-effective options. Preemptible VMs and committed use discounts are common topics.
:::

## Next Steps

Continue to [Google Kubernetes Engine (GKE)](./gke-basics) to learn about managed Kubernetes.
