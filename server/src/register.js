const register = ({ strapi }) => {
  const pluginToken = strapi.config.get('plugin.cincopa-uploader-plugin');

  strapi.plugin('cincopa-uploader-plugin').config = {
    pluginToken,
  };
};

export default register;
