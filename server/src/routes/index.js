import contentAPIRoutes from './content-api';
import webhookRoutes from './webhook';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  'cincopa-uploader': {
    type: 'content-api',  // The type should be 'plugin' for plugins
    routes: webhookRoutes,  // Add the webhook route to the plugin section
  },
};

export default routes;

