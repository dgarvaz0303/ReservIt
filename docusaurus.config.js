// @ts-check

const config = {
  title: "ReservIt",
  tagline: "Documentacion tecnica del sistema de reservas",
  favicon: "img/favicon.ico",

  url: "https://reservit.local",
  baseUrl: "/",

  organizationName: "reservit",
  projectName: "reservit",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "ReservIt Docs",
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentacion",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `ReservIt ${new Date().getFullYear()}`,
    },
    prism: {
      additionalLanguages: ["bash", "json", "python"],
    },
  },
};

module.exports = config;
