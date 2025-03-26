import { PLUGIN_NAME } from '../constants';
import { Strapi } from '@strapi/strapi';


const getConfig = async () => {

  if (!Strapi || !Strapi.config) {
    throw new Error('strapi.config is not defined');
  }

  return await Strapi.config.get(`plugin::${PLUGIN_NAME}`);
};

export { getConfig };
