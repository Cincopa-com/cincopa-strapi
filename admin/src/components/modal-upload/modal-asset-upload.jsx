import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Modal } from '@strapi/design-system';
import { apiGetUploadUrl, apiAssetSetMeta } from '../../constants/index';

const ModalNewUpload = ({ isOpen, onToggle = () => {}, configs, onUpdated }) => {
  const uploaderRef = useRef(null);
  const [uploadUrl, setUploadUrl] = useState(null);

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
