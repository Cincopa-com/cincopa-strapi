import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Modal } from '@strapi/design-system';
import { apiGetUploadUrl, apiAssetSetMeta } from '../../constants/index';
import { useFetchClient } from '@strapi/strapi/admin';

const ModalNewUpload = ({ isOpen, onToggle = () => {}, configs, onUpdated }) => {
  const uploaderRef = useRef(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const client = useFetchClient();

  useEffect(() => {
    if(isOpen){
      getUploadUrl();
    }
  }, [isOpen]);

  useEffect(() => {
    let uploadUI;
    const initializeUploader = () => {
      if (isOpen && uploaderRef.current && uploadUrl) {
        uploadUI = new cpUploadUI(uploaderRef.current, {
          upload_url: uploadUrl,
          multiple: false,
          width: 'auto',
          height: 'auto',
          onUploadComplete: function (data) {
            if (data.uploadState === 'Complete') {
              let dataforWebhook = {
                drid: data?.rid,
                filename: data?.file?.name,
                modified: data?.file?.lastModified,
                description:'',
                long_description:'',
                related_link_text:'',
                related_link_url:'',
                reference_id:'strapi',
                type: getMimeCategory(data?.type || data?.file?.type)
              }
              callWebHook(dataforWebhook);
              data?.rid && setMeta(data?.rid);
              onUpdated();
              onToggle();
            }
          },
        });

        uploadUI.start();
      }
    };

    if (isOpen && uploaderRef.current) {
      uploadUI = null;
      initializeUploader();
    } else {

      const interval = setInterval(() => {
        if (uploaderRef.current) {
          initializeUploader();
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }

  }, [isOpen, uploadUrl]);

  const getUploadUrl = async() => {
    try {
      const response = await fetch(`${apiGetUploadUrl}?api_token=${configs.apiToken}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setUploadUrl(result?.upload_url);
    } catch (err) {
      console.log(err, 'Error: Get Upload Url');
    }
  }


  const setMeta = async(rid) =>{
    try {
      const response = await fetch(`${apiAssetSetMeta}?api_token=${configs.apiToken}&rid=${rid}&reference_id=strapi`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
    } catch (err) {
      console.log(err, 'Error: Asset Set Meta Data');
    }
  }

  const callWebHook = async(data) =>{
    data.event = 'asset.updated'; // this will work for fullCincopaSync both cases
    await client
    .post('/api/cincopa-uploader/webhook',  data )
    .then((response) => {
    })
    .catch((error) => {
        console.error('Error creating cincopa asset:', error);
    });
  }

  const getMimeCategory = (mimeType) => {
    if (typeof mimeType !== 'string') return 'other';
    const [type] = mimeType.toLowerCase().split('/');
    switch (type) {
      case 'image':
      case 'video':
      case 'audio':
        return type;
      default:
        return 'other';
    }
  }

  return (
    <form>
      <Modal.Root open={isOpen} onOpenChange={onToggle}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Upload new asset or select from list</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box ref={uploaderRef}></Box>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onToggle} variant="tertiary">Cancel</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </form>
  );
};

export default ModalNewUpload;
