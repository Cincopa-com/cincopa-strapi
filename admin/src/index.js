// import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Cincopa Assets Uploader',
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.createSettingSection(
      {
        id: 'cincopa-uploader',
        intlLabel: {
          id: 'cincopa-uploader-plugin.settings.label',
          defaultMessage: 'Cincopa Uploader',
        },
      },
      [
        {
          id: 'cincopa-uploader-settings',
          intlLabel: {
            id: 'cincopa-uploader-plugin.settings.page.label',
            defaultMessage: 'Configuration',
          },
          to: '/settings/cincopa-uploader',
          Component: async () => import('../src/pages/CincopaSettings'),
        },
      ]
    );


    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    const script = document.createElement("script");
    script.src = "https://wwwcdn.cincopa.com/_cms/ugc/uploaderui.js";
    script.async = true;
    document.body.appendChild(script);

    const cincopaScript = document.createElement("script");
    cincopaScript.src = "//wwwcdn.cincopa.com/_cms/media-platform/libasync.js";
    cincopaScript.async = true;
    document.body.appendChild(cincopaScript);
    script.onload = () => {
      // console.log(cpUploadUI, 'cpUploadUI');
    }
    console.log(app)
    const pluginConfig = app.getPlugin('cincopa-uploader-plugin')?.config;
    console.log('Plugin token from backend:', pluginConfig);
  },

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
