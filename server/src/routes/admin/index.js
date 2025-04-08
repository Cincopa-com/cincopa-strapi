const routes = [
    {
        method: 'GET',
        path: '/config',
        handler: 'pluginConfigs.configs',
        config: {
            policies: [],
            auth:false
        }
    }
];
export default routes;