import { PLUGIN_NAME } from './constants/index';

const bootstrap = async ({ strapi }) => {
  // Set CSP for the plugin’s admin page
  strapi.server.use(async (ctx, next) => {
    await next();

    if (
      ctx.request.url.startsWith(`/admin/plugins/${PLUGIN_NAME}`) &&
      ctx.response.is('html')
    ) {
      ctx.set('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cincopa.com fonts.gstatic.com data:",
        "style-src 'self' 'unsafe-inline' *.cincopa.com fonts.googleapis.com",
        "img-src 'self' data: blob: *.cincopa.com fonts.gstatic.com",
        "font-src 'self' fonts.gstatic.com *.cincopa.com data:",
        "media-src 'self' blob: *.cincopa.com",
        "connect-src 'self' *.cincopa.com http: https: ws: data: blob:",
        "worker-src 'self' blob:",
      ].join('; '));
    }
  });


  if (Object.keys(strapi.plugins).indexOf('users-permissions') === -1) {
    throw new Error('The users-permissions plugin is required in order to use the Mux Video Uploader');
  }

  // Define custom permission actions for your plugin.
  // Using uid "find" instead of "read" aligns with Strapi’s default for collection types.
  const actions = [
    // Core API actions
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read', 
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Create',
      uid: 'create',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Update',
      uid: 'update',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Delete',
      uid: 'delete',
      pluginName: PLUGIN_NAME,
    },
    // Settings-related actions
    {
      section: 'plugins',
      displayName: 'Read Settings',
      subCategory: 'settings',
      uid: 'settings.read',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Update Settings',
      subCategory: 'settings',
      uid: 'settings.update',
      pluginName: PLUGIN_NAME,
    },
  ];

  try {
    await strapi.admin.services.permission.actionProvider.registerMany(actions);
    strapi.log.info(`[${PLUGIN_NAME}] Plugin permissions registered`);
  } catch (error) {
    strapi.log.error(`[${PLUGIN_NAME}] Error registering permissions:`, error);
  }
};

export default bootstrap;
