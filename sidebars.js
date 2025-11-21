/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Course Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        '00-introduction/course-overview',
        '00-introduction/exam-strategy',
        '00-introduction/learning-path',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: Setting Up Cloud Solution Environment',
      items: [
        '01-setup/overview',
        '01-setup/projects-billing',
        '01-setup/apis-services',
        '01-setup/gcloud-sdk',
        '01-setup/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Identity & Access Management (IAM)',
      items: [
        '02-iam/overview',
        '02-iam/iam-fundamentals',
        '02-iam/service-accounts',
        '02-iam/iam-roles-policies',
        '02-iam/organization-policies',
        '02-iam/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Networking Fundamentals',
      items: [
        '03-networking/overview',
        '03-networking/vpc-fundamentals',
        '03-networking/firewall-rules',
        '03-networking/load-balancing',
        '03-networking/cloud-dns',
        '03-networking/cloud-cdn',
        '03-networking/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Compute Services',
      items: [
        '04-compute/overview',
        '04-compute/compute-engine',
        '04-compute/gke-basics',
        '04-compute/cloud-run',
        '04-compute/app-engine',
        '04-compute/cloud-functions',
        '04-compute/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Storage Services',
      items: [
        '05-storage/overview',
        '05-storage/cloud-storage',
        '05-storage/persistent-disks',
        '05-storage/cloud-sql',
        '05-storage/cloud-spanner',
        '05-storage/firestore',
        '05-storage/bigtable',
        '05-storage/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Managed Services & Databases',
      items: [
        '06-managed-services/overview',
        '06-managed-services/databases',
        '06-managed-services/bigquery',
        '06-managed-services/pub-sub',
        '06-managed-services/cloud-endpoints',
        '06-managed-services/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 7: Monitoring, Logging & Operations',
      items: [
        '07-operations/overview',
        '07-operations/cloud-monitoring',
        '07-operations/cloud-logging',
        '07-operations/cloud-trace',
        '07-operations/error-reporting',
        '07-operations/cloud-debugger',
        '07-operations/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 8: Security Best Practices',
      items: [
        '08-security/overview',
        '08-security/encryption',
        '08-security/secret-manager',
        '08-security/cloud-armor',
        '08-security/binary-authorization',
        '08-security/practice',
      ],
    },
    {
      type: 'category',
      label: 'Module 9: Deployment & CI/CD',
      items: [
        '09-deployment/overview',
        '09-deployment/cloud-build',
        '09-deployment/deployment-manager',
        '09-deployment/terraform-basics',
        '09-deployment/cloud-source-repos',
        '09-deployment/practice',
      ],
    },
    {
      type: 'category',
      label: 'Practice Exams',
      items: [
        '10-practice-exams/full-length-exam-1',
        '10-practice-exams/full-length-exam-2',
        '10-practice-exams/exam-1-answers',
        '10-practice-exams/exam-2-answers',
      ],
    },
  ],
};

module.exports = sidebars;

