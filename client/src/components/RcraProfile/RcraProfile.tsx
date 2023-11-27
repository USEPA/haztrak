import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { RcraApiUserBtn } from 'components/Rcrainfo';
import { HtForm, HtSpinner } from 'components/UI';
import { useProgressTracker } from 'hooks';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserApi } from 'services';
import {
  addAlert,
  addTask,
  getRcraProfile,
  RcrainfoProfileState,
  updateProfile,
  useAppDispatch,
} from 'store';
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
  const [taskId, setTaskId] = useState<undefined | string>();
  const { rcraSites, isLoading, ...formValues } = profile;
  const dispatch = useAppDispatch();
  const { inProgress, error } = useProgressTracker({
    taskId: taskId,
    reduxAction: getRcraProfile(),
  });

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
   * submitting the RcraProfile form (RCRAInfo API ID, Key, username, etc.)
   * @param data {ProfileState}
   */
  const onSubmit = (data: RcraProfileForm) => {
    setProfileLoading(!profileLoading);
    setEditable(!editable);
    UserApi.updateRcrainfoProfile({ username: profile.user, data: data })
      .then((r) => {
        dispatch(updateProfile(r.data));
      })
      .then(() => dispatch(getRcraProfile()))
      .then(() => setProfileLoading(!profileLoading))
      .catch((error: AxiosError) => toast.error(error.message));
  };

  if (profile.isLoading) {
    return (
      <Container>
        <HtSpinner />
      </Container>
    );
  }

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
        {inProgress ? (
          <HtSpinner />
        ) : (
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
                Object.values(profile.rcraSites).map((site) => {
                  return (
                    <tr key={`permissionsRow${site.epaSiteId}`}>
                      <td>{site.epaSiteId}</td>
                      <td>{site.permissions.eManifest}</td>
                      <td>{site.permissions.biennialReport}</td>
                      <td>{site.permissions.annualReport}</td>
                      <td>{site.permissions.WIETS}</td>
                      <td>{site.permissions.myRCRAid}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
      </Container>
      <div className="mx-1 d-flex flex-row-reverse">
        <RcraApiUserBtn
          className="mx-2"
          variant="primary"
          onClick={() => {
            UserApi.syncRcrainfoProfile()
              .then((response) => {
                dispatch(
                  addTask({
                    taskId: response.data.taskId,
                    status: 'PENDING',
                    taskName: 'Syncing RCRAInfo Profile',
                  })
                );
                setTaskId(response.data.taskId);
              })
              .catch((error: AxiosError) =>
                dispatch(addAlert({ message: error.message, type: 'error' }))
              );
          }}
        >
          Sync Site Permissions
        </RcraApiUserBtn>
      </div>
    </>
  );
}
