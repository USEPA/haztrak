import { zodResolver } from '@hookform/resolvers/zod';
import { RcraApiUserBtn } from 'components/buttons';
import { HtForm } from 'components/Ht';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { htApi } from 'services';
import { HtApi } from 'services/htApi';
import { addNotification, useAppDispatch, useAppSelector } from 'store';
import { getRcraProfile, updateProfile } from 'store/profileSlice';
import { RcrainfoProfileState, selectHaztrakSites } from 'store/profileSlice/profile.slice';
import { z } from 'zod';

interface ProfileViewProps {
  profile: RcrainfoProfileState;
}

const rcraProfileForm = z.object({
  rcraAPIID: z.string().min(36).optional(),
  rcraAPIKey: z.string().min(20).optional(),
  rcraUsername: z.string().min(8).optional(),
});

type RcraProfileForm = z.infer<typeof rcraProfileForm>;

export function RcraProfile({ profile }: ProfileViewProps) {
  const [editable, setEditable] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const userSites = useAppSelector(selectHaztrakSites);
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
   * @param data {ProfileState}
   */
  const onSubmit = (data: RcraProfileForm) => {
    setProfileLoading(!profileLoading);
    setEditable(!editable);
    htApi
      .put(`/rcra/profile/${profile.user}`, data)
      .then((r) => {
        dispatch(updateProfile(r.data));
      })
      .then(() => dispatch(getRcraProfile()))
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
        <h4>RCRAInfo Sites</h4>
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
                <tr key={`permissionsRow${site.epaSiteId}`}>
                  <td>
                    {/* @ts-ignore */}
                    {site.epaSiteId in userSites ? (
                      <Link to={`/site/${site.epaSiteId}`}>{site.epaSiteId}</Link>
                    ) : (
                      site.epaSiteId
                    )}
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
          onClick={() => {
            HtApi.syncRcrainfoProfile()
              .then(({ data }) => {
                dispatch(
                  addNotification({
                    uniqueId: data.taskId,
                    createdDate: new Date().toISOString(),
                    message: `Sync Profile task started. Task ID: ${data.taskId}`,
                    status: 'Info',
                    read: false,
                    timeout: 5000,
                  })
                );
              })
              .catch((r) => console.error(r));
          }}
        >
          Sync Site Permissions
        </RcraApiUserBtn>
      </div>
    </>
  );
}
