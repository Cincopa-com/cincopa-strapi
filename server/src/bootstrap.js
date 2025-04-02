import { PLUGIN_NAME } from "./constants";

const bootstrap = async ({ strapi }) => {
  // 1. CSP Middleware (only on plugin routes)
  const cspMiddleware = async (ctx, next) => {
    await next(); // Always allow other middleware first

    // Apply CSP only to plugin routes
    if (ctx.request.url.startsWith('/cincopa-uploader')) {
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
  };

  strapi.server.use(cspMiddleware);

  // 2. Register permission actions (find / findOne) without enabling
  const permissionsToRegister = [
    {
      section: 'plugins',
      displayName: 'Find',
      uid: 'find',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Find One',
      uid: 'findOne',
      pluginName: PLUGIN_NAME,
    },
  ];

  const actionService = strapi
    .plugin('users-permissions')
    .service('action');

  for (const permission of permissionsToRegister) {
    const exists = await actionService.get({
      plugin: permission.pluginName,
      uid: permission.uid,
    });

    if (!exists) {
      await actionService.create(permission);
      strapi.log.info(`[cincopa-uploader] Registered permission: ${permission.uid}`);
    }
  }
};

export default bootstrap;
