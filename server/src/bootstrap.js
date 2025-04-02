const bootstrap = async ({ strapi }) => {
  strapi.server.use(async (ctx, next) => {
    await next();

    // Only apply CSP on your plugin's admin page
    if (
      ctx.request.url.startsWith('/admin/plugins/cincopa-uploader') &&
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
};

export default bootstrap;
