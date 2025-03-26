const routes = [
  {
    method: 'GET',
    path: '/',
    handler: 'cincopa-settings.getToken',
    config: {
      policies: [],
      prefix: false,
    },
  },
];

export default routes;
