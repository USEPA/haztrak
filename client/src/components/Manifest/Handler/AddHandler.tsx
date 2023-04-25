import { HtModal } from 'components/Ht';
import { HandlerSearchForm } from 'components/Manifest/Handler/index';
import { HandlerType } from 'components/Manifest';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

/**
 * Returns a modal that wraps around the HandlerSearchForm for adding the manifest TSDF
 * @param show
 * @param handleClose
 * @constructor
 */
export function AddHandler({ show, handleClose }: Props) {
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
        <HandlerSearchForm
          handleClose={handleClose}
          handlerType={HandlerType.enum.designatedFacility}
        />
      </HtModal.Body>
    </HtModal>
  );
}
