import { HtModal } from '~/components/legacyUi';
import React from 'react';
import { Handler, RcraSiteType } from '~/components/Manifest/manifestSchema';
import { QuickerSignForm } from './QuickerSignForm';

interface QuickerSignModalProps {
  handleClose: () => void;
  show: boolean;
  mtn?: string[];
  mtnHandler?: Handler;
  siteType: RcraSiteType;
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
