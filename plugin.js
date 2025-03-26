module.exports = {
  register({ strapi }) {
    // Plugin setup code
    const customMiddleware = require('./config/middleware')(strapi);

    // Register the custom middleware with Strapi
    strapi.server.use(customMiddleware());
  },
  bootstrap(/* { strapi } */) {
    // Code that runs during the plugin's bootstrap process
  },
};
