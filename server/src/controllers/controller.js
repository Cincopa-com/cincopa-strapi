const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('cincopa-uploader-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  configs(ctx) {
    console.log('called configs');
    ctx.body = strapi.plugin('cincopa-uploader-plugin').service('cincopa-services').getConfigs();
  },
});

export default controller;
