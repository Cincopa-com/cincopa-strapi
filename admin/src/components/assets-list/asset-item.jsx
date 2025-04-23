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
      editorV2: true
    }

    cincopa?.loadEditor(editor);
  };

  const getThumbnailUrl = function (item, size) {

    let defaultSize = 3;
    let sbgenerated = false;

    size = size || defaultSize;
    let thumbnail = '';
    if (item.versions) {
      if (size === 1 && item.versions['jpg_100x75'] && item.versions['jpg_100x75'].url) {
        thumbnail = item.versions['jpg_100x75'].url;
      } else if (size === 2 && item.versions['jpg_200x150'] && item.versions['jpg_200x150'].url) {
        thumbnail = item.versions['jpg_200x150'].url;
      } else if (size === 3 && item.versions['jpg_600x450'] && item.versions['jpg_600x450'].url) {
        thumbnail = item.versions['jpg_600x450'].url;
      } else if (size === 4 && item.versions['jpg_1200x900'] && item.versions['jpg_1200x900'].url) {
        thumbnail = item.versions['jpg_1200x900'].url;
      } else if (size === 5 && item.versions['jpg_sb_100x75'] && item.versions['jpg_sb_100x75'].url) {
        thumbnail = item.versions['jpg_sb_100x75'].url;
        sbgenerated = true;
      } else if (size === 6 && item.versions['jpg_sb_200x150'] && item.versions['jpg_sb_200x150'].url) {
        thumbnail = item.versions['jpg_sb_200x150'].url;
        sbgenerated = true;
      } else {
        thumbnail = item.versions['jpg_600x450'] ? item.versions['jpg_600x450'].url : "";
      }
    }

    if (!thumbnail) {
      thumbnail = item?.thumbnail?.url || "";
      if (!thumbnail && item?.content?.type?.indexOf("audio") > -1) {
        thumbnail = 'https://www.cincopa.com/media-platform/runtimeze/assets/music.png';
      }
    }

    if ((size == 5 || size == 6) && !sbgenerated) {
      return '';
    }

    return thumbnail;
  }
  return (
    <>
      <div onClick={() => handleAssetClick(asset.rid)}>
        <Card>
          <CardHeader>
            <CardAsset src={getThumbnailUrl(asset)}/>
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
