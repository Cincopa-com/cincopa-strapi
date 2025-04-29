const routes = [
    {
        method: 'GET',
        path: '/cincopa-settings',
        handler: 'cincopa-settings.configs',
        config: {
            policies: [], 
            auth: {enabled:true}
        }
    }
];
export default routes;