export default [
  {
    method: "POST",
    path: "/webhook",  // This is the webhook URL
    handler: "webhook.handleWebhook",  // This will reference the method in your controller
    config: {
      auth: false,  // Set to true if you want to enforce authentication
      policies: [],
    },
  },
];
