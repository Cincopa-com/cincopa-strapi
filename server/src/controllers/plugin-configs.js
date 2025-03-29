import { PLUGIN_NAME } from '../constants';

const pluginConfigs = ({ strapi }) => ({
  configs(ctx) {
    ctx.body = strapi.plugin(PLUGIN_NAME).service('configs').getConfigsData();
  }
});

export default pluginConfigs;
