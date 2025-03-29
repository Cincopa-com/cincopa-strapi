import { parse, format, isValid } from 'date-fns';

export default {
  async handleWebhook(ctx) {
    try {
      console.log("Webhook received:", ctx.request.body);
      ctx.body = { message: "Webhook received successfully2", data: ctx.request};

      let event = ctx?.request?.body.event;
      if(event == "asset.uploaded"){
        const data =  extractAssetData(ctx.request.body)

        // create entry in your collection
        const newItem = await strapi.entityService.create(
          'plugin::cincopa-uploader-plugin.cincopa-asset', // or 'api::collection-name.model-name'
          {
            data: data,
          }
        );

        ctx.send({ success: true, entry: newItem });
      }else{
        ctx.send({ success: true, entry: 'nothing added' });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  },
};


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
    title: data.filename || '',
    descriptoion: data.description || '',
    notes: data.caption || '',
    related_link_text: data.related_link_text || '',
    related_link_url: data.related_link_url || '',
    reference_id: data.reference_id || '',
    uploaded: uploadedDate
  };
}
