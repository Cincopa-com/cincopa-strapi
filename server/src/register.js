import adminRoutes from './routes/admin';  // Import the admin routes
import { PLUGIN_NAME } from './constants';
const register = ({ strapi }) => {
  strapi.log.info('✅ Plugin loaded, registering routes');
  let allRoutes = [...adminRoutes]
  allRoutes.forEach((route) => {
    strapi.log.info(`Registering route: ${route.method} ${route.path}`);
    const [controllerName, actionName] = route.handler.split('.');

    const handlerFn = strapi.plugin(PLUGIN_NAME).controller(controllerName)[actionName];
    if (!handlerFn) {
      strapi.log.error(`❌ Handler not found: ${route.handler}`);
    }

    strapi.server.routes([
      {
        ...route,
        handler: handlerFn,
        path: `/admin/plugins/${PLUGIN_NAME}${route.path}`,
      },
    ]);
  });
};

export default register;
