import { zodResolver } from '@hookform/resolvers/zod';
import { RcraApiUserBtn } from 'components/buttons';
import { HtForm } from 'components/Ht';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { htApi } from 'services';
import { addNotification, useAppDispatch } from 'store';
import { getProfile, updateProfile } from 'store/rcraProfileSlice';
import { RcraProfileState } from 'store/rcraProfileSlice/rcraProfile.slice';
import { z } from 'zod';

interface ProfileViewProps {
  profile: RcraProfileState;
}

// ToDo: Either rcraAPIId & rcraAPIID should both be empty or both be non-empty
const rcraProfileForm = z.object({
  rcraAPIID: z.string().min(36).optional(),
  rcraAPIKey: z.string().min(20).optional(),
  rcraUsername: z.string().min(8).optional(),
});

type RcraProfileForm = z.infer<typeof rcraProfileForm>;

export function RcraProfile({ profile }: ProfileViewProps) {
  const [editable, setEditable] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const { rcraSites, loading, ...formValues } = profile;
  const dispatch = useAppDispatch();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RcraProfileForm>({
    values: formValues,
    resolver: zodResolver(rcraProfileForm),
  });

  /**
   * Run upon submitting the RcraProfile form.
   * @param data {RcraProfileState}
   */
  const onSubmit = (data: RcraProfileForm) => {
    setProfileLoading(!profileLoading);
    setEditable(!editable);
    htApi
      .put(`/rcra/profile/${profile.user}`, data)
      .then((r) => {
        dispatch(updateProfile(r.data));
      })
      .then(() => dispatch(getProfile()))
      .then(() => setProfileLoading(!profileLoading))
      .catch((r) => console.error(r));
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Row className="mb-2">
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="profileRcraUsername">RCRAInfo Username</HtForm.Label>
                <Form.Control
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraUsername"
                  {...register('rcraUsername')}
                  placeholder={profile.rcraUsername ? profile.rcraUsername : 'Not Provided'}
                  className={errors.rcraUsername && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.rcraUsername?.message}</div>
              </HtForm.Group>
            </Col>
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="profileRcraAPIID">RCRAInfo API ID</HtForm.Label>
                <Form.Control
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraAPIID"
                  {...register('rcraAPIID')}
                  placeholder={profile.rcraAPIID ? profile.rcraAPIID : 'Not Provided'}
                  className={errors.rcraAPIID && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.rcraAPIID?.message}</div>
              </HtForm.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <HtForm.Group>
                <HtForm.Label htmlFor="profileRcraAPIKey">RCRAInfo API Key</HtForm.Label>
                <Form.Control
                  type="password"
                  plaintext={!editable}
                  readOnly={!editable}
                  id="profileRcraAPIKey"
                  {...register('rcraAPIKey')}
                  placeholder="●●●●●●●●●●●"
                  className={errors.rcraAPIKey && 'is-invalid'}
                />
                <div className="invalid-feedback">{errors.rcraAPIKey?.message}</div>
              </HtForm.Group>
            </Col>
          </Row>
          <Row>
            <div className="mx-1 d-flex flex-row-reverse">
              {!editable ? (
                <>
                  <Button
                    className="mx-2"
                    variant="success"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      setEditable(!editable);
                    }}
                  >
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button className="mx-2" variant="success" type="submit">
                    Save
                  </Button>
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
                </>
              )}
            </div>
          </Row>
        </Container>
      </HtForm>
      <Container>
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
            {profile.rcraSites &&
              Object.values(profile.rcraSites).map((site) => (
                <tr key={`permissionsRow${site.site.handler.epaSiteId}`}>
                  <td>
                    <Link to={`/site/${site.site.handler.epaSiteId}`}>
                      {site.site.handler.epaSiteId}
                    </Link>
                  </td>
                  <td>{site.permissions.eManifest}</td>
                  <td>{site.permissions.biennialReport}</td>
                  <td>{site.permissions.annualReport}</td>
                  <td>{site.permissions.WIETS}</td>
                  <td>{site.permissions.myRCRAid}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
      <div className="mx-1 d-flex flex-row-reverse">
        <RcraApiUserBtn
          className="mx-2"
          variant="primary"
          onClick={() =>
            htApi
              .get(`profile/${profile.user}/sync`)
              .then((response) => {
                dispatch(
                  addNotification({
                    uniqueId: response.data.task,
                    createdDate: new Date().toISOString(),
                    message: `Sync Profile task started. Task ID: ${response.data.task}`,
                    status: 'Info',
                    read: false,
                    timeout: 5000,
                  })
                );
              })
              .catch((r) => console.error(r))
          }
        >
          Sync Site Permissions
        </RcraApiUserBtn>
      </div>
    </>
  );
}
