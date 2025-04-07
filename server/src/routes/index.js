import contentAPIRoutes from './content-api';
import webhookRoutes from './webhook';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  'cincopa-uploader': {
    type: 'content-api',
    routes: webhookRoutes,
  },
};

export default routes;

