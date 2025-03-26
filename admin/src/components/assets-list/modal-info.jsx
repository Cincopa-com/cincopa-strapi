import React, {useState} from 'react';
import { Flex, Box, Button, Field, TextInput, Textarea, Modal } from '@strapi/design-system';

const ModalAssetInfo = ({ isOpen, onToggle = () => {}, asset }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(asset?.caption || asset?.filename || '');
  const [description, setDescription] = useState(asset?.description || '');
  const [embedCode, setEmbedCode] = useState(`<div id="cincopa_A4HAcLOLOO68${asset.rid}" class="gallerydemo cincopa-fadein" style='width: 100%; height: auto; max-width: 100%;'>
      <div style='width: 100%; height: auto; max-width: 100%; display:flex;'>
        <img src="https://rtcdn.cincopa.com/thumb.aspx?fid=A4HAcLOLOO68!${asset.rid}&size=large"
          style="filter:blur(5px); object-fit:contain; width:100% aspect-ratio: 1.78; padding: 0; margin: 0;"
          onload="this.parentNode ? this.parentNode.style.opacity=1 : '';" />
      </div>
    </div>
    <script src="//rtcdn.cincopa.com/meta_json.aspx?fid=A4HAcLOO68!A0PDdHdzgz17&ver=v2&id=cincopa_A4HAcLOO68${asset.rid}&lang=hy" type="text/javascript"></script>
    <script src="//rtcdn.cincopa.com/libasync.js" type="text/javascript"></script>`);
  const assetDate = new Date(asset?.uploaded);
  const formattedDate = assetDate.toLocaleString();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDeleteAsset = async (rid) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.cincopa.com/v2/asset.delete.json?api_token=230692iojeswdxdgkmnxklh25rivovgmpc&rid=${rid}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      if(result.success) {
        onToggle();
        setLoading(false);
      }
    } catch (err) {
      console.log(err, 'Error Delete Asset')
    }
  };

  const handleSaveAsset = async (rid) => {
    try {
      const response = await fetch(`https://api.cincopa.com/v2/asset.set_meta.json?api_token=230692iojeswdxdgkmnxklh25rivovgmpc&rid=${rid}&caption=${title}&description=${description}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      if(result.success) {
        onToggle();
      }
    } catch (err) {
      console.log(err, 'Error Delete Asset')
    }
  };

  return (
    <form>
      <Modal.Root open={isOpen} onOpenChange={onToggle}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Box>Video Details</Box>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Flex gap={3} if="">
              <Box grow='1'>
                <Field.Root style={{ marginBottom: '20px' }}>
                  <Field.Label>Asset title</Field.Label>
                  <TextInput
                    placeholder="Enter asset title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </Field.Root>
                <Field.Root style={{ marginBottom: '20px' }}>
                  <Field.Label>Asset description</Field.Label>
                  <TextInput
                    placeholder="Enter asset description"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </Field.Root>
                <Field.Root style={{ marginBottom: '20px' }}>
                  <Field.Label>Asset embed</Field.Label>
                  <Textarea
                    value={embedCode}
                  />
                </Field.Root>

                <Button variant="danger" onClick={() => handleDeleteAsset(asset.rid)}>
                  {loading ? `Deleting...` : `Delete Asset`}
                </Button>
              </Box>
            </Flex>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" onClick={onToggle}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleSaveAsset(asset.rid)}>
              Finish
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </form>
  );
};

export default ModalAssetInfo;
