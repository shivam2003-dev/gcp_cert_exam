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
  // Add more courses here as needed
  // Example:
  // {
  //   id: 'aws-saa',
  //   name: 'AWS Solutions Architect Associate',
  //   shortName: 'AWS SAA',
  //   description: 'Complete course for AWS Solutions Architect Associate certification',
  //   icon: '🚀',
  //   color: '#FF9900',
  //   path: 'courses/aws-saa',
  //   examGuideUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
  //   officialDocsUrl: 'https://docs.aws.amazon.com/',
  //   duration: '6-8 weeks',
  //   level: 'Associate',
  //   category: 'Cloud Certification',
  // },
];

module.exports = courses;

