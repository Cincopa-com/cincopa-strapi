import { PLUGIN_NAME,SINGULAR_NAME } from '../../server/src/constants/index';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { apiAssetDelete } from '../src/constants/index';
import pluginPermissions from './permissions';

import { getFetchClient } from '@strapi/strapi/admin';

export default {
  register(app) {

    app.registerPlugin({
      id: PLUGIN_NAME,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_NAME,
    });


    app.addMenuLink({
      to: `plugins/${PLUGIN_NAME}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_NAME}.plugin.name`,
        defaultMessage: 'Cincopa Assets Uploader',
      },
      permissions: [pluginPermissions.mainRead],
      Component: async () => {
         const { App } = await import('./pages/App');
         return App;
      },
    });
   
  },
  bootstrap(app) {
    const client = getFetchClient();
    app.getPlugin('content-manager').apis.addDocumentAction([
      ({ collectionType, document, model }) => {

        if (model !== `plugin::${PLUGIN_NAME}.${SINGULAR_NAME}`) return null;
        return {
          label: 'Delete from Cincopa',
          position: 'table-row',
          variant: 'danger',
          onClick: async () => {},
          dialog: {
            type: 'dialog',
            title: 'Confirm Delete',
            content:'Are you sure you want to delete this asset from Cincopa? This action is irreversible.',
            onConfirm: async () => {
              let assetRid = document?.asset_rid;
              if (!assetRid) {
                return;
              }
              const { apiToken }  = await getConfigs();
              try {
                const response = await fetch(`${apiAssetDelete}?api_token=${apiToken}&rid=${assetRid}`);
                if (!response.ok) {
                  throw new Error('Failed to fetch data');
                }
                await response.json();
                app.getPlugin("content-manager").apis.reload();
              } catch (err) {
                console.log(err, 'Error');
              }
            }
          },
        };
      },
    ]);


    const getConfigs = async () => {
      try {
        const { data } = await client.get('/cincopa-uploader/cincopa-settings');
        return data;
      } catch (error) {
        console.error('Error fetching configs:', error);
        return null;
      }
    };

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
