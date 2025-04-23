import { PLUGIN_NAME } from './constants/index';
const register = ({ strapi }) => {
    strapi.log.info(`[${PLUGIN_NAME}] REGISTER WEBWHOOKS IN CINCOPA TO GET MOST ADVANTAGE`);

    /* set corrrect CSP in registration to fix issue not loading CSP on first time */
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
};

export default register;
