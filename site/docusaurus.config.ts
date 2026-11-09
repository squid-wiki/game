import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Squid Wiki · 游戏',
  tagline: '游戏攻略与工具 · 宝可梦火红',
  favicon: 'img/favicon.svg',

  url: 'https://game.squid.wiki',
  baseUrl: '/',
  organizationName: 'squid-wiki',
  projectName: 'game',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {defaultLocale: 'zh-Hans', locales: ['zh-Hans']},

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/squid-wiki/game/edit/main/site/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: 'Squid Wiki · 游戏',
      logo: {alt: 'Squid', src: 'img/favicon.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'main', position: 'left', label: '攻略'},
        {href: 'https://squid.wiki', label: 'squid.wiki', position: 'right'},
        {href: 'https://github.com/squid-wiki/game', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Squid Wiki',
          items: [
            {label: 'Energy · 能源', href: 'https://energy.squid.wiki'},
            {label: 'Game · 游戏', href: 'https://game.squid.wiki'},
            {label: 'Finance · 理财', href: 'https://finance.squid.wiki'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Squid Wiki · 内容采用 CC BY-NC-SA 4.0 · 非官方爱好者站点`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;
