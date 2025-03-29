import React from 'react';
import { useIntl } from 'react-intl';
import { Layouts } from '@strapi/strapi/admin';
import { Button } from '@strapi/design-system';
import { getTranslation } from '../../utils/getTranslation';
import ModalNewUpload from '../modal-upload/modal-asset-upload';

const Header = ({configs}) => {
  const { formatMessage } = useIntl();
  const [isNewUploadOpen, setIsNewUploadOpen] = React.useState(false); // State to control modal visibility

  const handleUploadAsset = () => {
    setIsNewUploadOpen(true); // Set modal state to true when button is clicked
  };

  const handleOnNewUploadClose = () => {
    setIsNewUploadOpen(false);

  };

  return (
    <>
      <Layouts.Header
        title={formatMessage({
          id: getTranslation('HomePage.section-label'),
          defaultMessage: 'Cincopa Assets Uploader',
        })}
        primaryAction={
          <Button onClick={handleUploadAsset}>
            {formatMessage({
              id: getTranslation('HomePage.new-upload-button'),
              defaultMessage: 'Upload new asset',
            })}
          </Button>
        }
      />
      <ModalNewUpload configs={configs} isOpen={isNewUploadOpen} onToggle={handleOnNewUploadClose}/>
    </>
  );
};

export default Header;
