const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('cincopa-uploader-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  }
});

export default controller;
