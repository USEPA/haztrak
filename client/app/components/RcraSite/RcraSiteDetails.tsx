import { Col, Row } from 'react-bootstrap';
import { FaSignature } from 'react-icons/fa';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import { Handler } from '~/components/Manifest';
import { AddressListGroup, RcraSite } from '~/components/RcraSite';

interface RcraSiteDetailsProps {
  handler?: Handler | RcraSite;
}

/**
 * Returns the details of an EPA hazardous waste handler
 * @param handler
 * @constructor
 */
export function RcraSiteDetails({ handler }: RcraSiteDetailsProps) {
  if (handler === undefined) {
    return <p>error</p>;
  }
  return (
    <div className="py-2 mb-3">
      <Row>
        <Col xs={10}>
          <h4>{handler.name}</h4>
        </Col>
        <Col className="d-flex justify-content-end">
          {'signed' in handler && handler.signed && (
            <p className="text-right">
              signed <FaSignature className="text-success" size="xl" />
            </p>
          )}
        </Col>
      </Row>
      <Row className="mb-0" xs={1} sm={2}>
        <Col>
          <p className="fw-bold mb-1">EPA ID number</p>
          <p>{handler.epaSiteId}</p>
        </Col>
        <Col>
          <div className="mb-0">
            <p className="fw-bold">
              Can e-Sign:{' '}
              {handler.canEsign ? (
                <FaCircleCheck className="text-success align-text-bottom" />
              ) : (
                <FaCircleXmark className="text-danger align-text-bottom" />
              )}
            </p>
          </div>
          <p className="fw-bold">
            Has registered e-Manifest user:{' '}
            {handler.hasRegisteredEmanifestUser ? (
              <FaCircleCheck className="text-success align-text-bottom" />
            ) : (
              <FaCircleXmark className="text-danger align-text-bottom" />
            )}
          </p>
        </Col>
      </Row>
      <Row xs={1} sm={2} className="gy-3">
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
