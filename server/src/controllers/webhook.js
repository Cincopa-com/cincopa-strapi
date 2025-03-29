import { parse, format } from 'date-fns';

export default {
  async handleWebhook(ctx) {
    try {
      console.log("Webhook received:", ctx.request.body);
      ctx.body = { message: "Webhook received successfully2", data: ctx.request };

      const body = ctx?.request?.body;
      const event = body?.event;
      
      /* we will use asset.update when mirroring not enabled to be able handle reference_id=strapi */
      if (event === 'asset.updated') {
        return await handleAssetUpdated(ctx, body);
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

async function handleAssetUpdated(ctx, data) {
  const reference = data?.reference_id;
  const assetRid = data?.drid;

  // Check if the asset already exists
  const existingAsset = await strapi.db
    .query('plugin::cincopa-uploader-plugin.cincopa-asset')
    .findOne({
      where: { asset_rid: assetRid },
    });

  // reference == 'strapi' MUST BE CHECKED IF ITS NOT FULL MIRRORING OF CINCOPA
  if (existingAsset && reference === 'strapi') {
    const newAssetData = extractAssetData(data);

    const result = await strapi.entityService.update(
      'plugin::cincopa-uploader-plugin.cincopa-asset',
      existingAsset.id,
      { data: newAssetData }
    );

    return ctx.send({ success: false, message: 'Asset already exists and updated' });
  }

  if (!existingAsset && reference === 'strapi') {
    const newAssetData = extractAssetData(data);

    const newItem = await strapi.entityService.create(
      'plugin::cincopa-uploader-plugin.cincopa-asset',
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
    .query('plugin::cincopa-uploader-plugin.cincopa-asset')
    .findOne({
      where: { asset_rid: assetRid },
    });

  if (!existingAsset) {
    return ctx.send({ success: false, message: 'Asset not found' });
  }

  // Delete the asset by ID
  await strapi.entityService.delete(
    'plugin::cincopa-uploader-plugin.cincopa-asset',
    existingAsset.id
  );

  return ctx.send({ success: true, message: 'Asset deleted' });
}

// Handles field extraction and uploaded date parsing based on schema
function extractAssetData(data, contentTypeUID = 'plugin::cincopa-uploader-plugin.cincopa-asset') {
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
