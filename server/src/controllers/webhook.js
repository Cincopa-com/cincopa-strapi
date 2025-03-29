import { parse, format } from 'date-fns';
import { PLUGIN_NAME, SINGULAR_NAME } from '../constants';
const ENTRY_NAME = `plugin::${PLUGIN_NAME}.${SINGULAR_NAME}`;

export default {
  async handleWebhook(ctx) {
    try {
      console.log("FULL SYNC", strapi.config.get(`plugin.${PLUGIN_NAME}.fullCincopaSync`));
      console.log("Webhook received:", ctx.request.body);
      ctx.body = { message: "Webhook received successfully2", data: ctx.request };

      const body = ctx?.request?.body;
      const event = body?.event;

      const fullSyncEnabled = strapi.config.get(`plugin.${PLUGIN_NAME}.fullCincopaSync`);

      /* we will use asset.update when mirroring not enabled to be able handle reference_id=strapi */
      if(fullSyncEnabled && event == 'asset.uploaded'){
        return await handleAssetUpdated(ctx, body, fullSyncEnabled);
      }

      if (event === 'asset.updated') {
        return await handleAssetUpdated(ctx, body, fullSyncEnabled); 
      }

      if (event === 'asset.deleted') {
        return await handleAssetDeleted(ctx, body);
      }

      return ctx.send({ success: true, entry: 'nothing added' });

    } catch (error) {
      console.error("Error processing webhook:", error);
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  },
};


async function handleAssetUploaded(ctx, data, fullSyncEnabled = false) {
  const reference = data?.reference_id;
  const assetRid = data?.drid;
 
  // Check if the asset already exists
  const existingAsset = await strapi.db
    .query(ENTRY_NAME)
    .findOne({
      where: { asset_rid: assetRid },
    });

  // reference == 'strapi' MUST BE CHECKED IF ITS NOT FULL MIRRORING OF CINCOPA

  if (existingAsset && (reference === 'strapi' || fullSyncEnabled)) {
    const newAssetData = extractAssetData(data);

    const result = await strapi.entityService.update(
      ENTRY_NAME,
      existingAsset.id,
      { data: newAssetData }
    );

    return ctx.send({ success: false, message: 'Asset already exists and updated' });
  }

  if (!existingAsset && (reference === 'strapi' || fullSyncEnabled)) {
    const newAssetData = extractAssetData(data);

    const newItem = await strapi.entityService.create(
      ENTRY_NAME,
      { data: newAssetData }
    );

    return ctx.send({ success: true, entry: newItem });
  }

  return ctx.send({ success: true, message: 'No action taken (non-strapi reference)' });
}



async function handleAssetUpdated(ctx, data, fullSyncEnabled = false) {
  const reference = data?.reference_id;
  const assetRid = data?.drid;
 
  // Check if the asset already exists
  const existingAsset = await strapi.db
    .query(ENTRY_NAME)
    .findOne({
      where: { asset_rid: assetRid },
    });

  // reference == 'strapi' MUST BE CHECKED IF ITS NOT FULL MIRRORING OF CINCOPA

  if (existingAsset && (reference === 'strapi' || fullSyncEnabled)) {
    const newAssetData = extractAssetData(data);

    const result = await strapi.entityService.update(
      ENTRY_NAME,
      existingAsset.id,
      { data: newAssetData }
    );

    return ctx.send({ success: false, message: 'Asset already exists and updated' });
  }

  if (!existingAsset && (reference === 'strapi' || fullSyncEnabled)) {
    const newAssetData = extractAssetData(data);

    const newItem = await strapi.entityService.create(
      ENTRY_NAME,
      { data: newAssetData }
    );

    return ctx.send({ success: true, entry: newItem });
  }

  return ctx.send({ success: true, message: 'No action taken (non-strapi reference)' });
}

async function handleAssetDeleted(ctx, data) {
  const assetRid = data?.drid;

  if (!assetRid) {
    ctx.status = 400;
    return ctx.send({ success: false, error: 'Missing asset_rid' });
  }

  const existingAsset = await strapi.db
    .query(ENTRY_NAME)
    .findOne({
      where: { asset_rid: assetRid },
    });

  if (!existingAsset) {
    return ctx.send({ success: false, message: 'Asset not found' });
  }

  // Delete the asset by ID
  await strapi.entityService.delete(
    ENTRY_NAME,
    existingAsset.id
  );

  return ctx.send({ success: true, message: 'Asset deleted' });
}

// Handles field extraction and uploaded date parsing based on schema
function extractAssetData(data, contentTypeUID = ENTRY_NAME) {
  let uploadedDate = '';

  const schema = strapi.contentTypes[contentTypeUID];
  const uploadedFieldType = schema?.attributes?.uploaded?.type;

  if (data.modified) {
    const parsed = new Date(data.modified);

    if (!isNaN(parsed.getTime())) {
      if (uploadedFieldType === 'date') {
        uploadedDate = format(parsed, 'yyyy-MM-dd');
      } else if (uploadedFieldType === 'datetime') {
        uploadedDate = parsed.toISOString();
      } else {
        uploadedDate = ''; // Unknown format — could throw or warn here
      }
    }
  }

  return {
    asset_rid: data.drid || '',
    title: data.caption || data.filename || '',
    descriptoion: data.description || '',
    notes: data.long_description || '',
    related_link_text: data.related_link_text || '',
    related_link_url: data.related_link_url || '',
    reference_id: data.reference_id || '',
    uploaded: uploadedDate
  };
}
