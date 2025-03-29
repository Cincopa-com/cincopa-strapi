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
}
];
