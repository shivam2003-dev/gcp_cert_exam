// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion.

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
const courses = require('./courses.config');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cloud Certification Courses',
  tagline: 'Complete self-study courses for cloud certifications',
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
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          homePageId: 'intro',
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
        title: 'Cloud Cert Courses',
        logo: {
          alt: 'Cloud Certification Logo',
          src: 'img/logo.svg',
          href: '/intro',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'coursesSidebar',
            position: 'left',
            label: 'All Courses',
          },
          {
            type: 'dropdown',
            label: 'Courses',
            position: 'left',
            items: courses.map((course) => ({
              label: course.shortName,
              to: `/${course.path}/intro`,
            })),
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
            title: 'Courses',
            items: courses.map((course) => ({
              label: course.name,
              to: `/${course.path}/intro`,
            })),
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Google Cloud Certifications',
                href: 'https://cloud.google.com/certification',
              },
              {
                label: 'AWS Certifications',
                href: 'https://aws.amazon.com/certification/',
              },
              {
                label: 'Azure Certifications',
                href: 'https://learn.microsoft.com/certifications/',
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
        copyright: `Copyright © ${new Date().getFullYear()} Cloud Certification Courses. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'yaml', 'json'],
      },
    }),
};

module.exports = config;
