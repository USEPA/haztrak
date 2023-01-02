import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { RcraProfileState } from 'types/store';
import htApi from 'services';
import { Link } from 'react-router-dom';

interface ProfileViewProps {
  profile: RcraProfileState;
}

function RcraProfile({ profile }: ProfileViewProps) {
  const [editable, setEditable] = useState(false);
  const { register, reset, handleSubmit } = useForm<RcraProfileState>();
  return (
    <>
      <Form onSubmit={handleSubmit((data) => console.log('onSubmit: \n', data))}>
        <Container>
          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label className="fw-bold mb-0" htmlFor="profileRcraUsername">
                  RCRAInfo Username
                </Form.Label>
                <Form.Control
                  plaintext={!editable}
                  readOnly={!editable}
                  defaultValue={profile.rcraUsername}
                  id="profileRcraUsername"
                  {...register('rcraUsername')}
                  placeholder={
                    profile.rcraUsername ? profile.rcraUsername : 'Not Provided'
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="fw-bold mb-0" htmlFor="profileRcraAPIID">
                  RCRAInfo API ID
                </Form.Label>
                <Form.Control
                  plaintext={!editable}
                  readOnly={!editable}
                  defaultValue={profile.rcraAPIID}
                  id="profileRcraAPIID"
                  {...register('rcraAPIID')}
                  placeholder={
                    profile.rcraUsername ? profile.rcraUsername : 'Not Provided'
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label className="fw-bold mb-0" htmlFor="profileRcraUsername">
                  RCRAInfo API Key
                </Form.Label>
                <Form.Control
                  type="password"
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraAPIKey"
                  {...register('rcraAPIKey')}
                  placeholder="●●●●●●●●●●●"
                />
              </Form.Group>
            </Col>
            <Col>{/* Other RcraProfile form inputs here*/}</Col>
          </Row>
          <h4>Site Permissions</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>EPA ID</th>
                <th>e-Manifest</th>
                <th>Biennial Report</th>
                <th>Annual Report</th>
                <th>WIETS</th>
                <th>my RCRA ID</th>
              </tr>
            </thead>
            <tbody>
              {profile.epaSites?.map((epa_id, index) => {
                return (
                  <tr key={`permissionsRow${epa_id}${index}`}>
                    <td>
                      <Link to={`/site/${epa_id}`}>{epa_id}</Link>
                    </td>
                    <td>tmp</td>
                    <td>tmp</td>
                    <td>tmp</td>
                    <td>tmp</td>
                    <td>tmp</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        <div className="mx-1 d-flex flex-row-reverse">
          {!editable ? (
            <></>
          ) : (
            <Button
              className="mx-2"
              variant="danger"
              onClick={() => {
                setEditable(!editable);
                reset();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            className="mx-2"
            variant="success"
            type={editable ? 'button' : 'submit'}
            onClick={() => {
              setEditable(!editable);
            }}
          >
            {!editable ? 'Edit' : 'Save'}
          </Button>
          <Button
            className="mx-2"
            variant="primary"
            onClick={() =>
              htApi
                .get(`trak/profile/${profile.user}/sync`)
                .then((r) => console.log(r))
                .catch((r) => console.log(r))
            }
          >
            Sync Site Permissions
          </Button>
        </div>
      </Form>
    </>
  );
}

export default RcraProfile;
