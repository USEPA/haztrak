import HtCard from 'components/HtCard';
import HtSpinner from 'components/HtSpinner';
import useHtAPI from 'hooks/useHtAPI';
import React, { ReactElement } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Manifest } from 'types';
import useTitle from 'hooks/useTitle';

/**
 * This React component displays an existing hazardous waste manifest.
 * Currently, there's a lot of work to do here. It knows which manifest
 * to display from the manifest in the URL.
 *
 * @constructor
 */
function ManifestDetails(): ReactElement {
  let { mtn } = useParams();
  useTitle(`View ${mtn}`);
  const [manifestData, loading, error] = useHtAPI<Manifest>(`trak/manifest/${mtn}`);

  if (error) throw error;

  return loading ? (
    <HtSpinner />
  ) : manifestData ? (
    <>
      <h2 className="fw-bold">{manifestData.manifestTrackingNumber}</h2>
      <HtCard>
        <HtCard.Header title="General Info"></HtCard.Header>
        <HtCard.Body>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Alias</p>
              <p>ToDo: add alias field</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Submission Type</p>
              <p>{manifestData.submissionType}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Origin Type</p>
              <p>{manifestData.originType}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Status</p>
              <p>{manifestData.status}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">
                Was the waste on this manifest imported from another country?
              </p>
              {manifestData.import ? (
                <i className="fa-solid fa-check text-success"></i>
              ) : (
                <i className="fa-solid fa-x text-danger"></i>
              )}
            </Col>
          </Row>
        </HtCard.Body>
      </HtCard>
      {/* Generator Information */}
      <HtCard>
        <HtCard.Header title="Generator Info"></HtCard.Header>
        <HtCard.Body>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Name</p>
              <p>{manifestData.generator.name}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">EPA ID number</p>
              <p>{manifestData.generator.epaSiteId}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Mailing Address</p>
              <p>
                {manifestData.generator.mailingAddress.address1 +
                  ' ' +
                  manifestData.generator.mailingAddress.city +
                  ' ' +
                  manifestData.generator.mailingAddress.state.name +
                  ' ' +
                  manifestData.generator.mailingAddress.zip}
              </p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Site Address</p>
              <p>
                {manifestData.generator.siteAddress.address1 +
                  ' ' +
                  manifestData.generator.siteAddress.city +
                  ' ' +
                  manifestData.generator.siteAddress.state.name +
                  ' ' +
                  manifestData.generator.siteAddress.zip}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Emergency Phone</p>
              <p>
                {manifestData.generator.emergencyPhone
                  ? manifestData.generator.emergencyPhone.number
                  : ''}
              </p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Contact Phone</p>
              <p>
                {manifestData.generator.contact.phone
                  ? manifestData.generator.contact.phone.number
                  : ''}
              </p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Email</p>
              <p>{manifestData.generator.contact.email}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Can use electronic manifests?</p>
              {manifestData.generator.hasRegisteredEmanifestUser ? (
                <i className="fa-solid fa-check text-success"></i>
              ) : (
                <i className="fa-solid fa-x text-danger"></i>
              )}
            </Col>
          </Row>
        </HtCard.Body>
      </HtCard>
      {/* Designated Receiving Facility Information */}
      <HtCard>
        <HtCard.Header title="TSD Info"></HtCard.Header>
        <HtCard.Body>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Name</p>
              <p>{manifestData.designatedFacility.name}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">EPA ID number</p>
              <p>{manifestData.designatedFacility.epaSiteId}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Mailing Address</p>
              <p>
                {manifestData.designatedFacility.mailingAddress.address1 +
                  ' ' +
                  manifestData.designatedFacility.mailingAddress.city +
                  ' ' +
                  manifestData.designatedFacility.mailingAddress.state.name +
                  ' ' +
                  manifestData.designatedFacility.mailingAddress.zip}
              </p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Site Address</p>
              <p>
                {manifestData.designatedFacility.siteAddress.address1 +
                  ' ' +
                  manifestData.designatedFacility.siteAddress.city +
                  ' ' +
                  manifestData.designatedFacility.siteAddress.state.name +
                  ' ' +
                  manifestData.designatedFacility.siteAddress.zip}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Contact Phone</p>
              <p>
                {manifestData.designatedFacility.contact?.phone
                  ? manifestData.designatedFacility.contact.phone.number
                  : ''}
              </p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Email</p>
              <p>{manifestData.designatedFacility.contact.email}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Can use electronic manifests?</p>
              {manifestData.designatedFacility.hasRegisteredEmanifestUser ? (
                <i className="fa-solid fa-check text-success"></i>
              ) : (
                <i className="fa-solid fa-x text-danger"></i>
              )}
            </Col>
          </Row>
        </HtCard.Body>
      </HtCard>
    </>
  ) : (
    <></>
  );
}

export default ManifestDetails;
