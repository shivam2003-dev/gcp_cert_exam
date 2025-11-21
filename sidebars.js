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
        'courses/gcp-ace/00-introduction/course-overview',
        'courses/gcp-ace/00-introduction/exam-strategy',
        'courses/gcp-ace/00-introduction/learning-path',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: Setting Up Cloud Solution Environment',
      items: [
        'courses/gcp-ace/01-setup/overview',
        'courses/gcp-ace/01-setup/projects-billing',
        'courses/gcp-ace/01-setup/apis-services',
        'courses/gcp-ace/01-setup/gcloud-sdk',
        'courses/gcp-ace/01-setup/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Identity & Access Management (IAM)',
      items: [
        'courses/gcp-ace/02-iam/overview',
        'courses/gcp-ace/02-iam/iam-fundamentals',
        'courses/gcp-ace/02-iam/service-accounts',
        'courses/gcp-ace/02-iam/iam-roles-policies',
        'courses/gcp-ace/02-iam/organization-policies',
        'courses/gcp-ace/02-iam/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Networking Fundamentals',
      items: [
        'courses/gcp-ace/03-networking/overview',
        'courses/gcp-ace/03-networking/vpc-fundamentals',
        'courses/gcp-ace/03-networking/firewall-rules',
        'courses/gcp-ace/03-networking/load-balancing',
        'courses/gcp-ace/03-networking/cloud-dns',
        'courses/gcp-ace/03-networking/cloud-cdn',
        'courses/gcp-ace/03-networking/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Compute Services',
      items: [
        'courses/gcp-ace/04-compute/overview',
        'courses/gcp-ace/04-compute/compute-engine',
        'courses/gcp-ace/04-compute/gke-basics',
        'courses/gcp-ace/04-compute/cloud-run',
        'courses/gcp-ace/04-compute/app-engine',
        'courses/gcp-ace/04-compute/cloud-functions',
        'courses/gcp-ace/04-compute/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Storage Services',
      items: [
        'courses/gcp-ace/05-storage/overview',
        'courses/gcp-ace/05-storage/cloud-storage',
        'courses/gcp-ace/05-storage/persistent-disks',
        'courses/gcp-ace/05-storage/cloud-sql',
        'courses/gcp-ace/05-storage/cloud-spanner',
        'courses/gcp-ace/05-storage/firestore',
        'courses/gcp-ace/05-storage/bigtable',
        'courses/gcp-ace/05-storage/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Managed Services & Databases',
      items: [
        'courses/gcp-ace/06-managed-services/overview',
        'courses/gcp-ace/06-managed-services/bigquery',
        'courses/gcp-ace/06-managed-services/pub-sub',
        'courses/gcp-ace/06-managed-services/cloud-endpoints',
        'courses/gcp-ace/06-managed-services/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 7: Monitoring, Logging & Operations',
      items: [
        'courses/gcp-ace/07-operations/overview',
        'courses/gcp-ace/07-operations/cloud-monitoring',
        'courses/gcp-ace/07-operations/cloud-logging',
        'courses/gcp-ace/07-operations/cloud-trace',
        'courses/gcp-ace/07-operations/error-reporting',
        'courses/gcp-ace/07-operations/cloud-debugger',
        'courses/gcp-ace/07-operations/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 8: Security Best Practices',
      items: [
        'courses/gcp-ace/08-security/overview',
        'courses/gcp-ace/08-security/encryption',
        'courses/gcp-ace/08-security/secret-manager',
        'courses/gcp-ace/08-security/cloud-armor',
        'courses/gcp-ace/08-security/binary-authorization',
        'courses/gcp-ace/08-security/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 9: Deployment & CI/CD',
      items: [
        'courses/gcp-ace/09-deployment/overview',
        'courses/gcp-ace/09-deployment/cloud-build',
        'courses/gcp-ace/09-deployment/deployment-manager',
        'courses/gcp-ace/09-deployment/terraform-basics',
        'courses/gcp-ace/09-deployment/cloud-source-repos',
        'courses/gcp-ace/09-deployment/practice',
      ],
    },
    {
      type: 'category',
      label: 'Practice Exams',
      items: [
        'courses/gcp-ace/10-practice-exams/full-length-exam-1',
        'courses/gcp-ace/10-practice-exams/full-length-exam-2',
        'courses/gcp-ace/10-practice-exams/exam-1-answers',
        'courses/gcp-ace/10-practice-exams/exam-2-answers',
      ],
    },
  ],
};

module.exports = sidebars;
