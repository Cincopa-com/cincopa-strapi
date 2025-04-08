import contentAPIRoutes from './content-api';
import adminRoutes from './admin';
import webhookRoutes from './webhook';
import { PLUGIN_NAME } from '../constants';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  PLUGIN_NAME: {
    type: 'content-api',
    routes: webhookRoutes,
  },
  admin: {
    type: 'admin',
    routes: adminRoutes,
  },
};

export default routes;

