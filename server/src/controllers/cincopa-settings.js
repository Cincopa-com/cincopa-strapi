const cincopaSettings = ({ strapi }) => ({
  getToken(ctx) {
    ctx.body = strapi
      .plugin('cincopa-uploader-plugin')
      // the name of the service file & the method.
      .service('service')
      .getCincopaToken();
  },
});

export default cincopaSettings;

// export default {
//   async getToken(ctx) {
//     try {
//       const token = await strapi
//         .plugin("cincopa-uploader-plugin")
//         .service("token")
//         .getToken();
//       ctx.body = { token };
//     } catch (error) {
//       ctx.throw(500, "Unable to fetch token");
//     }
//   },

//   async saveToken(ctx) {
//     try {
//       const { token } = ctx.request.body;
//       if (!token) {
//         ctx.throw(400, "Token is required");
//       }

//       await strapi
//         .plugin("cincopa-uploader-plugin")
//         .service("token")
//         .setToken(token);

//       ctx.body = { message: "Token saved successfully" };
//     } catch (error) {
//       ctx.throw(500, "Unable to save token");
//     }
//   },
// };
