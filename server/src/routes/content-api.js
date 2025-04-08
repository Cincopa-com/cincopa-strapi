
const routes =  [
  {
    method: 'GET',
    path: '/asset',
    handler: 'cincopaAsset.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `/asset/:assetrid`,
    handler: 'cincopaAsset.findOne',
    config: {
      policies: [],
    },
  },
];

export default routes;