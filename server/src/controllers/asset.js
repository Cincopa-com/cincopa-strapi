import { PLUGIN_NAME, SINGULAR_NAME } from '../constants';
import strapi from '@strapi/strapi';
const { createCoreController } = strapi.factories;

const ENTRY_NAME = `plugin::${PLUGIN_NAME}.${SINGULAR_NAME}`;

const cincopaAsset = createCoreController(ENTRY_NAME, ({ strapi }) => ({
  async search(ctx) {
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

    return await strapi.entityService.findMany(ENTRY_NAME, params);
  },

  async count(ctx) {
    const params = ctx.query;
    return await strapi.db.query(ENTRY_NAME).count(params);
  },

  async find(ctx) {
    const params = ctx.query;

    if (!params.populate) {
      params.populate = '*';
    }

    const entities = await strapi.entityService.findMany(ENTRY_NAME, params);
    const totalCount = await strapi.db.query(ENTRY_NAME).count(params);
    const items = entities.map((entity) => entity);

    return { items, totalCount };
  },
  async findOne(ctx) {
    const { assetrid } = ctx.params;

    return await strapi.db.query(ENTRY_NAME).findOne({
      where: { asset_rid: assetrid },
      populate: '*',
    });
  },
}));

export default cincopaAsset;
