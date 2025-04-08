import { PLUGIN_NAME } from "../constants";
module.exports = async ({ strapi }) => {
  const config = strapi.config.get('plugin::PLUGIN_NAME');
  const token = config.apiToken;
};
