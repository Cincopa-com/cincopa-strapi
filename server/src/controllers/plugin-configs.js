import { PLUGIN_NAME } from '../constants';

export default {
  async configs(ctx) {
    // Fetch your saved config
    const configService = strapi.plugin(PLUGIN_NAME).service('configs');
    const configData = await configService.getConfigsData();
    const { apiToken } = configData;
 
    const ip = getIPv4(ctx?.request?.ip);
    // Default token if everything fails
    let finalToken = 'no_token';

    try {
      // Try to get a temporary token
      const res = await fetch(
        `https://api.cincopa.com/v2/token.get_temp.json?api_token=${apiToken}&ttl=600&${ip && ip != '127.0.0.1' ? 'sourceip='+ip: ''}`
      );

      if (!res.ok) {
        strapi.log.warn(
          `[${PLUGIN_NAME}] temp-token request failed with status ${res.status}`
        );
        throw new Error('Non-2xx response');
      }

      const { success, token: tempToken, message } = await res.json();

      if (!success) {
        strapi.log.info(
          `[${PLUGIN_NAME}] temp-token API responded with success=false: ${message}`
        );
        throw new Error('API indicated failure');
      }

      // All good—use the temp token
      finalToken = tempToken;
    } catch (err) {
      // Any error—use the main token instead
      strapi.log.info(
        `[${PLUGIN_NAME}] Can not get temp API token due to: ${err.message}`
      );
    }

    // Attach whichever token we ended up with
    ctx.body = {
      ...configData,
      apiToken: finalToken,
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
