import { PLUGIN_NAME } from '../constants';

const service = ({ strapi }) => ({
  getConfigsData() {
    return strapi.config.get(`plugin::${PLUGIN_NAME}`);
  },
});

export default service;
