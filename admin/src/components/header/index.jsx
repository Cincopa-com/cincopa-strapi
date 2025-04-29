import React from 'react';
import { Layouts } from '@strapi/strapi/admin';
import { Button } from '@strapi/design-system';
import ModalNewUpload from '../modal-upload/modal-asset-upload';

const Header = ({configs, onUpdated}) => {
  const [isNewUploadOpen, setIsNewUploadOpen] = React.useState(false);

  const handleUploadAsset = () => {
    setIsNewUploadOpen(true);
  };

  const handleOnNewUploadClose = () => {
    setIsNewUploadOpen(false);
  };

  return (
    <>
      <Layouts.Header
        title="Cincopa Assets Uploader"
        primaryAction={
          <Button onClick={handleUploadAsset}>Upload new asset</Button>
        }
      />
      <ModalNewUpload configs={configs} isOpen={isNewUploadOpen} onToggle={handleOnNewUploadClose} onUpdated={onUpdated}/>
    </>
  );
};

export default Header;
