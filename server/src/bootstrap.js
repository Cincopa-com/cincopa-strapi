const bootstrap = async ({ strapi }) => {
  // Custom middleware for Admin plugin route only
  strapi.server.routes.use(async (ctx, next) => {
    await next();

    // Apply CSP only to the HTML-rendered Admin page for your plugin
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
