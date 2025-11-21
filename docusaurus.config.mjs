// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion.

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Google Cloud Associate Cloud Engineer (ACE) Certification Course',
  tagline: 'Complete self-study course for the ACE certification exam',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://shivam2003-dev.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages, it is often '/<REPO_NAME>/'
  baseUrl: '/gcp_cert_exam/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'shivam2003-dev', // Usually your GitHub org/user name.
  projectName: 'gcp_cert_exam', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to set "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/shivam2003-dev/gcp_cert_exam/tree/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'GCP ACE Course',
        logo: {
          alt: 'Google Cloud Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Course Home',
          },
          {
            href: 'https://cloud.google.com/certification/cloud-engineer',
            label: 'Official Exam Guide',
            position: 'right',
          },
          {
            href: 'https://github.com/shivam2003-dev/gcp_cert_exam',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Course',
            items: [
              {
                label: 'Course Overview',
                to: '/',
              },
              {
                label: 'Exam Strategy',
                to: '/00-introduction/exam-strategy',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Official ACE Exam Guide',
                href: 'https://cloud.google.com/certification/cloud-engineer',
              },
              {
                label: 'Google Cloud Documentation',
                href: 'https://cloud.google.com/docs',
              },
              {
                label: 'Google Cloud Free Tier',
                href: 'https://cloud.google.com/free',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/shivam2003-dev/gcp_cert_exam',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} GCP ACE Certification Course. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'yaml', 'json'],
      },
    }),
};

module.exports = config;

