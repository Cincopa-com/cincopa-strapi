module.exports = (strapi) => {
  return async (ctx, next) => {
    // Set the Content-Security-Policy header for this plugin
    ctx.set('Content-Security-Policy', "default-src 'self' *; script-src 'self' 'unsafe-inline' *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: *");

    // Call the next middleware
    await next();
  };
};
