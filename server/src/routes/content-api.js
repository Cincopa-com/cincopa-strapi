
export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/get-configs',
    handler: 'pluginConfigs.configs',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/asset',
    handler: 'cincopaAsset.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: `/asset/:assetrid`,
    handler: 'cincopaAsset.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
];
