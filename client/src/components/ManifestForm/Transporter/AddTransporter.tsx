import { HtModal } from 'components/Ht';
import TransporterSearchForm from 'components/ManifestForm/HandlerSearch/TransporterSearchForm';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { UseFieldArrayAppend } from 'react-hook-form';
import { RcraSite } from 'types/site';
import { Manifest } from 'components/ManifestForm/manifestSchema';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentTransporters?: Array<RcraSite>;
  appendTransporter: UseFieldArrayAppend<Manifest, 'transporters'>;
}

/**
 * Returns a modal for adding a transporter to a manifest
 * @param handleClose
 * @param show
 * @param appendTransporter
 * @param currentTransporters
 * @constructor
 */
function AddTransporter({ handleClose, show, appendTransporter, currentTransporters }: Props) {
  return (
    <HtModal showModal={show ? show : false} handleClose={handleClose}>
      <HtModal.Header closeButton>
        <Col>
          <Row>
            <HtModal.Title title="Transporter Search" />
          </Row>
          <Row>
            <i>
              <small>Type at least three characters to search for known Transporters</small>
            </i>
          </Row>
        </Col>
      </HtModal.Header>
      <TransporterSearchForm
        handleClose={handleClose}
        tranAppend={appendTransporter}
        currentTransporters={currentTransporters}
      />
    </HtModal>
  );
}

export default AddTransporter;
