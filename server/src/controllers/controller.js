import { PLUGIN_NAME } from "../constants";
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(PLUGIN_NAME)
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  }
});

export default controller;
