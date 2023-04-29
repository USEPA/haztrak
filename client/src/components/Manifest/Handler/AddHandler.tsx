import { HtModal } from 'components/Ht';
import { HandlerSearchForm } from 'components/Manifest/Handler/index';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HtSearchForm } from 'components/Manifest/Handler/HtSearchForm';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  handlerType: 'generator' | 'designatedFacility' | 'transporter';
}

/**
 * Returns a modal that wraps around the HandlerSearchForm for adding the manifest TSDF
 * @param show
 * @param handleClose
 * @constructor
 */
export function AddHandler({ show, handleClose, handlerType }: Props) {
  return (
    <HtModal showModal={show ? show : false} handleClose={handleClose}>
      <HtModal.Header closeButton>
        <Col>
          <Row>
            <HtModal.Title title="Add Designated Facility" />
          </Row>
          <Row>
            <i>
              <small>The Treatment, Storage, or Disposal Facility the waste will shipped to.</small>
            </i>
          </Row>
        </Col>
      </HtModal.Header>
      <HtModal.Body>
        <HandlerSearchForm handleClose={handleClose} handlerType={handlerType} />
        <HtSearchForm handleClose={handleClose} handlerType={handlerType} />
      </HtModal.Body>
    </HtModal>
  );
}
