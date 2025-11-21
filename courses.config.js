/**
 * Course Configuration
 * Add new courses here to make them available on the site
 */

const courses = [
  {
    id: 'gcp-ace',
    name: 'Google Cloud Associate Cloud Engineer (ACE)',
    shortName: 'GCP ACE',
    description: 'Complete self-study course for the Google Cloud Associate Cloud Engineer certification exam',
    icon: '☁️',
    color: '#4285f4',
    path: 'courses/gcp-ace',
    examGuideUrl: 'https://cloud.google.com/certification/cloud-engineer',
    officialDocsUrl: 'https://cloud.google.com/docs',
    duration: '4-6 weeks',
    level: 'Associate',
    category: 'Cloud Certification',
  },
  {
    id: 'postgres-advanced',
    name: 'Advanced PostgreSQL: Internals, Performance, Scaling & Production Troubleshooting',
    shortName: 'PostgreSQL Advanced',
    description: 'Master PostgreSQL internals, performance tuning, scaling, and real-world production operations.',
    icon: '🐘',
    color: '#336791',
    path: 'courses/postgres-advanced',
    duration: '8-12 weeks',
    level: 'Advanced',
    category: 'Database Engineering',
  },
  {
    id: 'linux-advanced',
    name: 'Advanced Linux Engineering: Internals, Performance & Production Troubleshooting',
    shortName: 'Linux Advanced',
    description: 'Deep-dive Linux course covering kernel internals, performance tuning, observability, and failure recovery for production systems.',
    icon: '🐧',
    color: '#111111',
    path: 'courses/linux-advanced',
    duration: '8-12 weeks',
    level: 'Advanced',
    category: 'Systems Engineering',
  },
  // Add more courses here as needed
];

module.exports = courses;

