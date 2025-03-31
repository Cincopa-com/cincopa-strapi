module.exports = async ({ strapi }) => {
  const config = strapi.config.get('plugin::strapi-plugin-cincopa-uploader');
  const token = config.apiToken;
};
