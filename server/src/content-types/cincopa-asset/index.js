export default {
  kind: 'collectionType',
  collectionName: 'cincopaassets',
  info: {
    description: 'Cincopa assets collection type',
    displayName: 'Cincopa Asset',
    singularName: 'cincopa-asset',
    pluralName: 'cincopa-assets',
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
    'content-type-builder': {
      visible: true,
    },
    "content-api": {
      "enabled": true,
    },
    "users-permissions": {
      "configurable": true
    }
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    title: {
      label: "Asset Title",
      type: 'string',
      maxLength: 250,
      configurable: true,
    },
    asset_rid: {
      label: "Asset RID",
      type: 'string',
      required: true,
      configurable: false,
    },
    description: {
      label: "Asset Description",
      type: 'text',
      maxLength: 400,
      configurable: true,
    },
    notes: {
      label: "Notes",
      type: 'text',
      maxLength: 5000,
      configurable: true,
    },
    related_link_text: {
      label: "Related Link Text",
      type: 'string',
      maxLength: 1000,
      configurable: true,
    },
    related_link_url: {
      label: "Related Link URL",
      type: 'string',
      configurable: true,
    },
    reference_id: {
      label: "Reference ID",
      type: 'string',
      configurable: true,
    },
    type: {
      label: "Type",
      type: 'string',
      configurable: false,
    },
    uploaded: {
      label: "uploaded",
      type: 'date',
      configurable: true,
    },
  },
};
