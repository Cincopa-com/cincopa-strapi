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
};

export default bootstrap;
