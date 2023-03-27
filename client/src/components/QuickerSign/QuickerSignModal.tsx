import { HtModal } from 'components/Ht';
import React from 'react';
import { ManifestHandler } from 'types/handler';
import QuickerSign from './QuickerSign';

interface QuickerSignModalProps {
  handleClose: () => void;
  show: boolean;
  mtn?: Array<string>;
  mtnHandler?: ManifestHandler;
  siteType: 'Generator' | 'Transporter' | 'Tsdf';
}

function QuickerSignModal({ handleClose, show, mtn, mtnHandler, siteType }: QuickerSignModalProps) {
  return (
    <>
      <HtModal showModal={show} handleClose={handleClose}>
        <HtModal.Header closeButton>
          <HtModal.Title title="Quicker Sign" />
        </HtModal.Header>
        <HtModal.Body>
          {mtn && mtnHandler && (
            <QuickerSign
              mtn={mtn}
              mtnHandler={mtnHandler}
              handleClose={handleClose}
              siteType={siteType}
            />
          )}
        </HtModal.Body>
      </HtModal>
    </>
  );
}

export default QuickerSignModal;
