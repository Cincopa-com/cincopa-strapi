module.exports = ({ strapi }) => ({
    getWelcomeMessage() {
        return 'Welcome to Strapisss 🚀';
    },

    getConfigs() {
        return strapi.config.get('plugin.cincopa-uploader-plugin');
    },
});
