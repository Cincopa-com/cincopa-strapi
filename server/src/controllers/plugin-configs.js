import { PLUGIN_NAME } from '../constants';
import {createSelfGeneratedTempTokenV3getTempAPIKeyV2} from '../utils/encrypter'
export default {
  async configs(ctx) {
    const configService = strapi.plugin(PLUGIN_NAME).service('configs');
    const configData = await configService.getConfigsData();
    const { apiToken } = configData;
    const expire = new Date(Date.now() + 10 * 60 * 1000);
    let tempToken;
    const ip = getIPv4(ctx?.request?.ip);
    if(apiToken){
      tempToken = createSelfGeneratedTempTokenV3getTempAPIKeyV2(
        apiToken,
        expire,
        null,
        null,
        null,
        (ip && ip != '127.0.0.1') ? ip: null
      );
    }
    // Attach whichever token we ended up with
    ctx.body = {
      ...configData,
      apiToken: tempToken,
    };
    function getIPv4(ctx) {
      const ip = ctx?.request?.ip;
      if (!ip) return false;
      // Handle IPv4-mapped IPv6 format, e.g. ::ffff:192.168.0.1
      const ipv4Mapped = ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;
      // Regex to validate IPv4
      const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
      return ipv4Regex.test(ipv4Mapped) ? ipv4Mapped : false;
    }
  },
  
};