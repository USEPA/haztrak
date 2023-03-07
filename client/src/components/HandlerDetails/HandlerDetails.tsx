import AddressListGroup from 'components/HandlerDetails/AddressListGroup';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Handler } from 'types';

interface HandlerDetailsProps {
  handler: Handler;
}

/**
 * Returns the details of an EPA hazardous waste handler including address information
 * @param handler
 * @constructor
 */
function HandlerDetails({ handler }: HandlerDetailsProps) {
  return (
    <div className="py-2">
      <Row>
        <h4>{handler.name}</h4>
      </Row>
      <Row className="mb-0">
        <Col>
          <label className="fw-bold">EPA ID number</label>
          <p>{handler.epaSiteId}</p>
        </Col>
        <Col>
          <p className="mb-0">
            Can e-Sign:{' '}
            {handler.hasRegisteredEmanifestUser ? (
              <i className="align-text-bottom text-success fa-solid fa-circle-check"></i>
            ) : (
              <i className="align-text-bottom text-danger fa-solid fa-circle-xmark"></i>
            )}
          </p>
          <p>
            Has registered e-Manifest user:{' '}
            {handler.hasRegisteredEmanifestUser ? (
              <i className="align-text-bottom text-success fa-solid fa-circle-check"></i>
            ) : (
              <i className="align-text-bottom text-danger fa-solid fa-circle-xmark"></i>
            )}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <AddressListGroup title="Address" address={handler.siteAddress} />
        </Col>
        <Col>
          <AddressListGroup title="Mailing Address" address={handler.mailingAddress} />
        </Col>
      </Row>
    </div>
  );
}

export default HandlerDetails;
