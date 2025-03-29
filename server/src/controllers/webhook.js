export default {
  async handleWebhook(ctx) {
    try {
      console.log("Webhook received:", ctx.request.body);
      ctx.body = { message: "Webhook received successfully2", data: ctx.request};

      // try {
      //   const newItem = await strapi.db.create('api::cincopa-asset.cincopa-asset', {
      //     data: {
      //       title: 'New Article Created via Webhook',
      //       content: `This article was created via webhook with the message: test`,
      //     },
      //   });

      //   return ctx.send({ data: newItem });
      // } catch (error) {
      //   console.error('Error creating article:', error);
      //   return ctx.send({ error: `Error creating asset: ${error.message}` }, 500);
      // }

    } catch (error) {
      console.error("Error processing webhook:", error);
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  },
};
