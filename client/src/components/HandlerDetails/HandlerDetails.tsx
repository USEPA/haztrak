import { faCircleCheck, faCircleXmark, faSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddressListGroup from 'components/HandlerDetails/AddressListGroup';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ManifestHandler } from 'types/handler';

interface HandlerDetailsProps {
  handler: ManifestHandler;
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
        <Col>
          <h4>{handler.name}</h4>
        </Col>
        <Col className="d-flex justify-content-end">
          {handler.signed && (
            <p className="text-right">
              signed <FontAwesomeIcon icon={faSignature} className="text-success" size="xl" />
            </p>
          )}
        </Col>
      </Row>
      <Row className="mb-0">
        <Col>
          <label className="fw-bold">EPA ID number</label>
          <p>{handler.epaSiteId}</p>
        </Col>
        <Col>
          <p className="mb-0">
            <label className="fw-bold">Can e-Sign: </label>{' '}
            {handler.canEsign ? (
              <FontAwesomeIcon icon={faCircleCheck} className="text-success align-text-bottom" />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} className="text-danger align-text-bottom" />
            )}
          </p>
          <p>
            Has registered e-Manifest user:{' '}
            {handler.hasRegisteredEmanifestUser ? (
              <FontAwesomeIcon icon={faCircleCheck} className="text-success align-text-bottom" />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} className="text-danger align-text-bottom" />
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
