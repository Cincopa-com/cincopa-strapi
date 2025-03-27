import { Config } from '../utils/config';

export default {
  default: {
    apiToken: '',
  },
  validator(config) {
    const missingConfigs = [];

    if (!config.apiToken) {
      missingConfigs.push('apiToken');
    }

    if (missingConfigs.length > 0) {
      throw new Error(
        `Please remember to set up the file based config for your plugin.  Configs missing: ${missingConfigs.join(', ')}`
      );
    }
  },
};
