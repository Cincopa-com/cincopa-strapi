import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardAsset,
  CardContent,
  CardTitle,
  CardSubtitle,
} from '@strapi/design-system';

const AssetItem = ({ asset, configs }) => {
  const assetDate = new Date(asset?.uploaded);
  const formattedDate = assetDate.toLocaleString();

  const handleAssetClick = (rid) => {
    let editor = {
      load_modules: [
        {
            name: 'info',
            title: 'Asset Info',
            order: 0
        },
        {
            name: 'share',
            title: 'Share Media',
            order: 1
        },
        {
            name: 'embed-info',
            title: 'Embed',
            feature: 'embed-media',
            order: 2
        },
        {
            name: 'spacer'
        },
        {
            name: 'email',
            title: 'Emails And Campaigns',
            feature: 'embed-email',
            order: 3
        },
        {
            name: 'thumbnail',
            title: 'Set Thumbnail',
            order: 4
        },
      ],
      token: configs.apiToken,
      rid,
      editorV2: true,
      change_tabs: true,
    }

    cincopa?.loadEditor(editor);
  };

  return (
    <>
      <div onClick={() => handleAssetClick(asset.rid)}>
        <Card>
          <CardHeader>
            <CardAsset src={asset?.thumbnail?.url} />
          </CardHeader>
          <CardBody>
            <CardContent>
              <CardTitle>{asset.caption || asset.filename}</CardTitle>
              <CardSubtitle>Uploaded: {formattedDate}</CardSubtitle>
            </CardContent>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default AssetItem;
