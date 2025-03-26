export default {
  kind: 'collectionType',
  collectionName: 'cincopaAssets',
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
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    title: {
      label: "Asset Title",
      type: 'string',
      private: false,
      required: true,
      maxLength: 250,
      configurable: true,
    },
    descriptoion: {
      label: "Asset Description",
      type: 'string',
      private: false,
      required: true,
      maxLength: 400,
      configurable: true,
    },
    asset_rid: {
      label: "Asset RID",
      type: 'string',
      required: true,
    },
  },
};
