import { HtCard } from 'components/Ht';
import React, { ReactElement, useState } from 'react';
import { Button, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useHtAPI from 'hooks/useHtAPI';
import useTitle from 'hooks/useTitle';
import SyncManifestBtn from 'components/SyncManifestBtn';
import MtnTable from 'components/MtnTable';
import { MtnDetails } from 'types/Manifest/Manifest';

/**
 * Fetch and display all the manifest tracking number (MTN) known by haztrak
 * @constructor
 */
function MtnList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId || ''} Manifest`);
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);

  let getUrl = 'trak/mtn';
  if (siteId) {
    getUrl = `trak/mtn/${siteId}`;
  }

  const [mtnList, loading, error] = useHtAPI<Array<MtnDetails>>(getUrl);

  if (error) {
    console.error(error.message);
    throw error;
  }

  return (
    <>
      <Container className="py-2">
        <Row className="d-flex justify-content-between">
          <Col className="d-flex justify-content-start">
            <h2>{siteId}</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <SyncManifestBtn siteId={siteId ? siteId : ''} />
            <Button variant="success" onClick={() => navigate('./new')}>
              New
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Col>
          <HtCard>
            <HtCard.Header title={`${siteId || 'Your'} Manifests`}>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {pageSize}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Page Size</Dropdown.Header>
                  <Dropdown.Item as="button" onClick={() => setPageSize(10)}>
                    10
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setPageSize(50)}>
                    50
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setPageSize(100)}>
                    100
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </HtCard.Header>
            <HtCard.Body>
              {loading ? (
                <HtCard.Spinner />
              ) : mtnList ? (
                <MtnTable manifests={mtnList} pageSize={pageSize} />
              ) : (
                <></>
              )}
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </>
  );
}

export default MtnList;
