/**
 * Multi-Course Sidebar Configuration
 * Each course has its own sidebar configuration
 */

// @ts-check
const courses = require('./courses.config');

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Main courses index sidebar
  coursesSidebar: [
    {
      type: 'doc',
      id: 'courses',
      label: 'All Courses',
    },
  ],

  // GCP ACE Course Sidebar
  gcpAceSidebar: [
    {
      type: 'doc',
      id: 'courses/gcp-ace/intro',
      label: 'Course Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'courses/gcp-ace/introduction/course-overview',
        'courses/gcp-ace/introduction/exam-strategy',
        'courses/gcp-ace/introduction/learning-path',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: Setting Up Cloud Solution Environment',
      items: [
        'courses/gcp-ace/setup/overview',
        'courses/gcp-ace/setup/projects-billing',
        'courses/gcp-ace/setup/apis-services',
        'courses/gcp-ace/setup/gcloud-sdk',
        'courses/gcp-ace/setup/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Identity & Access Management (IAM)',
      items: [
        'courses/gcp-ace/iam/overview',
        'courses/gcp-ace/iam/iam-fundamentals',
        'courses/gcp-ace/iam/service-accounts',
        'courses/gcp-ace/iam/iam-roles-policies',
        'courses/gcp-ace/iam/organization-policies',
        'courses/gcp-ace/iam/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Networking Fundamentals',
      items: [
        'courses/gcp-ace/networking/overview',
        'courses/gcp-ace/networking/vpc-fundamentals',
        'courses/gcp-ace/networking/firewall-rules',
        'courses/gcp-ace/networking/load-balancing',
        'courses/gcp-ace/networking/cloud-dns',
        'courses/gcp-ace/networking/cloud-cdn',
        'courses/gcp-ace/networking/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Compute Services',
      items: [
        'courses/gcp-ace/compute/overview',
        'courses/gcp-ace/compute/compute-engine',
        'courses/gcp-ace/compute/gke-basics',
        'courses/gcp-ace/compute/cloud-run',
        'courses/gcp-ace/compute/app-engine',
        'courses/gcp-ace/compute/cloud-functions',
        'courses/gcp-ace/compute/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Storage Services',
      items: [
        'courses/gcp-ace/storage/overview',
        'courses/gcp-ace/storage/cloud-storage',
        'courses/gcp-ace/storage/persistent-disks',
        'courses/gcp-ace/storage/cloud-sql',
        'courses/gcp-ace/storage/cloud-spanner',
        'courses/gcp-ace/storage/firestore',
        'courses/gcp-ace/storage/bigtable',
        'courses/gcp-ace/storage/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Managed Services & Databases',
      items: [
        'courses/gcp-ace/managed-services/overview',
        'courses/gcp-ace/managed-services/bigquery',
        'courses/gcp-ace/managed-services/pub-sub',
        'courses/gcp-ace/managed-services/cloud-endpoints',
        'courses/gcp-ace/managed-services/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 7: Monitoring, Logging & Operations',
      items: [
        'courses/gcp-ace/operations/overview',
        'courses/gcp-ace/operations/cloud-monitoring',
        'courses/gcp-ace/operations/cloud-logging',
        'courses/gcp-ace/operations/cloud-trace',
        'courses/gcp-ace/operations/error-reporting',
        'courses/gcp-ace/operations/cloud-debugger',
        'courses/gcp-ace/operations/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 8: Security Best Practices',
      items: [
        'courses/gcp-ace/security/overview',
        'courses/gcp-ace/security/encryption',
        'courses/gcp-ace/security/secret-manager',
        'courses/gcp-ace/security/cloud-armor',
        'courses/gcp-ace/security/binary-authorization',
        'courses/gcp-ace/security/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 9: Deployment & CI/CD',
      items: [
        'courses/gcp-ace/deployment/overview',
        'courses/gcp-ace/deployment/cloud-build',
        'courses/gcp-ace/deployment/deployment-manager',
        'courses/gcp-ace/deployment/terraform-basics',
        'courses/gcp-ace/deployment/cloud-source-repos',
        'courses/gcp-ace/deployment/practice',
      ],
    },
    {
      type: 'category',
      label: 'Practice Exams',
      items: [
        'courses/gcp-ace/practice-exams/full-length-exam-1',
        'courses/gcp-ace/practice-exams/full-length-exam-2',
        'courses/gcp-ace/practice-exams/exam-1-answers',
        'courses/gcp-ace/practice-exams/exam-2-answers',
      ],
    },
  ],

  // PostgreSQL Advanced Course Sidebar
  postgresAdvancedSidebar: [
    {
      type: 'doc',
      id: 'courses/postgres-advanced/intro',
      label: 'Course Introduction',
    },
    {
      type: 'category',
      label: 'Module 1: PostgreSQL Internals',
      items: [
        'courses/postgres-advanced/module-01-internals/intro',
        'courses/postgres-advanced/module-01-internals/mvcc-architecture',
        'courses/postgres-advanced/module-01-internals/wal-checkpointing',
        'courses/postgres-advanced/module-01-internals/buffer-cache',
        'courses/postgres-advanced/module-01-internals/background-processes',
        'courses/postgres-advanced/module-01-internals/vacuum-autovacuum',
        'courses/postgres-advanced/module-01-internals/disk-storage',
        'courses/postgres-advanced/module-01-internals/crash-recovery',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Query Planner & Performance Tuning',
      items: [
        'courses/postgres-advanced/module-02-planner/intro',
        'courses/postgres-advanced/module-02-planner/planner-basics',
        'courses/postgres-advanced/module-02-planner/explain-plans',
        'courses/postgres-advanced/module-02-planner/index-types',
        'courses/postgres-advanced/module-02-planner/statistics-analyze',
        'courses/postgres-advanced/module-02-planner/slow-queries',
        'courses/postgres-advanced/module-02-planner/anti-patterns',
        'courses/postgres-advanced/module-02-planner/tuning-techniques',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Concurrency, Locks & Transactions',
      items: [
        'courses/postgres-advanced/module-03-transactions/intro',
        'courses/postgres-advanced/module-03-transactions/lock-manager',
        'courses/postgres-advanced/module-03-transactions/row-locking',
        'courses/postgres-advanced/module-03-transactions/deadlocks',
        'courses/postgres-advanced/module-03-transactions/isolation-levels',
        'courses/postgres-advanced/module-03-transactions/lock-debugging',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Scaling PostgreSQL',
      items: [
        'courses/postgres-advanced/module-04-scaling/intro',
        'courses/postgres-advanced/module-04-scaling/scaling-strategies',
        'courses/postgres-advanced/module-04-scaling/streaming-replication',
        'courses/postgres-advanced/module-04-scaling/logical-replication',
        'courses/postgres-advanced/module-04-scaling/partitioning',
        'courses/postgres-advanced/module-04-scaling/sharding',
        'courses/postgres-advanced/module-04-scaling/connection-pooling',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: High Availability & Disaster Recovery',
      items: [
        'courses/postgres-advanced/module-05-ha-dr/intro',
        'courses/postgres-advanced/module-05-ha-dr/ha-architectures',
        'courses/postgres-advanced/module-05-ha-dr/replication-setup',
        'courses/postgres-advanced/module-05-ha-dr/patroni',
        'courses/postgres-advanced/module-05-ha-dr/backups',
        'courses/postgres-advanced/module-05-ha-dr/disaster-recovery',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Production Tuning & Configuration',
      items: [
        'courses/postgres-advanced/module-06-tuning/intro',
        'courses/postgres-advanced/module-06-tuning/config-basics',
        'courses/postgres-advanced/module-06-tuning/memory-tuning',
        'courses/postgres-advanced/module-06-tuning/io-tuning',
        'courses/postgres-advanced/module-06-tuning/cpu-tuning',
        'courses/postgres-advanced/module-06-tuning/os-tuning',
      ],
    },
    {
      type: 'category',
      label: 'Module 7: Monitoring, Troubleshooting & Observability',
      items: [
        'courses/postgres-advanced/module-07-monitoring/intro',
        'courses/postgres-advanced/module-07-monitoring/key-metrics',
        'courses/postgres-advanced/module-07-monitoring/pg-stat-views',
        'courses/postgres-advanced/module-07-monitoring/prometheus',
        'courses/postgres-advanced/module-07-monitoring/log-analysis',
        'courses/postgres-advanced/module-07-monitoring/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Module 8: PostgreSQL at Massive Scale',
      items: [
        'courses/postgres-advanced/module-08-high-scale/intro',
        'courses/postgres-advanced/module-08-high-scale/designing-scale',
        'courses/postgres-advanced/module-08-high-scale/hot-cold-data',
        'courses/postgres-advanced/module-08-high-scale/bloat-management',
        'courses/postgres-advanced/module-08-high-scale/partition-management',
        'courses/postgres-advanced/module-08-high-scale/high-concurrency',
      ],
    },
  ],
  linuxAdvancedSidebar: [
    {
      type: 'doc',
      id: 'courses/linux-advanced/intro',
      label: 'Course Introduction',
    },
    {
      type: 'category',
      label: 'Module 1: Linux Architecture & Internals',
      items: [
        'courses/linux-advanced/module-01-architecture/architecture-overview',
        'courses/linux-advanced/module-01-architecture/syscalls-process',
        'courses/linux-advanced/module-01-architecture/boot-systemd',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Process, CPU & Scheduling Internals',
      items: [
        'courses/linux-advanced/module-02-cpu/process-model',
        'courses/linux-advanced/module-02-cpu/cpu-scheduler',
        'courses/linux-advanced/module-02-cpu/cpu-troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Memory Management & Tuning',
      items: [
        'courses/linux-advanced/module-03-memory/virtual-memory',
        'courses/linux-advanced/module-03-memory/oom-swap',
        'courses/linux-advanced/module-03-memory/memory-diagnostics',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Storage & Filesystem Internals',
      items: [
        'courses/linux-advanced/module-04-storage/io-stack',
        'courses/linux-advanced/module-04-storage/filesystems',
        'courses/linux-advanced/module-04-storage/io-troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Networking Internals',
      items: [
        'courses/linux-advanced/module-05-networking/network-stack',
        'courses/linux-advanced/module-05-networking/packet-flow',
        'courses/linux-advanced/module-05-networking/network-troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Linux Containers & Namespaces',
      items: [
        'courses/linux-advanced/module-06-containers/namespaces-cgroups',
        'courses/linux-advanced/module-06-containers/container-runtime',
        'courses/linux-advanced/module-06-containers/resource-isolation',
      ],
    },
    {
      type: 'category',
      label: 'Module 7: Systemd & Service Management',
      items: [
        'courses/linux-advanced/module-07-systemd/systemd-architecture',
        'courses/linux-advanced/module-07-systemd/unit-files',
        'courses/linux-advanced/module-07-systemd/boot-debugging',
      ],
    },
    {
      type: 'category',
      label: 'Module 8: Observability & Troubleshooting',
      items: [
        'courses/linux-advanced/module-08-observability/incident-response',
        'courses/linux-advanced/module-08-observability/log-analysis',
        'courses/linux-advanced/module-08-observability/troubleshooting-playbooks',
      ],
    },
    {
      type: 'category',
      label: 'Module 9: Performance Optimization & Hardening',
      items: [
        'courses/linux-advanced/module-09-performance/system-tuning',
        'courses/linux-advanced/module-09-performance/kernel-parameters',
        'courses/linux-advanced/module-09-performance/security-hardening',
      ],
    },
    {
      type: 'category',
      label: 'Module 10: Production Failure Scenarios',
      items: [
        'courses/linux-advanced/module-10-failures/kernel-panic',
        'courses/linux-advanced/module-10-failures/oom-storms',
        'courses/linux-advanced/module-10-failures/io-network-failures',
      ],
    },
  ],
};

module.exports = sidebars;
