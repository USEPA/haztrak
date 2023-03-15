import { HtModal } from 'components/Ht';
import React from 'react';
import { Handler } from 'types/handler';
import QuickerSign from './QuickerSign';

interface QuickerSignModalProps {
  handleClose: () => void;
  show: boolean;
  mtn?: Array<string>;
  mtnHandler?: Handler;
}

function QuickerSignModal({ handleClose, show, mtn, mtnHandler }: QuickerSignModalProps) {
  return (
    <>
      <HtModal showModal={show} handleClose={handleClose}>
        <HtModal.Header closeButton>
          <HtModal.Title title="Quicker Sign" />
        </HtModal.Header>
        <HtModal.Body>
          {mtn && mtnHandler && (
            <QuickerSign mtn={mtn} mtnHandler={mtnHandler} handleClose={handleClose} />
          )}
        </HtModal.Body>
      </HtModal>
    </>
  );
}

export default QuickerSignModal;
