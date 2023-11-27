import { HandlerSearchForm } from 'components/Manifest/Handler';
import { RcraSite } from 'components/RcraSite';
import { HtModal } from 'components/UI';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { UseFieldArrayAppend } from 'react-hook-form';
import { Manifest, SiteType } from '../manifestSchema';

interface AddHandlerProps {
  handleClose: () => void;
  show: boolean | undefined;
  handlerType: SiteType;
  currentTransporters?: Array<RcraSite>;
  appendTransporter?: UseFieldArrayAppend<Manifest, 'transporters'>;
}

/**
 * Returns a modal that wraps around the HandlerSearchForm for adding the manifest TSDF
 * @param show
 * @param handleClose
 * @param handlerType
 * @param currentTransporters
 * @param appendTransporter
 * @constructor
 */
export function AddHandler({
  show,
  handleClose,
  handlerType,
  currentTransporters,
  appendTransporter,
}: AddHandlerProps) {
  // set the title and description based on the handlerType
  let title;
  let description;
  if (handlerType === 'designatedFacility') {
    title = 'Add Designated Facility';
    description = 'The Treatment, Storage, or Disposal Facility the waste will shipped to.';
  } else if (handlerType === 'transporter') {
    title = 'Add Transporter';
    description =
      'Transporters of the hazardous waste shipment. Transporters are required to be registered with EPA at https://rcrainfo.epa.gov.';
  } else {
    title = 'Add Generator';
    description =
      'The site that generated the hazardous waste to be shipped for offsite treatment.';
  }

  return (
    <HtModal showModal={show ? show : false} handleClose={handleClose}>
      <HtModal.Header closeButton>
        <Col>
          <Row>
            <HtModal.Title title={title} />
          </Row>
          <Row>
            <i>
              <small>{description}</small>
            </i>
          </Row>
        </Col>
      </HtModal.Header>
      <HtModal.Body>
        <HandlerSearchForm
          handleClose={handleClose}
          handlerType={handlerType}
          currentTransporters={currentTransporters}
          appendTransporter={appendTransporter}
        />
      </HtModal.Body>
    </HtModal>
  );
}
