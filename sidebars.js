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
};

module.exports = sidebars;
