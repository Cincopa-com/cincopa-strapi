import permissions from './permissions.js';
const register = ({ strapi }) => {
  strapi.container.get('admin.permissions').registerMany(permissions);
};

export default register;