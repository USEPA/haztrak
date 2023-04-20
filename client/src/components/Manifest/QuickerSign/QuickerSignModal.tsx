import { HtModal } from 'components/Ht';
import React from 'react';
import { QuickerSignForm } from './QuickerSignForm';
import { Handler } from 'components/Manifest/Handler';

interface QuickerSignModalProps {
  handleClose: () => void;
  show: boolean;
  mtn?: Array<string>;
  mtnHandler?: Handler;
  siteType: 'Generator' | 'Transporter' | 'Tsdf';
}

export function QuickerSignModal({
  handleClose,
  show,
  mtn,
  mtnHandler,
  siteType,
}: QuickerSignModalProps) {
  return (
    <>
      <HtModal showModal={show} handleClose={handleClose}>
        <HtModal.Header closeButton>
          <HtModal.Title title="Quicker Sign" />
        </HtModal.Header>
        <HtModal.Body>
          {mtn && mtnHandler && (
            <QuickerSignForm
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
