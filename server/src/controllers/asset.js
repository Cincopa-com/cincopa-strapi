import { PLUGIN_NAME, SINGULAR_NAME } from '../constants';
const ENTRY_NAME = `plugin::${PLUGIN_NAME}.${SINGULAR_NAME}`;

const cincopaAsset = ({ strapi }) => ({
  search(ctx){
    const params = ctx.query;

    if (!params.sort) {
      params.sort = 'createdAt';
    }

    if (!params.order) {
      params.order = 'desc';
    }

    if (!params.populate) {
      params.populate = '*';
    }




    // return strapi.db.query(ENTRY_NAME).findMany(params);
    return strapi.documents(ENTRY_NAME).findMany(params);
  },
  count(ctx){
    const params = ctx.query;

    return strapi.db.query(ENTRY_NAME).count(params);
  },
  async find (ctx){
    console.log('TEESET111');
    const entities = await this.search(ctx);
    const totalCount =await this.count(ctx);
    const items = entities.map((entity) => entity);
    console.log(ENTRY_NAME,'itemss')

    return { items, totalCount };
  },
  async findOne (ctx){
    console.log('TEESET222');
    const { assetrid } = ctx.params;

    return await strapi.db.query(ENTRY_NAME).findOne({
      where: { asset_rid: assetrid }
    });
  }
});

export default cincopaAsset;
