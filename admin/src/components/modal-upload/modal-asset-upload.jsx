import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, Modal } from '@strapi/design-system';
import { getTranslation } from '../../utils/getTranslation';

const ModalNewUpload = ({ isOpen, onToggle = () => {}, configs }) => {
  const { formatMessage } = useIntl();
  const uploaderRef = useRef(null);
  const [uploadData, setUploadData] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);

  useEffect(() => {
    getUploadUrl();
  }, [isOpen]);

  useEffect(() => {
    const initializeUploader = () => {
      if (isOpen && uploaderRef.current) {
        const uploadUI = new cpUploadUI(uploaderRef.current, {
          upload_url: uploadUrl,
          multiple: false,
          width: 'auto',
          height: 'auto',
          onUploadComplete: function (data) {
            if (data.uploadState === 'Complete') {
              if (data.rid) {

                // setUploadData({
                //   rid: data.rid,
                //   thumbnail: `https://rtcdn.cincopa.com/thumb.aspx?size=large&rid=${data.rid}`,
                // });
              }
            }
          },
        });

        uploadUI.start();
      }
    };

    if (isOpen && uploaderRef.current) {
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

  }, [uploadUrl]);

  const getUploadUrl = async() => {
    try {
      const response = await fetch(`https://api.cincopa.com/v2/asset.get_upload_url.json?api_token=${configs.apiToken}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      debugger
      setUploadUrl();
    } catch (err) {
      // setError(err.message);
    }
  }

  return (
    <form>
      <Modal.Root open={isOpen} onOpenChange={onToggle}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {formatMessage({
                id: getTranslation('ModalNewUpload.header'),
                defaultMessage: 'Upload new asset or select from list',
              })}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box ref={uploaderRef}></Box> {/* This is where the uploader will be rendered */}
            {/* {uploadData && uploadData.thumbnail && (
              <div>
                <img src={uploadData.thumbnail} alt="Uploaded Thumbnail" />
              </div>
            )} */}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onToggle} variant="tertiary">
              {formatMessage({
                id: getTranslation('Common.cancel-button'),
                defaultMessage: 'Cancel',
              })}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </form>
  );
};

export default ModalNewUpload;
