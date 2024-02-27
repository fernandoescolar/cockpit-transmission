import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

export const ConfirmDeletion = ({torrent, fulldelete, handleOk, handleCancel}) => {
  return (

    <Modal
        variant={ModalVariant.small}
        title="Confirm deletion"
        isOpen={true}
        onClose={handleCancel}
        actions={[
            <Button key="confirm" variant="primary" onClick={handleOk}>
            Confirm
            </Button>,
            <Button key="cancel" variant="link" onClick={handleCancel}>
            Cancel
            </Button>
        ]}
    >
        Are you sure you want to delete {torrent.name}?
        {fulldelete && <p><b>This will also delete from your disk the data related to this torrent.</b></p>}
        {!fulldelete && <p><i>This will keep the data related to this torrent in your disk.</i></p>}
    </Modal>
  );
};
