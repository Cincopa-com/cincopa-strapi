
const routes =  [
  {
    method: 'GET',
    path: '/asset',
    handler: 'cincopa-asset.find',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: `/asset/:assetrid`,
    handler: 'cincopa-asset.findOne',
    config: {
      policies: [],
      auth: false
    },
  },
];

export default routes;