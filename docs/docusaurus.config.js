// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Netgrif Academy',
    tagline: 'For faster and better app development',
    url: 'https://academy.netgrif.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    // GitHub pages deployment config.
    organizationName: 'netgrif', // Usually your GitHub org/user name.
    projectName: 'academy', // Usually your repo name.
    deploymentBranch: 'deployment',

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
                },
                blog: {
                    showReadingTime: true,
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Netgrif Academy',
                logo: {
                    alt: 'Netgrif Logo',
                    src: 'img/logo.png',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorials',
                        position: 'left',
                        label: 'Tutorial',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'examples',
                        position: 'left',
                        label: 'Examples',
                    },
                    // {to: '/blog', label: 'Blog', position: 'left'},
                    // {
                    //     href: 'https://github.com/facebook/docusaurus',
                    //     label: 'GitHub',
                    //     position: 'right',
                    // },
                    {
                        type: 'search',
                        position: 'right',
                    },
                    {
                        label: 'Try Engine',
                        href: 'https://demo.netgrif.com/',
                        position: "right",
                        target: "_blank"
                    },
                    {
                        label: 'Try Builder',
                        href: 'https://builder.netgrif.com',
                        position: "right",
                        target: "_blank"
                    },
                    {
                        href: 'https://github.com/netgrif/academy',
                        position: 'right',
                        className: 'header-github-link',
                        'aria-label': 'GitHub repository',
                        target: '_blank'
                    }
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Documents',
                        items: [
                            {
                                label: 'Tutorials',
                                to: '/docs/intro',
                            },
                            {
                                label: 'Examples',
                                to: '/docs/intro'
                            }
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Stack Overflow',
                                href: 'https://stackoverflow.com/questions/tagged/petri-net+application-server',
                            },
                            {
                                label: 'LinkedIn',
                                href: 'https://ae.linkedin.com/company/netgrif',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/netgrif',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            // {
                            //     label: 'Blog',
                            //     to: '/blog',
                            // },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/netgrif/academy',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Netgrif, s.r.o. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
