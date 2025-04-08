import { PLUGIN_NAME } from '../constants';

export default {
  async configs(ctx) {
    console.log('🔥 pluginConfigs.configs called');
    ctx.body = await strapi.plugin(PLUGIN_NAME).service('configs').getConfigsData();
  }
}
