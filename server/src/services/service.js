const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  getCincopaToken() {
    return 'Gettt token';
  },
});

export default service;
