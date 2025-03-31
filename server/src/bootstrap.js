const bootstrap = ({ strapi }) => {
  const cspMiddleware = async (ctx, next) => {
    ctx.set('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cincopa.com fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' *.cincopa.com fonts.googleapis.com",
      "img-src 'self' data: blob: *.cincopa.com fonts.gstatic.com",
      "font-src 'self' fonts.gstatic.com *.cincopa.com  data:", // <- wildcard at end if needed
      "media-src 'self' blob: *.cincopa.com",
      "connect-src 'self' *.cincopa.com http: https: ws: data: blob:",
      "worker-src 'self' blob:",
    ].join('; '));
    await next();
  };

  strapi.server.use(cspMiddleware);
};

export default bootstrap;