import { HandlerSearchForm } from 'components/ManifestForm/HandlerSearch';
import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { HandlerType } from 'types/Handler/Handler';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

function Tsdf({ show, handleClose }: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Col>
          <Row>
            <Modal.Title>Designated Facility</Modal.Title>
          </Row>
          <Row>
            <i>
              <small>
                The Treatment, Storage, or Disposal Facility the waste will shipped to.
              </small>
            </i>
          </Row>
        </Col>
      </Modal.Header>
      <Modal.Body>
        <HandlerSearchForm handleClose={handleClose} handlerType={HandlerType.Tsd} />
      </Modal.Body>
    </Modal>
  );
}

export default Tsdf;
