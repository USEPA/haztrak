import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../services';
import {sleepDemo} from '../../../utils/utils';
import {Manifest} from '../../../types';
import {Col, Container, Row} from 'react-bootstrap';
import HtCard from '../../../components/HtCard';

function ManifestDetails(): JSX.Element {
  let params = useParams();
  const [manifestData, setManifestData] = useState<Manifest | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`trak/manifest/${params.mtn}`, null)
      .then((response) => {
        // Begin HT Example
        // sleepDemo illustrates how HT handles async hydration
        sleepDemo(750).then(() => setLoading(false));
        // setLoading(false)
        // End HT Example
        setManifestData(response as Manifest);
        console.log(response);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [params.mtn]);

  return manifestData ? (
    <Container className="py-4">
      <h2 className="fw-bold">{manifestData.manifestTrackingNumber}</h2>
      <HtCard>
        <HtCard.Header title="General Info"></HtCard.Header>
        <HtCard.Body>
          <Row>
            <Col>
              <p className="fw-bold mb-1">Alias</p>
              <p>Note: extend manifest model to include alias</p>
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
              <p>{manifestData.generator.contact.test}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Contact Phone</p>
              <p>{manifestData.generator.contact.test}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Email</p>
              <p>{manifestData.generator.contact.test}</p>
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
              <p className="fw-bold mb-1">Emergency Phone</p>
              <p>{manifestData.designatedFacility.contact.test}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Contact Phone</p>
              <p>{manifestData.designatedFacility.contact.test}</p>
            </Col>
            <Col>
              <p className="fw-bold mb-1">Email</p>
              <p>{manifestData.designatedFacility.contact.test}</p>
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
    </Container>
  ) : (
    <p>no manifest data {error ? 'error msg goes here' : ''}</p>
  );
}

export default ManifestDetails;
