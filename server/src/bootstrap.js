import { PLUGIN_NAME } from './constants/index';

const bootstrap = async ({ strapi }) => {
  strapi.server.use(async (ctx, next) => {
    await next();

    // Only apply CSP on your plugin's admin page
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


  const actions = [
    // App
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
    // Settings
    {
      section: 'plugins',
      displayName: 'Read',
      subCategory: 'settings',
      uid: 'settings.read',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Update',
      subCategory: 'settings',
      uid: 'settings.update',
      pluginName: PLUGIN_NAME,
    },
  ];

  // Commented out as this was causing issues in clustered instances of Strapi
  // Issue was due to multiple instances of the plugin stampeding Mux's API
  // rate limits.  Future work would include a manual invocation from the
  // plugin's settings page.
  // sync();

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default bootstrap;
