import { PLUGIN_NAME } from '../constants/';
import * as Config from './config.js';

const getService = (name) => {
  return strapi.plugin(PLUGIN_NAME).service(name);
};

export { getService, Config };
